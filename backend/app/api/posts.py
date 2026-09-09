from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.post import Post, Comment, PostLike, PollOption, PollVote
from app.schemas.schemas import PostCreate, PostOut, CommentCreate, CommentOut, VoteRequest, PollOptionOut

router = APIRouter(prefix="/posts", tags=["Posts & Feed"])

def format_post(post: Post, current_user_id: Optional[int] = None) -> dict:
    upvotes = len([like for like in post.likes if like.vote_type == 1])
    downvotes = len([like for like in post.likes if like.vote_type == -1])
    user_vote = 0
    if current_user_id:
        for like in post.likes:
            if like.user_id == current_user_id:
                user_vote = like.vote_type
                break

    # Build poll options
    poll_options_data = []
    if post.is_poll:
        for opt in post.poll_options:
            vote_count = len(opt.votes)
            has_voted = False
            if current_user_id:
                has_voted = any(v.user_id == current_user_id for v in opt.votes)
            poll_options_data.append({
                "id": opt.id,
                "text": opt.text,
                "vote_count": vote_count,
                "has_voted": has_voted
            })

    # Mask author if anonymous
    author_data = None
    if not post.is_anonymous and post.author:
        author_data = post.author

    return {
        "id": post.id,
        "author": author_data,
        "college": post.college,
        "title": post.title,
        "content": post.content,
        "category": post.category,
        "is_campus_only": post.is_campus_only,
        "is_announcement": post.is_announcement,
        "is_anonymous": post.is_anonymous,
        "attachment_url": post.attachment_url,
        "is_poll": post.is_poll,
        "poll_question": post.poll_question,
        "poll_options": poll_options_data,
        "upvotes_count": upvotes,
        "downvotes_count": downvotes,
        "user_vote": user_vote,
        "comments_count": len(post.comments),
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }

@router.get("", response_model=List[PostOut])
def get_posts(
    feed_type: str = "all", # 'all', 'campus', 'announcements', 'trending', 'mine'
    category: Optional[str] = None,
    college_id: Optional[int] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Post)

    if feed_type == "announcements":
        query = query.filter(Post.is_announcement == True)
    elif feed_type == "campus":
        target_college = college_id or (current_user.college_id if current_user else None)
        if target_college:
            query = query.filter(Post.college_id == target_college)
    elif feed_type == "mine" and current_user:
        query = query.filter(Post.author_id == current_user.id)

    if category and category != "All":
        query = query.filter(Post.category == category)

    if college_id and feed_type != "campus":
        query = query.filter(Post.college_id == college_id)

    if feed_type == "trending":
        # Order by comment count + likes count
        query = query.order_by(desc(Post.created_at))
    else:
        query = query.order_by(desc(Post.created_at))

    posts = query.offset(offset).limit(limit).all()
    user_id = current_user.id if current_user else None
    return [format_post(p, user_id) for p in posts]

@router.get("/{post_id}", response_model=PostOut)
def get_single_post(
    post_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    user_id = current_user.id if current_user else None
    return format_post(post, user_id)

@router.post("", response_model=PostOut)
def create_post(
    req: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_post = Post(
        author_id=current_user.id,
        college_id=current_user.college_id,
        title=req.title,
        content=req.content,
        category=req.category,
        is_campus_only=req.is_campus_only,
        is_announcement=req.is_announcement and (current_user.role in ["ADMIN", "CLUB_LEAD"]),
        is_anonymous=req.is_anonymous,
        attachment_url=req.attachment_url,
        is_poll=req.is_poll,
        poll_question=req.poll_question
    )
    db.add(new_post)
    db.flush()

    if req.is_poll and req.poll_options:
        for opt_text in req.poll_options:
            opt = PollOption(post_id=new_post.id, text=opt_text.strip())
            db.add(opt)

    db.commit()
    db.refresh(new_post)
    return format_post(new_post, current_user.id)

@router.post("/{post_id}/vote")
def vote_post(
    post_id: int,
    req: VoteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == current_user.id
    ).first()

    if req.vote_type == 0:
        if existing_like:
            db.delete(existing_like)
            db.commit()
        return {"status": "cleared"}

    if existing_like:
        existing_like.vote_type = req.vote_type
    else:
        like = PostLike(post_id=post_id, user_id=current_user.id, vote_type=req.vote_type)
        db.add(like)

    db.commit()
    return {"status": "voted", "vote_type": req.vote_type}

@router.post("/{post_id}/poll/vote")
def vote_poll(
    post_id: int,
    option_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post or not post.is_poll:
        raise HTTPException(status_code=400, detail="Invalid poll post")

    # Check if user already voted on any option of this poll
    user_votes = db.query(PollVote).join(PollOption).filter(
        PollOption.post_id == post_id,
        PollVote.user_id == current_user.id
    ).all()

    for uv in user_votes:
        db.delete(uv)

    new_vote = PollVote(poll_option_id=option_id, user_id=current_user.id)
    db.add(new_vote)
    db.commit()

    return {"status": "poll_vote_recorded", "option_id": option_id}

@router.get("/{post_id}/comments", response_model=List[CommentOut])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(
        Comment.post_id == post_id,
        Comment.parent_id == None
    ).order_by(Comment.created_at.asc()).all()
    return comments

@router.post("/{post_id}/comments", response_model=CommentOut)
def add_comment(
    post_id: int,
    req: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = Comment(
        post_id=post_id,
        author_id=current_user.id,
        parent_id=req.parent_id,
        content=req.content.strip()
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized to delete post")

    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}
