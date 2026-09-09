import os
import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.core.config import settings
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.schemas import UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["Students"])

@router.get("/search", response_model=List[UserOut])
def search_students(
    query: Optional[str] = None,
    college_id: Optional[int] = None,
    skill: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(User).filter(User.is_active == True)
    if college_id:
        q = q.filter(User.college_id == college_id)
    if query:
        term = f"%{query}%"
        q = q.filter(
            or_(
                User.full_name.ilike(term),
                User.username.ilike(term),
                User.major.ilike(term),
                User.skills.ilike(term),
                User.interests.ilike(term)
            )
        )
    if skill:
        q = q.filter(User.skills.ilike(f"%{skill}%"))
    
    return q.limit(50).all()

@router.get("/{user_id}", response_model=UserOut)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")
    return user

@router.put("/profile", response_model=UserOut)
def update_profile(
    req: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    for field, value in req.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Allowed extensions
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".gif"]:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    file_url = f"/uploads/{filename}"
    return {"url": file_url, "filename": filename}
