from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.club import Club, ClubMember, ClubAnnouncement
from app.schemas.schemas import ClubCreate, ClubOut, ClubAnnouncementCreate, ClubAnnouncementOut

router = APIRouter(prefix="/clubs", tags=["Clubs & Communities"])

def format_club(club: Club, current_user_id: Optional[int] = None) -> dict:
    is_member = False
    if current_user_id:
        is_member = any(m.user_id == current_user_id for m in club.members)

    announcements_data = []
    for ann in sorted(club.announcements, key=lambda x: x.created_at, reverse=True):
        announcements_data.append({
            "id": ann.id,
            "author": ann.author,
            "title": ann.title,
            "content": ann.content,
            "created_at": ann.created_at
        })

    return {
        "id": club.id,
        "college": club.college,
        "lead": club.lead,
        "name": club.name,
        "tagline": club.tagline,
        "description": club.description,
        "category": club.category,
        "logo_url": club.logo_url,
        "banner_url": club.banner_url,
        "instagram_handle": club.instagram_handle,
        "discord_url": club.discord_url,
        "website_url": club.website_url,
        "members_count": len(club.members),
        "is_member": is_member,
        "announcements": announcements_data,
        "created_at": club.created_at
    }

@router.get("", response_model=List[ClubOut])
def get_clubs(
    college_id: Optional[int] = None,
    category: Optional[str] = None,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    q = db.query(Club)
    if college_id:
        q = q.filter(Club.college_id == college_id)
    if category and category != "All":
        q = q.filter(Club.category == category)

    clubs = q.order_by(Club.name.asc()).all()
    uid = current_user.id if current_user else None
    return [format_club(c, uid) for c in clubs]

@router.get("/{club_id}", response_model=ClubOut)
def get_club(
    club_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    c = db.query(Club).filter(Club.id == club_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Club not found")
    uid = current_user.id if current_user else None
    return format_club(c, uid)

@router.post("", response_model=ClubOut)
def create_club(
    req: ClubCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    club = Club(
        college_id=current_user.college_id or 1,
        lead_id=current_user.id,
        name=req.name,
        tagline=req.tagline,
        description=req.description,
        category=req.category,
        logo_url=req.logo_url,
        banner_url=req.banner_url,
        instagram_handle=req.instagram_handle,
        discord_url=req.discord_url,
        website_url=req.website_url
    )
    db.add(club)
    db.flush()

    lead_member = ClubMember(
        club_id=club.id,
        user_id=current_user.id,
        role="Lead",
        status="ACTIVE"
    )
    db.add(lead_member)
    db.commit()
    db.refresh(club)
    return format_club(club, current_user.id)

@router.post("/{club_id}/join")
def join_club(
    club_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")

    existing = db.query(ClubMember).filter(
        ClubMember.club_id == club_id,
        ClubMember.user_id == current_user.id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "left", "is_member": False}
    else:
        new_member = ClubMember(club_id=club_id, user_id=current_user.id, role="Member", status="ACTIVE")
        db.add(new_member)
        db.commit()
        return {"status": "joined", "is_member": True}

@router.post("/{club_id}/announcements", response_model=ClubAnnouncementOut)
def create_announcement(
    club_id: int,
    req: ClubAnnouncementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")

    is_lead = club.lead_id == current_user.id or any(
        m.user_id == current_user.id and m.role in ["Lead", "Core Team"] for m in club.members
    )
    if not is_lead and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only club leads can post announcements")

    ann = ClubAnnouncement(
        club_id=club_id,
        author_id=current_user.id,
        title=req.title,
        content=req.content
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return ann
