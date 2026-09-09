from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=True)
    
    title = Column(String(250), nullable=False)
    tagline = Column(String(300), nullable=True)
    description = Column(Text, nullable=False)
    domain = Column(String(100), default="Web Development") # 'AI / ML', 'Web Development', 'Mobile App', 'Cybersecurity', 'Blockchain', 'Hardware / IoT'
    stage = Column(String(50), default="In Progress")        # 'Ideation', 'In Progress', 'MVP Ready', 'Completed'
    
    skills_required = Column(Text, nullable=True)           # e.g., "React,Python,Tailwind,PyTorch"
    open_roles = Column(Text, nullable=True)                # e.g., "Frontend Developer,ML Researcher,UI/UX Designer"
    
    repo_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    cover_image_url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    creator = relationship("User", back_populates="created_projects", foreign_keys=[creator_id])
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan")
    collab_requests = relationship("CollaborationRequest", back_populates="project", cascade="all, delete-orphan")

class ProjectMember(Base):
    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role_name = Column(String(100), default="Member")
    joined_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="members")
    user = relationship("User", back_populates="project_memberships")

class CollaborationRequest(Base):
    __tablename__ = "collaboration_requests"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    desired_role = Column(String(100), nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING") # 'PENDING', 'ACCEPTED', 'REJECTED'
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="collab_requests")
    user = relationship("User")
