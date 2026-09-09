import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.models.user import User
from app.models.college import College
from app.schemas.schemas import UserRegister, UserLogin, OTPVerify, Token, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/colleges")
def list_colleges(db: Session = Depends(get_db)):
    colleges = db.query(College).all()
    return colleges

@router.post("/register", response_model=Token)
def register(req: UserRegister, db: Session = Depends(get_db)):
    # Check if email exists
    if db.query(User).filter(User.email == req.email.lower()).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == req.username.lower()).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Generate 6-digit OTP code for simulation
    otp = str(random.randint(100000, 999999))
    otp_exp = datetime.utcnow() + timedelta(minutes=15)

    # Check if college exists
    college = None
    if req.college_id:
        college = db.query(College).filter(College.id == req.college_id).first()

    # Determine initial verification status
    # In student network: if ID card is provided or domain matches college, set PENDING or VERIFIED
    new_user = User(
        email=req.email.lower(),
        username=req.username.lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        college_id=req.college_id,
        major=req.major,
        graduation_year=req.graduation_year,
        student_id_number=req.student_id_number,
        id_card_image_url=req.id_card_image_url,
        verification_status="PENDING", # Needs OTP or admin ID verification
        role="STUDENT",
        is_active=True,
        is_email_verified=False,
        otp_code=otp,
        otp_expires_at=otp_exp
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": token, "token_type": "bearer", "user": new_user}

@router.post("/login", response_model=Token)
def login(req: UserLogin, db: Session = Depends(get_db)):
    identifier = req.email_or_username.lower().strip()
    user = db.query(User).filter(
        (User.email == identifier) | (User.username == identifier)
    ).first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email/username or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account has been suspended")

    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/send-otp")
def send_otp(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student account not found")

    otp = str(random.randint(100000, 999999))
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    # Returned in response for development / demo auto-fill convenience
    return {
        "message": f"Verification code sent to {email}",
        "demo_otp": otp
    }

@router.post("/verify-otp")
def verify_otp(req: OTPVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student account not found")

    if user.otp_code != req.code:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    if user.otp_expires_at and datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="Verification code has expired")

    user.is_email_verified = True
    user.verification_status = "VERIFIED"
    user.otp_code = None
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.id)})
    return {
        "message": "Student successfully verified!",
        "access_token": token,
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_current_student(current_user: User = Depends(get_current_user)):
    return current_user
