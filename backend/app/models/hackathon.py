from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(250), nullable=False)
    organizer = Column(String(200), nullable=False)
    mode = Column(String(50), default="Hybrid") # 'Online', 'In-Person', 'Hybrid'
    location = Column(String(200), nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    prize_pool = Column(String(100), default="Certificates & Swag")
    registration_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    tags = Column(String(250), nullable=True) # e.g. "AI,Web3,Open Source,HealthTech"
    created_at = Column(DateTime, default=datetime.utcnow)

    teams = relationship("HackathonTeam", back_populates="hackathon", cascade="all, delete-orphan")

class HackathonTeam(Base):
    __tablename__ = "hackathon_teams"

    id = Column(Integer, primary_key=True, index=True)
    hackathon_id = Column(Integer, ForeignKey("hackathons.id"), nullable=False)
    leader_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    team_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    looking_for_roles = Column(String(250), nullable=True) # e.g. "Frontend Dev,UI/UX,Pitch Lead"
    max_members = Column(Integer, default=4)
    created_at = Column(DateTime, default=datetime.utcnow)

    hackathon = relationship("Hackathon", back_populates="teams")
    leader = relationship("User")
    members = relationship("HackathonTeamMember", back_populates="team", cascade="all, delete-orphan")
    join_requests = relationship("HackathonJoinRequest", back_populates="team", cascade="all, delete-orphan")

class HackathonTeamMember(Base):
    __tablename__ = "hackathon_team_members"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("hackathon_teams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(100), default="Member")
    joined_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("HackathonTeam", back_populates="members")
    user = relationship("User", back_populates="hackathon_teams")

class HackathonJoinRequest(Base):
    __tablename__ = "hackathon_join_requests"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("hackathon_teams.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(100), nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING") # 'PENDING', 'ACCEPTED', 'REJECTED'
    created_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("HackathonTeam", back_populates="join_requests")
    user = relationship("User")
