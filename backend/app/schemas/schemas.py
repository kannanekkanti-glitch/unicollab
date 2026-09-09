from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime

# ==================== AUTH & USER SCHEMAS ====================

class CollegeBase(BaseModel):
    name: str
    short_code: str
    domain: str
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = "Global"
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None

class CollegeOut(CollegeBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    username: str
    college_id: Optional[int] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    student_id_number: Optional[str] = None
    id_card_image_url: Optional[str] = None

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class OTPVerify(BaseModel):
    email: EmailStr
    code: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    skills: Optional[str] = None
    interests: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    student_id_number: Optional[str] = None
    id_card_image_url: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    college_id: Optional[int] = None
    college: Optional[CollegeOut] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    student_id_number: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    skills: Optional[str] = None
    interests: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    verification_status: str
    id_card_image_url: Optional[str] = None
    role: str
    is_active: bool
    is_email_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ==================== POSTS & FEED SCHEMAS ====================

class PollOptionCreate(BaseModel):
    text: str

class PollOptionOut(BaseModel):
    id: int
    text: str
    vote_count: int = 0
    has_voted: bool = False

    class Config:
        from_attributes = True

class PostCreate(BaseModel):
    title: str
    content: str
    category: str = "General"
    is_campus_only: bool = False
    is_announcement: bool = False
    is_anonymous: bool = False
    attachment_url: Optional[str] = None
    is_poll: bool = False
    poll_question: Optional[str] = None
    poll_options: Optional[List[str]] = None

class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[int] = None

class CommentOut(BaseModel):
    id: int
    post_id: int
    author: Optional[UserOut] = None
    content: str
    created_at: datetime
    replies: List['CommentOut'] = []

    class Config:
        from_attributes = True

class PostOut(BaseModel):
    id: int
    author: Optional[UserOut] = None
    college: Optional[CollegeOut] = None
    title: str
    content: str
    category: str
    is_campus_only: bool
    is_announcement: bool
    is_anonymous: bool
    attachment_url: Optional[str] = None
    is_poll: bool
    poll_question: Optional[str] = None
    poll_options: List[PollOptionOut] = []
    upvotes_count: int = 0
    downvotes_count: int = 0
    user_vote: int = 0 # 1, -1, or 0
    comments_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VoteRequest(BaseModel):
    vote_type: int # 1 or -1 or 0 (cancel)

# ==================== PROJECTS & TEAMMATES ====================

class ProjectCreate(BaseModel):
    title: str
    tagline: Optional[str] = None
    description: str
    domain: str = "Web Development"
    stage: str = "In Progress"
    skills_required: Optional[str] = None
    open_roles: Optional[str] = None
    repo_url: Optional[str] = None
    demo_url: Optional[str] = None
    cover_image_url: Optional[str] = None

class ProjectMemberOut(BaseModel):
    id: int
    user: UserOut
    role_name: str
    joined_at: datetime

    class Config:
        from_attributes = True

class CollabRequestCreate(BaseModel):
    desired_role: str
    message: Optional[str] = None

class CollabRequestOut(BaseModel):
    id: int
    project_id: int
    user: UserOut
    desired_role: str
    message: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectOut(BaseModel):
    id: int
    creator: UserOut
    college_id: Optional[int] = None
    title: str
    tagline: Optional[str] = None
    description: str
    domain: str
    stage: str
    skills_required: Optional[str] = None
    open_roles: Optional[str] = None
    repo_url: Optional[str] = None
    demo_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    members: List[ProjectMemberOut] = []
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== HACKATHONS ====================

class HackathonTeamMemberOut(BaseModel):
    id: int
    user: UserOut
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True

class HackathonTeamCreate(BaseModel):
    team_name: str
    description: Optional[str] = None
    looking_for_roles: Optional[str] = None
    max_members: int = 4

class HackathonJoinRequestOut(BaseModel):
    id: int
    team_id: int
    user: UserOut
    role: str
    message: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class HackathonTeamOut(BaseModel):
    id: int
    hackathon_id: int
    leader: UserOut
    team_name: str
    description: Optional[str] = None
    looking_for_roles: Optional[str] = None
    max_members: int
    members: List[HackathonTeamMemberOut] = []
    join_requests: List[HackathonJoinRequestOut] = []
    created_at: datetime

    class Config:
        from_attributes = True

class HackathonOut(BaseModel):
    id: int
    title: str
    organizer: str
    mode: str
    location: Optional[str] = None
    start_date: datetime
    end_date: datetime
    prize_pool: str
    registration_url: Optional[str] = None
    banner_url: Optional[str] = None
    description: str
    tags: Optional[str] = None
    teams_count: int = 0
    teams: List[HackathonTeamOut] = []
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== EVENTS & FESTS ====================

class EventCreate(BaseModel):
    college_id: Optional[int] = None
    title: str
    description: str
    category: str = "Tech Fest"
    location: str
    is_online: bool = False
    start_time: datetime
    end_time: datetime
    banner_url: Optional[str] = None
    ticket_link: Optional[str] = None
    is_free: bool = True
    price_info: Optional[str] = "Free"

class EventOut(BaseModel):
    id: int
    college: Optional[CollegeOut] = None
    creator: UserOut
    title: str
    description: str
    category: str
    location: str
    is_online: bool
    start_time: datetime
    end_time: datetime
    banner_url: Optional[str] = None
    ticket_link: Optional[str] = None
    is_free: bool
    price_info: str
    rsvp_count: int = 0
    has_rsvped: bool = False
    user_rsvp_status: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== CLUBS ====================

class ClubCreate(BaseModel):
    name: str
    tagline: Optional[str] = None
    description: str
    category: str = "Technical"
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    instagram_handle: Optional[str] = None
    discord_url: Optional[str] = None
    website_url: Optional[str] = None

class ClubMemberOut(BaseModel):
    id: int
    user: UserOut
    role: str
    status: str
    joined_at: datetime

    class Config:
        from_attributes = True

class ClubAnnouncementCreate(BaseModel):
    title: str
    content: str

class ClubAnnouncementOut(BaseModel):
    id: int
    author: UserOut
    title: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class ClubOut(BaseModel):
    id: int
    college: CollegeOut
    lead: UserOut
    name: str
    tagline: Optional[str] = None
    description: str
    category: str
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    instagram_handle: Optional[str] = None
    discord_url: Optional[str] = None
    website_url: Optional[str] = None
    members_count: int = 0
    is_member: bool = False
    announcements: List[ClubAnnouncementOut] = []
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== CHAT & MESSAGING ====================

class MessageCreate(BaseModel):
    conversation_id: Optional[int] = None
    recipient_id: Optional[int] = None # For creating or finding a 1-on-1 direct conversation
    content: str
    attachment_url: Optional[str] = None

class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    sender: UserOut
    content: str
    attachment_url: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationOut(BaseModel):
    id: int
    is_group: bool
    title: Optional[str] = None
    project_id: Optional[int] = None
    participants: List[UserOut] = []
    last_message: Optional[MessageOut] = None
    unread_count: int = 0
    updated_at: datetime

    class Config:
        from_attributes = True

# ==================== NOTIFICATIONS ====================

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    link: Optional[str] = None
    is_read: bool
    actor: Optional[UserOut] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== MODERATION & ADMIN ====================

class ReportCreate(BaseModel):
    target_type: str # 'POST', 'COMMENT', 'USER', 'PROJECT'
    target_id: int
    reason: str
    details: Optional[str] = None

class ReportOut(BaseModel):
    id: int
    reporter: UserOut
    target_type: str
    target_id: int
    reason: str
    details: Optional[str] = None
    status: str
    action_taken: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ModerationAction(BaseModel):
    action: str # 'DISMISS', 'DELETE_TARGET', 'BAN_USER'
    details: Optional[str] = None

class StudentVerificationAction(BaseModel):
    status: str # 'VERIFIED', 'REJECTED'
    reason: Optional[str] = None
