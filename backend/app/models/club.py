from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=False)
    lead_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    name = Column(String(200), nullable=False)
    tagline = Column(String(250), nullable=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Technical") # 'Technical', 'Cultural', 'Sports', 'Entrepreneurship', 'Literary', 'Social Service'
    logo_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)
    instagram_handle = Column(String(100), nullable=True)
    discord_url = Column(String(200), nullable=True)
    website_url = Column(String(200), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    college = relationship("College", back_populates="clubs")
    lead = relationship("User")
    members = relationship("ClubMember", back_populates="club", cascade="all, delete-orphan")
    announcements = relationship("ClubAnnouncement", back_populates="club", cascade="all, delete-orphan")

class ClubMember(Base):
    __tablename__ = "club_members"

    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(50), default="Member") # 'Lead', 'Core Team', 'Member'
    status = Column(String(50), default="ACTIVE") # 'ACTIVE', 'PENDING'
    joined_at = Column(DateTime, default=datetime.utcnow)

    club = relationship("Club", back_populates="members")
    user = relationship("User", back_populates="club_memberships")

class ClubAnnouncement(Base):
    __tablename__ = "club_announcements"

    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(250), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    club = relationship("Club", back_populates="announcements")
    author = relationship("User")
