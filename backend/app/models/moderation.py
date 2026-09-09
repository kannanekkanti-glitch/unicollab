from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    target_type = Column(String(50), nullable=False) # 'POST', 'COMMENT', 'USER', 'PROJECT'
    target_id = Column(Integer, nullable=False)
    reason = Column(String(100), nullable=False)     # 'Harassment', 'Spam', 'Hate Speech', 'Misinformation', 'Other'
    details = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING")   # 'PENDING', 'RESOLVED', 'DISMISSED'
    action_taken = Column(String(100), nullable=True) # 'WARNING', 'POST_REMOVED', 'USER_BANNED', 'NO_ACTION'
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    reporter = relationship("User", foreign_keys=[reporter_id])
