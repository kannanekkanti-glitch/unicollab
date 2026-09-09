export interface College {
  id: number;
  name: string;
  short_code: string;
  domain: string;
  city?: string;
  state?: string;
  country?: string;
  logo_url?: string;
  banner_url?: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  college_id?: number;
  college?: College;
  major?: string;
  graduation_year?: number;
  student_id_number?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  skills?: string;
  interests?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  id_card_image_url?: string;
  role: 'STUDENT' | 'CLUB_LEAD' | 'ADMIN';
  is_active: boolean;
  is_email_verified: boolean;
  created_at: string;
}

export interface PollOption {
  id: number;
  text: string;
  vote_count: number;
  has_voted: boolean;
}

export interface Comment {
  id: number;
  post_id: number;
  author?: User;
  content: string;
  created_at: string;
  replies: Comment[];
}

export interface Post {
  id: number;
  author?: User;
  college?: College;
  title: string;
  content: string;
  category: 'General' | 'Exams' | 'Fests' | 'Announcements' | 'Lost & Found' | 'Projects';
  is_campus_only: boolean;
  is_announcement: boolean;
  is_anonymous: boolean;
  attachment_url?: string;
  is_poll: boolean;
  poll_question?: string;
  poll_options: PollOption[];
  upvotes_count: number;
  downvotes_count: number;
  user_vote: number; // 1, -1, or 0
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: number;
  user: User;
  role_name: string;
  joined_at: string;
}

export interface CollaborationRequest {
  id: number;
  project_id: number;
  user: User;
  desired_role: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
}

export interface Project {
  id: number;
  creator: User;
  college_id?: number;
  title: string;
  tagline?: string;
  description: string;
  domain: string;
  stage: string;
  skills_required?: string;
  open_roles?: string;
  repo_url?: string;
  demo_url?: string;
  cover_image_url?: string;
  members: ProjectMember[];
  created_at: string;
}

export interface HackathonTeamMember {
  id: number;
  user: User;
  role: string;
  joined_at: string;
}

export interface HackathonJoinRequest {
  id: number;
  team_id: number;
  user: User;
  role: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
}

export interface HackathonTeam {
  id: number;
  hackathon_id: number;
  leader: User;
  team_name: string;
  description?: string;
  looking_for_roles?: string;
  max_members: number;
  members: HackathonTeamMember[];
  join_requests: HackathonJoinRequest[];
  created_at: string;
}

export interface Hackathon {
  id: number;
  title: string;
  organizer: string;
  mode: 'Online' | 'In-Person' | 'Hybrid';
  location?: string;
  start_date: string;
  end_date: string;
  prize_pool: string;
  registration_url?: string;
  banner_url?: string;
  description: string;
  tags?: string;
  teams_count: number;
  teams: HackathonTeam[];
  created_at: string;
}

export interface Event {
  id: number;
  college?: College;
  creator: User;
  title: string;
  description: string;
  category: string;
  location: string;
  is_online: boolean;
  start_time: string;
  end_time: string;
  banner_url?: string;
  ticket_link?: string;
  is_free: boolean;
  price_info: string;
  rsvp_count: number;
  has_rsvped: boolean;
  user_rsvp_status?: 'GOING' | 'INTERESTED';
  created_at: string;
}

export interface ClubAnnouncement {
  id: number;
  author: User;
  title: string;
  content: string;
  created_at: string;
}

export interface Club {
  id: number;
  college: College;
  lead: User;
  name: string;
  tagline?: string;
  description: string;
  category: string;
  logo_url?: string;
  banner_url?: string;
  instagram_handle?: string;
  discord_url?: string;
  website_url?: string;
  members_count: number;
  is_member: boolean;
  announcements: ClubAnnouncement[];
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender: User;
  content: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  is_group: boolean;
  title?: string;
  project_id?: number;
  participants: User[];
  last_message?: Message;
  unread_count: number;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  link?: string;
  is_read: boolean;
  actor?: User;
  created_at: string;
}

export interface Report {
  id: number;
  reporter: User;
  target_type: string;
  target_id: number;
  reason: string;
  details?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  action_taken?: string;
  resolved_at?: string;
  created_at: string;
}

export interface AdminMetrics {
  total_users: number;
  verified_users: number;
  pending_verifications: number;
  total_posts: number;
  total_projects: number;
  total_events: number;
  total_clubs: number;
  pending_reports: number;
}
