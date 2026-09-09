from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from app.core.database import get_db, SessionLocal
from app.core.security import get_current_user
from app.models.user import User
from app.models.chat import Conversation, ConversationParticipant, Message
from app.models.notification import Notification
from app.schemas.schemas import ConversationOut, MessageOut, MessageCreate
from app.services.socket_manager import manager

router = APIRouter(prefix="/chat", tags=["Real-time Chat & Messages"])

def format_conversation(conv: Conversation, current_user_id: int) -> dict:
    participants = [p.user for p in conv.participants]
    last_msg = None
    if conv.messages:
        sorted_msgs = sorted(conv.messages, key=lambda m: m.created_at, reverse=True)
        last_msg = sorted_msgs[0]

    # Calculate unread count for current user
    user_p = next((p for p in conv.participants if p.user_id == current_user_id), None)
    unread_count = 0
    if user_p:
        unread_count = len([
            m for m in conv.messages 
            if m.sender_id != current_user_id and m.created_at > (user_p.last_read_at or datetime.min)
        ])

    return {
        "id": conv.id,
        "is_group": conv.is_group,
        "title": conv.title,
        "project_id": conv.project_id,
        "participants": participants,
        "last_message": last_msg,
        "unread_count": unread_count,
        "updated_at": conv.updated_at
    }

@router.get("/conversations", response_model=List[ConversationOut])
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find all conversations where current user is a participant
    participant_entries = db.query(ConversationParticipant).filter(
        ConversationParticipant.user_id == current_user.id
    ).all()
    conv_ids = [p.conversation_id for p in participant_entries]

    conversations = db.query(Conversation).filter(
        Conversation.id.in_(conv_ids)
    ).order_by(desc(Conversation.updated_at)).all()

    return [format_conversation(c, current_user.id) for c in conversations]

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageOut])
def get_messages(
    conversation_id: int,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify participant
    part = db.query(ConversationParticipant).filter(
        ConversationParticipant.conversation_id == conversation_id,
        ConversationParticipant.user_id == current_user.id
    ).first()
    if not part and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not a participant in this conversation")

    # Update last_read_at
    if part:
        part.last_read_at = datetime.utcnow()
        db.commit()

    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).limit(limit).all()

    return messages

@router.post("/messages", response_model=MessageOut)
async def send_message(
    req: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conversation_id = req.conversation_id

    # If recipient_id is provided, find or create 1-on-1 direct conversation
    if not conversation_id and req.recipient_id:
        if req.recipient_id == current_user.id:
            raise HTTPException(status_code=400, detail="Cannot message yourself")

        # Check existing 1-on-1 between these two users
        c1 = db.query(ConversationParticipant.conversation_id).filter(
            ConversationParticipant.user_id == current_user.id
        ).subquery()
        existing_conv_part = db.query(ConversationParticipant).filter(
            ConversationParticipant.conversation_id.in_(c1),
            ConversationParticipant.user_id == req.recipient_id
        ).first()

        if existing_conv_part:
            conversation_id = existing_conv_part.conversation_id
        else:
            recipient = db.query(User).filter(User.id == req.recipient_id).first()
            if not recipient:
                raise HTTPException(status_code=404, detail="Recipient student not found")

            # Create new direct conversation
            new_conv = Conversation(is_group=False)
            db.add(new_conv)
            db.flush()

            p1 = ConversationParticipant(conversation_id=new_conv.id, user_id=current_user.id)
            p2 = ConversationParticipant(conversation_id=new_conv.id, user_id=req.recipient_id)
            db.add_all([p1, p2])
            db.commit()
            conversation_id = new_conv.id

    if not conversation_id:
        raise HTTPException(status_code=400, detail="Conversation ID or Recipient ID required")

    msg = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        content=req.content.strip(),
        attachment_url=req.attachment_url
    )
    db.add(msg)

    # Update conversation updated_at
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if conv:
        conv.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(msg)

    # Real-time WebSocket dispatch
    payload = {
        "type": "NEW_MESSAGE",
        "message": {
            "id": msg.id,
            "conversation_id": msg.conversation_id,
            "sender_id": msg.sender_id,
            "sender": {
                "id": current_user.id,
                "full_name": current_user.full_name,
                "username": current_user.username,
                "avatar_url": current_user.avatar_url
            },
            "content": msg.content,
            "attachment_url": msg.attachment_url,
            "created_at": msg.created_at.isoformat()
        }
    }

    participant_ids = [p.user_id for p in conv.participants if p.user_id != current_user.id]
    await manager.broadcast_to_users(participant_ids, payload)

    return msg

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            # Listen for heartbeats or client events
            data = await websocket.receive_json()
            if data.get("type") == "PING":
                await websocket.send_json({"type": "PONG"})
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
    except Exception:
        manager.disconnect(user_id, websocket)
