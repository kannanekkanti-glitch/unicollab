from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.project import Project, ProjectMember, CollaborationRequest
from app.models.notification import Notification
from app.schemas.schemas import ProjectCreate, ProjectOut, CollabRequestCreate, CollabRequestOut

router = APIRouter(prefix="/projects", tags=["Projects & Teammates"])

@router.get("", response_model=List[ProjectOut])
def get_projects(
    domain: Optional[str] = None,
    skill: Optional[str] = None,
    stage: Optional[str] = None,
    role: Optional[str] = None,
    search: Optional[str] = None,
    college_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Project)
    if domain and domain != "All":
        q = q.filter(Project.domain == domain)
    if stage and stage != "All":
        q = q.filter(Project.stage == stage)
    if skill:
        q = q.filter(Project.skills_required.ilike(f"%{skill}%"))
    if role:
        q = q.filter(Project.open_roles.ilike(f"%{role}%"))
    if college_id:
        q = q.filter(Project.college_id == college_id)
    if search:
        term = f"%{search}%"
        q = q.filter(
            or_(
                Project.title.ilike(term),
                Project.tagline.ilike(term),
                Project.description.ilike(term),
                Project.skills_required.ilike(term),
                Project.open_roles.ilike(term)
            )
        )

    return q.order_by(desc(Project.created_at)).all()

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("", response_model=ProjectOut)
def create_project(
    req: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = Project(
        creator_id=current_user.id,
        college_id=current_user.college_id,
        title=req.title,
        tagline=req.tagline,
        description=req.description,
        domain=req.domain,
        stage=req.stage,
        skills_required=req.skills_required,
        open_roles=req.open_roles,
        repo_url=req.repo_url,
        demo_url=req.demo_url,
        cover_image_url=req.cover_image_url
    )
    db.add(project)
    db.flush()

    # Add creator as Lead member
    creator_member = ProjectMember(
        project_id=project.id,
        user_id=current_user.id,
        role_name="Project Lead"
    )
    db.add(creator_member)
    db.commit()
    db.refresh(project)
    return project

@router.post("/{project_id}/apply", response_model=CollabRequestOut)
def apply_to_project(
    project_id: int,
    req: CollabRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if project.creator_id == current_user.id:
        raise HTTPException(status_code=400, detail="You are the creator of this project")

    # Check if already a member
    is_member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    if is_member:
        raise HTTPException(status_code=400, detail="You are already a member of this project")

    # Check if existing pending request
    existing = db.query(CollaborationRequest).filter(
        CollaborationRequest.project_id == project_id,
        CollaborationRequest.user_id == current_user.id,
        CollaborationRequest.status == "PENDING"
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Application already pending")

    collab_req = CollaborationRequest(
        project_id=project_id,
        user_id=current_user.id,
        desired_role=req.desired_role,
        message=req.message,
        status="PENDING"
    )
    db.add(collab_req)

    # Notify project creator
    notification = Notification(
        user_id=project.creator_id,
        actor_id=current_user.id,
        title="New Teammate Request",
        message=f"{current_user.full_name} applied for role '{req.desired_role}' on '{project.title}'",
        notification_type="TEAM_REQUEST",
        link=f"/projects/{project.id}"
    )
    db.add(notification)
    db.commit()
    db.refresh(collab_req)
    return collab_req

@router.get("/{project_id}/requests", response_model=List[CollabRequestOut])
def list_project_requests(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.creator_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only the project creator can view requests")

    return db.query(CollaborationRequest).filter(CollaborationRequest.project_id == project_id).all()

@router.post("/requests/{request_id}/action")
def manage_collab_request(
    request_id: int,
    action: str, # 'ACCEPT' or 'REJECT'
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(CollaborationRequest).filter(CollaborationRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    project = db.query(Project).filter(Project.id == req.project_id).first()
    if project.creator_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")

    if action == "ACCEPT":
        req.status = "ACCEPTED"
        # Add to project members
        new_member = ProjectMember(
            project_id=project.id,
            user_id=req.user_id,
            role_name=req.desired_role
        )
        db.add(new_member)
        # Send acceptance notification
        notif = Notification(
            user_id=req.user_id,
            actor_id=current_user.id,
            title="Teammate Request Accepted!",
            message=f"You have joined '{project.title}' as {req.desired_role}!",
            notification_type="TEAM_REQUEST",
            link=f"/projects/{project.id}"
        )
        db.add(notif)
    else:
        req.status = "REJECTED"
        notif = Notification(
            user_id=req.user_id,
            actor_id=current_user.id,
            title="Application Update",
            message=f"Your request to join '{project.title}' was not accepted at this time.",
            notification_type="TEAM_REQUEST",
            link=f"/projects/{project.id}"
        )
        db.add(notif)

    db.commit()
    return {"message": f"Request {action.lower()}ed successfully"}
