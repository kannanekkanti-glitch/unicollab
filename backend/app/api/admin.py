from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin
from app.models.user import User
from app.models.post import Post, Comment
from app.models.project import Project
from app.models.event import Event
from app.models.club import Club
from app.models.moderation import Report
from app.models.college import College
from app.schemas.schemas import UserOut, ReportCreate, ReportOut, ModerationAction, StudentVerificationAction

router = APIRouter(prefix="/admin", tags=["Admin & Moderation"])

# ==================== USER REPORTING (PUBLIC TO LOGGED IN USERS) ====================

@router.post("/reports", response_model=ReportOut)
def submit_report(
    req: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    report = Report(
        reporter_id=current_user.id,
        target_type=req.target_type,
        target_id=req.target_id,
        reason=req.reason,
        details=req.details,
        status="PENDING"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

# ==================== ADMIN-ONLY ENDPOINTS ====================

@router.get("/metrics")
def get_platform_metrics(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    verified_users = db.query(User).filter(User.verification_status == "VERIFIED").count()
    pending_verifications = db.query(User).filter(User.verification_status == "PENDING").count()
    total_posts = db.query(Post).count()
    total_projects = db.query(Project).count()
    total_events = db.query(Event).count()
    total_clubs = db.query(Club).count()
    pending_reports = db.query(Report).filter(Report.status == "PENDING").count()

    return {
        "total_users": total_users,
        "verified_users": verified_users,
        "pending_verifications": pending_verifications,
        "total_posts": total_posts,
        "total_projects": total_projects,
        "total_events": total_events,
        "total_clubs": total_clubs,
        "pending_reports": pending_reports
    }

@router.get("/verifications", response_model=List[UserOut])
def get_pending_verifications(
    status_filter: str = "PENDING", # 'PENDING', 'VERIFIED', 'REJECTED'
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    users = db.query(User).filter(
        User.verification_status == status_filter
    ).order_by(desc(User.created_at)).all()
    return users

@router.post("/verifications/{user_id}")
def review_student_verification(
    user_id: int,
    action: StudentVerificationAction,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    student = db.query(User).filter(User.id == user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.verification_status = action.status
    if action.status == "VERIFIED":
        student.is_email_verified = True

    db.commit()
    return {"message": f"Student verification updated to {action.status}", "user_id": user_id}

@router.get("/reports", response_model=List[ReportOut])
def get_reports(
    status_filter: str = "PENDING",
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    reports = db.query(Report).filter(
        Report.status == status_filter
    ).order_by(desc(Report.created_at)).all()
    return reports

@router.post("/reports/{report_id}/resolve")
def resolve_report(
    report_id: int,
    act: ModerationAction,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if act.action == "DISMISS":
        report.status = "DISMISSED"
        report.action_taken = "NO_ACTION"
    elif act.action == "DELETE_TARGET":
        report.status = "RESOLVED"
        report.action_taken = "TARGET_DELETED"
        if report.target_type == "POST":
            post = db.query(Post).filter(Post.id == report.target_id).first()
            if post:
                db.delete(post)
        elif report.target_type == "COMMENT":
            comm = db.query(Comment).filter(Comment.id == report.target_id).first()
            if comm:
                db.delete(comm)
    elif act.action == "BAN_USER":
        report.status = "RESOLVED"
        report.action_taken = "USER_BANNED"
        target_user = None
        if report.target_type == "USER":
            target_user = db.query(User).filter(User.id == report.target_id).first()
        elif report.target_type == "POST":
            p = db.query(Post).filter(Post.id == report.target_id).first()
            if p:
                target_user = p.author
        if target_user:
            target_user.is_active = False

    report.resolved_at = datetime.utcnow()
    db.commit()
    return {"message": f"Report action '{act.action}' applied successfully"}

@router.post("/colleges")
def create_college(
    name: str,
    short_code: str,
    domain: str,
    city: str,
    state: str,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    c = College(name=name, short_code=short_code, domain=domain, city=city, state=state)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c
