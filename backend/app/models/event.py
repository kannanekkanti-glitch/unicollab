from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    college_id = Column(Integer, ForeignKey("colleges.id"), nullable=True) # Null if inter-college
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String(250), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), default="Tech Fest") # 'Tech Fest', 'Cultural Fest', 'Workshop', 'Sports', 'Seminar', 'Hackathon'
    location = Column(String(200), nullable=False)      # e.g., 'Main Auditorium' or 'Online Zoom'
    is_online = Column(Boolean, default=False)
    
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    registration_deadline = Column(DateTime, nullable=True)
    
    banner_url = Column(String(500), nullable=True)
    ticket_link = Column(String(500), nullable=True)
    is_free = Column(Boolean, default=True)
    price_info = Column(String(100), default="Free")
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    college = relationship("College", back_populates="events")
    creator = relationship("User")
    rsvps = relationship("EventRSVP", back_populates="event", cascade="all, delete-orphan")

class EventRSVP(Base):
    __tablename__ = "event_rsvps"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="GOING") # 'GOING', 'INTERESTED'
    created_at = Column(DateTime, default=datetime.utcnow)

    event = relationship("Event", back_populates="rsvps")
    user = relationship("User", back_populates="event_rsvps")
