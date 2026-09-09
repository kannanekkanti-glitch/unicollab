# UniCollab - Private College Social & Collaboration Network

UniCollab is a private, trusted college social and collaboration platform exclusively designed for verified students and clubs across campuses. It provides a secure, unified ecosystem replacing fragmented messaging groups (WhatsApp, Telegram, Instagram) with verified student identity, academic/fest discussions, teammate matching, hackathons, clubs, and real-time communication.

---

## 🌟 Features Overview

### 🖥️ Frontend (React 18 + TypeScript + Vite + Tailwind CSS)
1. **Landing Page:** Hero section, value pillars, campus statistics, and instant 1-click demo persona launcher.
2. **Student Authentication:** Campus selector, `.edu`/college email validation, and student ID proof card upload.
3. **OTP Verification:** Interactive 6-digit verification code with instant demo auto-fill for testing.
4. **Home Feed:** Tab filters (*All Campuses*, *My Campus*, *Trending*, *Announcements*), post composer with poll setup, image attachments, campus-only toggle, anonymous post toggle, upvoting, and nested threaded comments.
5. **Student Profiles:** Profile banner, verified student badges, university details, skills pills, GitHub/LinkedIn links, and tabs for student projects and posts.
6. **Projects & Find Teammates:** Showcase student projects, filter by domain (*AI/ML*, *Web*, *IoT*, *Mobile*, *Security*) and roles needed. One-click collaboration application modal.
7. **Hackathons & Squad Board:** Active & upcoming hackathons with countdowns and prizes. "Looking for Members" squad roster board.
8. **Events & College Fests:** Annual fests, cultural nights, and tech workshops. 1-click RSVP (*Going* / *Interested*), pass links, and date filtering.
9. **Clubs & Communities:** College societies directory, join/leave toggle, and club announcements feed.
10. **Real-time Messaging:** Split-pane messenger with 1-on-1 direct messaging, conversation history, and live sync.
11. **Notifications:** Notification center for teammate requests, campus alerts, and post interactions.
12. **Universal Search:** Search across students, discussions, projects, hackathons, events, and clubs.
13. **Settings & Privacy:** Profile editing, skills update, and student ID verification photo resubmission.
14. **Admin Moderation Portal:** Platform statistics, student ID verification queue (with lightbox photo preview and approve/reject actions), and reported content moderation queue (*Dismiss*, *Delete*, *Suspend User*).

---

### ⚙️ Backend (FastAPI + SQLAlchemy + WebSockets)
- **FastAPI Framework:** High-performance asynchronous API with interactive OpenAPI docs at `http://localhost:8000/docs`.
- **Database & ORM:** SQLAlchemy with SQLite (WAL mode enabled for concurrent read/write performance).
- **Security:** JWT authentication tokens, bcrypt password hashing, and role-based access control (`STUDENT`, `CLUB_LEAD`, `ADMIN`).
- **WebSockets:** Real-time event hub for live direct messaging and notification dispatching.
- **Seeded Data:** Pre-configured with top universities (*Stanford*, *MIT*, *IIT Bombay*, *BITS Pilani*, *UC Berkeley*), active students, sample projects, hackathons, fests, and clubs.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Run Backend Server (serves both API & Frontend)
```bash
cd backend
py run.py
```
> The application will be accessible at: **`http://localhost:8000`**  
> Interactive API Swagger Documentation: **`http://localhost:8000/docs`**

### 2. Run Frontend in Hot-Reload Development Mode (Optional)
```bash
cd frontend
npm run dev
```
> Accessible at: **`http://localhost:5173`** (automatically proxies `/api` and `/uploads` to port 8000)

---

## 👥 Demo Personas (1-Click Login or Manual)

| Name | Role / Campus | Email | Password | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Rivera** | Stanford University (AI/ML) | `alex@stanford.edu` | `Pass@123` | Verified Student |
| **Priya Sharma** | IIT Bombay (Robotics Club Lead) | `priya@iitb.ac.in` | `Pass@123` | Verified Student |
| **Marcus Chen** | MIT (Software Engineering) | `marcus@mit.edu` | `Pass@123` | Verified Student |
| **Sophia Davis** | UC Berkeley (UI/UX Design) | `sophia@berkeley.edu` | `Pass@123` | Verified Student |
| **Rohan Verma** | BITS Pilani (Cybersec & Cloud) | `rohan@bits.ac.in` | `Pass@123` | Pending Verification |
| **Admin** | Campus Safety & Moderation | `admin@unicollab.edu` | `Admin@123` | Platform Admin |

---

## 🧪 Running Automated Tests
```bash
py -m pytest backend/tests -v
```
All 9 test suites cover authentication, OTP, posts, voting, teammate matching, hackathons, events, search, and admin metrics.
