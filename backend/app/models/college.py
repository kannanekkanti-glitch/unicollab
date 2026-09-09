from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class College(Base):
    __tablename__ = "colleges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    short_code = Column(String(50), index=True)  # e.g., 'MIT', 'Stanford', 'IITB'
    domain = Column(String(100), index=True)      # e.g., 'mit.edu', 'stanford.edu'
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100), default="Global")
    logo_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    students = relationship("User", back_populates="college")
    posts = relationship("Post", back_populates="college")
    events = relationship("Event", back_populates="college")
    clubs = relationship("Club", back_populates="college")
