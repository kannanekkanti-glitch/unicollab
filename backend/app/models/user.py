from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    
    # Student Details
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=True)
    major = Column(String(150), nullable=True)             # e.g., 'Computer Science & Engineering'
    graduation_year = Column(Integer, nullable=True)        # e.g., 2026
    student_id_number = Column(String(100), nullable=True)  # e.g., 'CS2026042'
    
    # Profile information
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    cover_url = Column(String(500), nullable=True)
    skills = Column(Text, nullable=True)                   # Comma-separated or JSON string, e.g. "React,Python,UI/UX,FastAPI"
    interests = Column(Text, nullable=True)                # e.g. "AI,Web3,Robotics,Competitive Coding"
    github_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)
    
    # Verification & Role
    verification_status = Column(String(50), default="VERIFIED")  # 'PENDING', 'VERIFIED', 'REJECTED'
    id_card_image_url = Column(String(500), nullable=True)
    role = Column(String(50), default="STUDENT")                  # 'STUDENT', 'CLUB_LEAD', 'ADMIN'
    is_active = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=True)
    
    # OTP simulation
    otp_code = Column(String(10), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    college = relationship("College", back_populates="students")
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    created_projects = relationship("Project", back_populates="creator", foreign_keys="Project.creator_id", cascade="all, delete-orphan")
    project_memberships = relationship("ProjectMember", back_populates="user", cascade="all, delete-orphan")
    hackathon_teams = relationship("HackathonTeamMember", back_populates="user", cascade="all, delete-orphan")
    event_rsvps = relationship("EventRSVP", back_populates="user", cascade="all, delete-orphan")
    club_memberships = relationship("ClubMember", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan", foreign_keys="Notification.user_id")
