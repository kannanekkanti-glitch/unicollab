from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.core.database import get_db
from app.models.user import User
from app.models.post import Post
from app.models.project import Project
from app.models.hackathon import Hackathon
from app.models.event import Event
from app.models.club import Club
from app.models.college import College
from app.api.posts import format_post
from app.api.clubs import format_club

router = APIRouter(prefix="/search", tags=["Global Multi-Entity Search"])

@router.get("")
def global_search(
    q: str = Query(..., min_length=1),
    college_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    term = f"%{q.strip()}%"

    # Search Students
    students_q = db.query(User).outerjoin(College).filter(
        User.is_active == True,
        or_(
            User.full_name.ilike(term),
            User.username.ilike(term),
            User.email.ilike(term),
            User.skills.ilike(term),
            User.major.ilike(term),
            College.name.ilike(term),
            College.short_code.ilike(term)
        )
    )
    if college_id:
        students_q = students_q.filter(User.college_id == college_id)
    students = students_q.limit(10).all()

    # Search Posts
    posts_q = db.query(Post).filter(
        or_(
            Post.title.ilike(term),
            Post.content.ilike(term),
            Post.category.ilike(term)
        )
    )
    if college_id:
        posts_q = posts_q.filter(Post.college_id == college_id)
    posts = [format_post(p) for p in posts_q.order_by(desc(Post.created_at)).limit(10).all()]

    # Search Projects
    projects_q = db.query(Project).filter(
        or_(
            Project.title.ilike(term),
            Project.description.ilike(term),
            Project.skills_required.ilike(term),
            Project.open_roles.ilike(term),
            Project.domain.ilike(term)
        )
    )
    if college_id:
        projects_q = projects_q.filter(Project.college_id == college_id)
    projects = projects_q.order_by(desc(Project.created_at)).limit(10).all()

    # Search Hackathons
    hackathons = db.query(Hackathon).filter(
        or_(
            Hackathon.title.ilike(term),
            Hackathon.description.ilike(term),
            Hackathon.tags.ilike(term)
        )
    ).limit(10).all()

    # Search Events
    events_q = db.query(Event).filter(
        or_(
            Event.title.ilike(term),
            Event.description.ilike(term),
            Event.category.ilike(term),
            Event.location.ilike(term)
        )
    )
    if college_id:
        events_q = events_q.filter(Event.college_id == college_id)
    events = events_q.order_by(Event.start_time.asc()).limit(10).all()

    # Search Clubs
    clubs_q = db.query(Club).filter(
        or_(
            Club.name.ilike(term),
            Club.tagline.ilike(term),
            Club.description.ilike(term),
            Club.category.ilike(term)
        )
    )
    if college_id:
        clubs_q = clubs_q.filter(Club.college_id == college_id)
    clubs = [format_club(c) for c in clubs_q.limit(10).all()]

    return {
        "query": q,
        "results": {
            "students": students,
            "posts": posts,
            "projects": projects,
            "hackathons": hackathons,
            "events": events,
            "clubs": clubs,
            "total_count": len(students) + len(posts) + len(projects) + len(hackathons) + len(events) + len(clubs)
        }
    }
