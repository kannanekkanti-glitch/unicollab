from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.hackathon import Hackathon, HackathonTeam, HackathonTeamMember, HackathonJoinRequest
from app.models.notification import Notification
from app.schemas.schemas import HackathonOut, HackathonTeamCreate, HackathonTeamOut

router = APIRouter(prefix="/hackathons", tags=["Hackathons & Competitions"])

@router.get("", response_model=List[HackathonOut])
def get_hackathons(
    mode: Optional[str] = None,
    tag: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Hackathon)
    if mode and mode != "All":
        q = q.filter(Hackathon.mode == mode)
    if tag:
        q = q.filter(Hackathon.tags.ilike(f"%{tag}%"))

    hackathons = q.order_by(Hackathon.start_date.asc()).all()
    results = []
    for h in hackathons:
        results.append({
            "id": h.id,
            "title": h.title,
            "organizer": h.organizer,
            "mode": h.mode,
            "location": h.location,
            "start_date": h.start_date,
            "end_date": h.end_date,
            "prize_pool": h.prize_pool,
            "registration_url": h.registration_url,
            "banner_url": h.banner_url,
            "description": h.description,
            "tags": h.tags,
            "teams_count": len(h.teams),
            "teams": h.teams,
            "created_at": h.created_at
        })
    return results

@router.get("/{hackathon_id}", response_model=HackathonOut)
def get_hackathon(hackathon_id: int, db: Session = Depends(get_db)):
    h = db.query(Hackathon).filter(Hackathon.id == hackathon_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hackathon not found")
    return {
        "id": h.id,
        "title": h.title,
        "organizer": h.organizer,
        "mode": h.mode,
        "location": h.location,
        "start_date": h.start_date,
        "end_date": h.end_date,
        "prize_pool": h.prize_pool,
        "registration_url": h.registration_url,
        "banner_url": h.banner_url,
        "description": h.description,
        "tags": h.tags,
        "teams_count": len(h.teams),
        "teams": h.teams,
        "created_at": h.created_at
    }

@router.post("/{hackathon_id}/teams", response_model=HackathonTeamOut)
def create_hackathon_team(
    hackathon_id: int,
    req: HackathonTeamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    h = db.query(Hackathon).filter(Hackathon.id == hackathon_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    team = HackathonTeam(
        hackathon_id=hackathon_id,
        leader_id=current_user.id,
        team_name=req.team_name,
        description=req.description,
        looking_for_roles=req.looking_for_roles,
        max_members=req.max_members
    )
    db.add(team)
    db.flush()

    leader_member = HackathonTeamMember(
        team_id=team.id,
        user_id=current_user.id,
        role="Team Lead"
    )
    db.add(leader_member)
    db.commit()
    db.refresh(team)
    return team

@router.post("/teams/{team_id}/apply")
def apply_to_hackathon_team(
    team_id: int,
    role: str,
    message: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    team = db.query(HackathonTeam).filter(HackathonTeam.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    if team.leader_id == current_user.id:
        raise HTTPException(status_code=400, detail="You lead this team")

    # Check capacity
    if len(team.members) >= team.max_members:
        raise HTTPException(status_code=400, detail="Team has reached maximum members capacity")

    # Check if already joined
    if any(m.user_id == current_user.id for m in team.members):
        raise HTTPException(status_code=400, detail="You are already in this team")

    join_req = HackathonJoinRequest(
        team_id=team_id,
        user_id=current_user.id,
        role=role,
        message=message,
        status="PENDING"
    )
    db.add(join_req)

    notif = Notification(
        user_id=team.leader_id,
        actor_id=current_user.id,
        title="Hackathon Teammate Request",
        message=f"{current_user.full_name} wants to join '{team.team_name}' as {role}",
        notification_type="TEAM_REQUEST",
        link=f"/hackathons/{team.hackathon_id}"
    )
    db.add(notif)
    db.commit()
    return {"message": "Application submitted successfully"}

@router.post("/teams/{team_id}/requests/{request_id}/action")
def manage_hackathon_request(
    team_id: int,
    request_id: int,
    action: str, # 'ACCEPT' or 'REJECT'
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    team = db.query(HackathonTeam).filter(HackathonTeam.id == team_id).first()
    if not team or team.leader_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")

    join_req = db.query(HackathonJoinRequest).filter(
        HackathonJoinRequest.id == request_id,
        HackathonJoinRequest.team_id == team_id
    ).first()
    if not join_req:
        raise HTTPException(status_code=404, detail="Request not found")

    if action == "ACCEPT":
        join_req.status = "ACCEPTED"
        new_member = HackathonTeamMember(
            team_id=team.id,
            user_id=join_req.user_id,
            role=join_req.role
        )
        db.add(new_member)
    else:
        join_req.status = "REJECTED"

    db.commit()
    return {"message": f"Request {action.lower()}ed"}
