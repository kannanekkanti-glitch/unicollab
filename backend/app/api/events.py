from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.event import Event, EventRSVP
from app.schemas.schemas import EventCreate, EventOut

router = APIRouter(prefix="/events", tags=["Events & College Fests"])

@router.get("", response_model=List[EventOut])
def get_events(
    category: Optional[str] = None,
    college_id: Optional[int] = None,
    upcoming_only: bool = True,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    q = db.query(Event)
    if category and category != "All":
        q = q.filter(Event.category == category)
    if college_id:
        q = q.filter(Event.college_id == college_id)
    if upcoming_only:
        q = q.filter(Event.end_time >= datetime.utcnow())

    events = q.order_by(Event.start_time.asc()).all()
    results = []
    current_user_id = current_user.id if current_user else None

    for ev in events:
        has_rsvped = False
        user_status = None
        if current_user_id:
            for r in ev.rsvps:
                if r.user_id == current_user_id:
                    has_rsvped = True
                    user_status = r.status
                    break

        results.append({
            "id": ev.id,
            "college": ev.college,
            "creator": ev.creator,
            "title": ev.title,
            "description": ev.description,
            "category": ev.category,
            "location": ev.location,
            "is_online": ev.is_online,
            "start_time": ev.start_time,
            "end_time": ev.end_time,
            "banner_url": ev.banner_url,
            "ticket_link": ev.ticket_link,
            "is_free": ev.is_free,
            "price_info": ev.price_info,
            "rsvp_count": len(ev.rsvps),
            "has_rsvped": has_rsvped,
            "user_rsvp_status": user_status,
            "created_at": ev.created_at
        })
    return results

@router.get("/{event_id}", response_model=EventOut)
def get_event(
    event_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")

    has_rsvped = False
    user_status = None
    if current_user:
        for r in ev.rsvps:
            if r.user_id == current_user.id:
                has_rsvped = True
                user_status = r.status
                break

    return {
        "id": ev.id,
        "college": ev.college,
        "creator": ev.creator,
        "title": ev.title,
        "description": ev.description,
        "category": ev.category,
        "location": ev.location,
        "is_online": ev.is_online,
        "start_time": ev.start_time,
        "end_time": ev.end_time,
        "banner_url": ev.banner_url,
        "ticket_link": ev.ticket_link,
        "is_free": ev.is_free,
        "price_info": ev.price_info,
        "rsvp_count": len(ev.rsvps),
        "has_rsvped": has_rsvped,
        "user_rsvp_status": user_status,
        "created_at": ev.created_at
    }

@router.post("", response_model=EventOut)
def create_event(
    req: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ev = Event(
        college_id=req.college_id or current_user.college_id,
        creator_id=current_user.id,
        title=req.title,
        description=req.description,
        category=req.category,
        location=req.location,
        is_online=req.is_online,
        start_time=req.start_time,
        end_time=req.end_time,
        banner_url=req.banner_url,
        ticket_link=req.ticket_link,
        is_free=req.is_free,
        price_info=req.price_info or "Free"
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return {
        "id": ev.id,
        "college": ev.college,
        "creator": ev.creator,
        "title": ev.title,
        "description": ev.description,
        "category": ev.category,
        "location": ev.location,
        "is_online": ev.is_online,
        "start_time": ev.start_time,
        "end_time": ev.end_time,
        "banner_url": ev.banner_url,
        "ticket_link": ev.ticket_link,
        "is_free": ev.is_free,
        "price_info": ev.price_info,
        "rsvp_count": 0,
        "has_rsvped": False,
        "user_rsvp_status": None,
        "created_at": ev.created_at
    }

@router.post("/{event_id}/rsvp")
def toggle_rsvp(
    event_id: int,
    status_type: str = "GOING", # 'GOING', 'INTERESTED', 'CANCEL'
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")

    existing_rsvp = db.query(EventRSVP).filter(
        EventRSVP.event_id == event_id,
        EventRSVP.user_id == current_user.id
    ).first()

    if status_type == "CANCEL":
        if existing_rsvp:
            db.delete(existing_rsvp)
            db.commit()
        return {"status": "cancelled", "rsvp_count": len(ev.rsvps)}

    if existing_rsvp:
        existing_rsvp.status = status_type
    else:
        new_rsvp = EventRSVP(event_id=event_id, user_id=current_user.id, status=status_type)
        db.add(new_rsvp)

    db.commit()
    db.refresh(ev)
    return {"status": status_type, "rsvp_count": len(ev.rsvps)}
