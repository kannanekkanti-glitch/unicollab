import sys
import os
from datetime import datetime, timedelta

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.college import College
from app.models.user import User
from app.models.post import Post, Comment, PostLike, PollOption, PollVote
from app.models.project import Project, ProjectMember, CollaborationRequest
from app.models.hackathon import Hackathon, HackathonTeam, HackathonTeamMember, HackathonJoinRequest
from app.models.event import Event, EventRSVP
from app.models.club import Club, ClubMember, ClubAnnouncement
from app.models.chat import Conversation, ConversationParticipant, Message
from app.models.notification import Notification
from app.models.moderation import Report

def seed():
    print("Resetting and creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("Seeding colleges...")
    colleges = [
        College(
            name="Stanford University",
            short_code="Stanford",
            domain="stanford.edu",
            city="Stanford",
            state="California",
            country="USA",
            logo_url="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80"
        ),
        College(
            name="Massachusetts Institute of Technology",
            short_code="MIT",
            domain="mit.edu",
            city="Cambridge",
            state="Massachusetts",
            country="USA",
            logo_url="https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80"
        ),
        College(
            name="Indian Institute of Technology Bombay",
            short_code="IIT Bombay",
            domain="iitb.ac.in",
            city="Mumbai",
            state="Maharashtra",
            country="India",
            logo_url="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80"
        ),
        College(
            name="BITS Pilani",
            short_code="BITS",
            domain="bits-pilani.ac.in",
            city="Pilani",
            state="Rajasthan",
            country="India",
            logo_url="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80"
        ),
        College(
            name="University of California, Berkeley",
            short_code="UC Berkeley",
            domain="berkeley.edu",
            city="Berkeley",
            state="California",
            country="USA",
            logo_url="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=150&auto=format&fit=crop&q=80"
        ),
    ]
    db.add_all(colleges)
    db.commit()

    print("Seeding users (Admin & Students)...")
    admin = User(
        email="admin@unicollab.edu",
        username="admin",
        hashed_password=hash_password("Admin@123"),
        full_name="Platform Administrator",
        college_id=colleges[0].id,
        role="ADMIN",
        verification_status="VERIFIED",
        is_email_verified=True,
        bio="Official system administrator and campus safety lead.",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    )

    alex = User(
        email="alex@stanford.edu",
        username="alex_rivera",
        hashed_password=hash_password("Pass@123"),
        full_name="Alex Rivera",
        college_id=colleges[0].id, # Stanford
        major="Computer Science & AI",
        graduation_year=2026,
        student_id_number="SU-2026-9041",
        bio="Building autonomous agents & multimodal systems. Always looking for hackathon teammates and open-source contributors.",
        skills="PyTorch,React,FastAPI,TypeScript,Docker",
        interests="Deep Learning, Distributed Systems, Robotics",
        github_url="https://github.com/alexrivera",
        linkedin_url="https://linkedin.com/in/alexrivera",
        avatar_url="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        verification_status="VERIFIED",
        role="STUDENT",
        is_email_verified=True
    )

    priya = User(
        email="priya@iitb.ac.in",
        username="priya_sharma",
        hashed_password=hash_password("Pass@123"),
        full_name="Priya Sharma",
        college_id=colleges[2].id, # IIT Bombay
        major="Electrical Engineering & Robotics",
        graduation_year=2025,
        student_id_number="IITB-210040082",
        bio="Robotics enthusiast, ROS2 hacker, and lead at IIT Bombay Techfest robotics division. Winner of SIH 2024.",
        skills="C++,ROS2,Python,Embedded Systems,OpenCV",
        interests="Autonomous Drones, Space Tech, Computer Vision",
        github_url="https://github.com/priyasharma",
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        verification_status="VERIFIED",
        role="CLUB_LEAD",
        is_email_verified=True
    )

    marcus = User(
        email="marcus@mit.edu",
        username="marcus_chen",
        hashed_password=hash_password("Pass@123"),
        full_name="Marcus Chen",
        college_id=colleges[1].id, # MIT
        major="Computation & Cognition",
        graduation_year=2026,
        student_id_number="MIT-804192",
        bio="Full-stack engineer & product builder. HackMIT organizer. Passionate about education access tools.",
        skills="Next.js,Node.js,PostgreSQL,Tailwind,GraphQL",
        interests="Web Dev, FinTech, EdTech",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        verification_status="VERIFIED",
        role="STUDENT",
        is_email_verified=True
    )

    sophia = User(
        email="sophia@berkeley.edu",
        username="sophia_davis",
        hashed_password=hash_password("Pass@123"),
        full_name="Sophia Davis",
        college_id=colleges[4].id, # UC Berkeley
        major="Data Science & Cognitive Science",
        graduation_year=2027,
        student_id_number="UCB-303829",
        bio="Design meets data. Crafting minimalist user experiences for complex products.",
        skills="Figma,UI/UX Research,Python,Tableau,HTML/CSS",
        interests="Human-Computer Interaction, Product Design",
        avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        verification_status="VERIFIED",
        role="STUDENT",
        is_email_verified=True
    )

    rohan = User(
        email="rohan@bits.ac.in",
        username="rohan_verma",
        hashed_password=hash_password("Pass@123"),
        full_name="Rohan Verma",
        college_id=colleges[3].id, # BITS Pilani
        major="Computer Science",
        graduation_year=2026,
        student_id_number="2022A7PS0042P",
        bio="Cloud infrastructure engineer & CTF competitor. Uploaded ID proof awaiting student badge.",
        skills="AWS,Go,Kubernetes,Linux,Terraform",
        interests="Cloud Architecture, Cybersecurity",
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        id_card_image_url="https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=500&auto=format&fit=crop&q=80",
        verification_status="PENDING",
        role="STUDENT",
        is_email_verified=True
    )

    db.add_all([admin, alex, priya, marcus, sophia, rohan])
    db.commit()

    print("Seeding posts & polls...")
    p1 = Post(
        author_id=alex.id,
        college_id=colleges[0].id,
        title="Looking for an AI/ML Researcher for TreeHacks 2026! 🚀",
        content="Our team is building an agentic medical diagnosis assistant that summarizes clinical notes into actionable patient insights. We already have frontend and backend locked in, need 1 more teammate passionate about LLM fine-tuning or RAG architectures. Drop a comment or apply directly through the Projects tab!",
        category="Projects",
        is_campus_only=False,
        is_announcement=False
    )
    db.add(p1)
    db.flush()

    c1 = Comment(post_id=p1.id, author_id=marcus.id, content="Sounds incredible Alex! Would love to connect regarding the API infrastructure if you still need help.")
    c2 = Comment(post_id=p1.id, author_id=sophia.id, content="If you need UI/UX flow or interactive mockups for the pitch deck, ping me!")
    db.add_all([c1, c2])

    p2 = Post(
        author_id=priya.id,
        college_id=colleges[2].id,
        title="IIT Bombay Techfest 2026 Dates Announced! 🎪",
        content="Asia's Largest Science & Technology Festival is back from Dec 18-21! Registrations are now open for International Robowars, Aeromodelling, and the 36-hour National Hackathon. Inter-college teams are welcome. Check the Events tab for RSVP and accommodation guidelines.",
        category="Fests",
        is_campus_only=False,
        is_announcement=True,
        attachment_url="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
    )
    db.add(p2)

    # Poll post
    p3 = Post(
        author_id=marcus.id,
        college_id=colleges[1].id,
        title="Quick Poll: Which stack do you prefer for 24-hr Hackathons?",
        content="Gathering stats for our upcoming HackMIT dev workshop! What is your go-to weapon when speed to MVP is all that matters?",
        category="General",
        is_poll=True,
        poll_question="Fastest MVP Hackathon Stack?"
    )
    db.add(p3)
    db.flush()

    opt1 = PollOption(post_id=p3.id, text="Next.js + Supabase + Tailwind")
    opt2 = PollOption(post_id=p3.id, text="FastAPI + React + SQLite")
    opt3 = PollOption(post_id=p3.id, text="Flutter / React Native + Firebase")
    opt4 = PollOption(post_id=p3.id, text="MERN Stack (MongoDB, Express, React, Node)")
    db.add_all([opt1, opt2, opt3, opt4])
    db.flush()

    db.add_all([
        PollVote(poll_option_id=opt1.id, user_id=alex.id),
        PollVote(poll_option_id=opt2.id, user_id=priya.id),
        PollVote(poll_option_id=opt2.id, user_id=rohan.id),
        PollVote(poll_option_id=opt1.id, user_id=sophia.id)
    ])

    # Upvotes
    db.add_all([
        PostLike(post_id=p1.id, user_id=marcus.id, vote_type=1),
        PostLike(post_id=p1.id, user_id=sophia.id, vote_type=1),
        PostLike(post_id=p1.id, user_id=priya.id, vote_type=1),
        PostLike(post_id=p2.id, user_id=alex.id, vote_type=1),
        PostLike(post_id=p2.id, user_id=rohan.id, vote_type=1),
        PostLike(post_id=p3.id, user_id=alex.id, vote_type=1),
    ])
    db.commit()

    print("Seeding student projects & collaboration requests...")
    proj1 = Project(
        creator_id=alex.id,
        college_id=colleges[0].id,
        title="ClinicaMind - Agentic Clinical Note Copilot",
        tagline="Transforming doctor-patient dialogues into structured EHR records & differential diagnoses.",
        description="A lightweight, privacy-preserving clinical assistant trained on open-source medical models. Runs locally on edge medical laptops using quantized LLMs.",
        domain="AI / ML",
        stage="In Progress",
        skills_required="PyTorch,FastAPI,Transformers,React,Tailwind",
        open_roles="ML Researcher,UI/UX Designer",
        repo_url="https://github.com/unicollab-demo/clinicamind",
        cover_image_url="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
    )

    proj2 = Project(
        creator_id=priya.id,
        college_id=colleges[2].id,
        title="AeroGuard - Autonomous Campus Perimeter Drone",
        tagline="Thermal imaging & vision-based patrolling for night safety on sprawling campuses.",
        description="Designed to assist campus security staff during late hours with automated waypoints, emergency beacon detection, and live telemetry over 5G.",
        domain="Hardware / IoT",
        stage="MVP Ready",
        skills_required="ROS2,C++,OpenCV,Python,React Native",
        open_roles="Mobile Developer,Computer Vision Engineer",
        repo_url="https://github.com/unicollab-demo/aeroguard",
        cover_image_url="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80"
    )

    proj3 = Project(
        creator_id=marcus.id,
        college_id=colleges[1].id,
        title="CampusPool - Peer-to-Peer Verified Rideshare",
        tagline="Save money and commute safely with verified students heading to airports and city centers.",
        description="Eliminates the sketchiness of unverified WhatsApp rideshare groups. Auto-calculates split costs and confirms university enrollment.",
        domain="Web Development",
        stage="Ideation",
        skills_required="React,Node.js,Google Maps API,Tailwind",
        open_roles="Backend Engineer,Product Designer",
        cover_image_url="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80"
    )

    db.add_all([proj1, proj2, proj3])
    db.flush()

    db.add_all([
        ProjectMember(project_id=proj1.id, user_id=alex.id, role_name="Lead & AI Engineer"),
        ProjectMember(project_id=proj2.id, user_id=priya.id, role_name="Robotics Lead"),
        ProjectMember(project_id=proj3.id, user_id=marcus.id, role_name="Full-Stack Lead"),
    ])

    # Collab request
    req1 = CollaborationRequest(
        project_id=proj1.id,
        user_id=sophia.id,
        desired_role="UI/UX Designer",
        message="Hi Alex! I have built clinical workflows before during a healthcare design internship. Excited to jump in!",
        status="ACCEPTED"
    )
    db.add(req1)
    db.flush()
    db.add(ProjectMember(project_id=proj1.id, user_id=sophia.id, role_name="UI/UX Designer"))

    req2 = CollaborationRequest(
        project_id=proj3.id,
        user_id=rohan.id,
        desired_role="Backend Engineer",
        message="Hey Marcus, I can handle the backend API, Postgres indexing, and deployment on AWS.",
        status="PENDING"
    )
    db.add(req2)
    db.commit()

    print("Seeding hackathons & teams...")
    h1 = Hackathon(
        title="TreeHacks 2026",
        organizer="Stanford University",
        mode="In-Person",
        location="Stanford Arrillaga Center, CA",
        start_date=datetime.utcnow() + timedelta(days=20),
        end_date=datetime.utcnow() + timedelta(days=22),
        prize_pool="$120,000 + VC Mentorship",
        registration_url="https://treehacks.com",
        banner_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
        description="Stanford's premier collegiate hackathon bringing together 1,500+ top hackers from across the globe to build projects tackling Healthcare, Education, and Climate Tech.",
        tags="AI,Healthcare,Fintech,Climate"
    )

    h2 = Hackathon(
        title="HackMIT 2026",
        organizer="MIT TechX",
        mode="Hybrid",
        location="MIT Campus & Online",
        start_date=datetime.utcnow() + timedelta(days=45),
        end_date=datetime.utcnow() + timedelta(days=47),
        prize_pool="$85,000",
        registration_url="https://hackmit.org",
        banner_url="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
        description="Join over a thousand students for a weekend of hacking, learning, and fun at MIT. Mentorship from top tech companies and researchers.",
        tags="Open Source,Robotics,Web3,AI"
    )

    db.add_all([h1, h2])
    db.flush()

    # Hackathon Team
    team1 = HackathonTeam(
        hackathon_id=h1.id,
        leader_id=alex.id,
        team_name="NeuralNinjas",
        description="Building an offline-first AI translation badge for emergency responders.",
        looking_for_roles="Embedded C++ Dev,Pitch Lead",
        max_members=4
    )
    db.add(team1)
    db.flush()

    db.add(HackathonTeamMember(team_id=team1.id, user_id=alex.id, role="Team Lead & ML"))
    db.add(HackathonTeamMember(team_id=team1.id, user_id=sophia.id, role="Product & UI"))
    db.commit()

    print("Seeding events & fests...")
    e1 = Event(
        college_id=colleges[2].id,
        creator_id=priya.id,
        title="Techfest 2026 - International Robowars & AI Summit",
        description="Experience high-octane combat robotics, keynote lectures by Nobel laureates, and hands-on workshops in quantum computing.",
        category="Tech Fest",
        location="IIT Bombay Gymkhana Grounds & Convocation Hall",
        is_online=False,
        start_time=datetime.utcnow() + timedelta(days=30),
        end_time=datetime.utcnow() + timedelta(days=33),
        banner_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        is_free=True,
        price_info="Free Registration"
    )

    e2 = Event(
        college_id=colleges[0].id,
        creator_id=alex.id,
        title="Stanford AI Founders Workshop & Demo Day",
        description="Showcase student-built AI MVPs to visiting alumni, angel investors, and Silicon Valley engineers. Food and drinks provided.",
        category="Workshop",
        location="Stanford Gates Computer Science Building, Room 104",
        is_online=False,
        start_time=datetime.utcnow() + timedelta(days=12),
        end_time=datetime.utcnow() + timedelta(days=12, hours=4),
        banner_url="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
        is_free=True,
        price_info="Free"
    )

    e3 = Event(
        college_id=None, # Inter-college
        creator_id=admin.id,
        title="Cross-Campus Inter-College Cultural Fest (Oasis 2026)",
        description="Music battles, choreo nights, street play competitions, and celebrity pro-nights. Passes available for all verified university students.",
        category="Cultural Fest",
        location="Main Amphitheatre & Live Stream",
        is_online=False,
        start_time=datetime.utcnow() + timedelta(days=50),
        end_time=datetime.utcnow() + timedelta(days=53),
        banner_url="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
        is_free=False,
        price_info="$15 Student Pass"
    )
    db.add_all([e1, e2, e3])
    db.flush()

    db.add_all([
        EventRSVP(event_id=e1.id, user_id=alex.id, status="GOING"),
        EventRSVP(event_id=e1.id, user_id=marcus.id, status="GOING"),
        EventRSVP(event_id=e2.id, user_id=sophia.id, status="GOING"),
        EventRSVP(event_id=e3.id, user_id=rohan.id, status="INTERESTED"),
    ])
    db.commit()

    print("Seeding clubs & communities...")
    club1 = Club(
        college_id=colleges[0].id,
        lead_id=alex.id,
        name="Stanford Artificial Intelligence Club (SAIC)",
        tagline="Exploring the frontier of deep learning and machine intelligence.",
        description="SAIC organizes weekly paper reading sessions, hands-on PyTorch coding jams, and connects undergraduate researchers with Stanford AI Lab (SAIL) professors.",
        category="Technical",
        logo_url="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=150&auto=format&fit=crop&q=80",
        banner_url="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
        instagram_handle="@stanford_ai_club",
        discord_url="https://discord.gg/saic"
    )

    club2 = Club(
        college_id=colleges[2].id,
        lead_id=priya.id,
        name="IIT Bombay Robotics & Mechatronics Society",
        tagline="Designing the next generation of autonomous and industrial robots.",
        description="The premier technical society behind IIT Bombay's Robocon, Mars Rover, and AUV (Autonomous Underwater Vehicle) teams.",
        category="Technical",
        logo_url="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80",
        banner_url="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
    )

    club3 = Club(
        college_id=colleges[1].id,
        lead_id=marcus.id,
        name="MIT Entrepreneurship & Venture Club (E-Club)",
        tagline="Empowering student founders from dormitory to Series A.",
        description="Providing mentorship, startup micro-grants, and founder pitch practice with Boston venture capital leaders.",
        category="Entrepreneurship",
        logo_url="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&auto=format&fit=crop&q=80"
    )
    db.add_all([club1, club2, club3])
    db.flush()

    db.add_all([
        ClubMember(club_id=club1.id, user_id=alex.id, role="Lead", status="ACTIVE"),
        ClubMember(club_id=club1.id, user_id=sophia.id, role="Design Head", status="ACTIVE"),
        ClubMember(club_id=club2.id, user_id=priya.id, role="Lead", status="ACTIVE"),
        ClubMember(club_id=club3.id, user_id=marcus.id, role="Lead", status="ACTIVE"),
        ClubMember(club_id=club3.id, user_id=rohan.id, role="Member", status="ACTIVE"),
    ])

    ann1 = ClubAnnouncement(
        club_id=club1.id,
        author_id=alex.id,
        title="Weekly Reading Group: DeepSeek & Reasoning Models",
        content="Join us this Thursday at 6 PM in Gates 104. We'll be breaking down test-time compute scaling laws and reinforcement learning from verifiable rewards!"
    )
    db.add(ann1)
    db.commit()

    print("Seeding conversations & messages...")
    conv1 = Conversation(is_group=False)
    db.add(conv1)
    db.flush()

    db.add_all([
        ConversationParticipant(conversation_id=conv1.id, user_id=alex.id),
        ConversationParticipant(conversation_id=conv1.id, user_id=sophia.id),
    ])

    m1 = Message(
        conversation_id=conv1.id,
        sender_id=sophia.id,
        content="Hey Alex! Just saw your ClinicaMind post. The architecture looks super clean. When are you hosting the next sync?"
    )
    m2 = Message(
        conversation_id=conv1.id,
        sender_id=alex.id,
        content="Hey Sophia! Thanks a ton. We are meeting tomorrow afternoon over Zoom or Gates Library. I'll share the Figma link right away!"
    )
    db.add_all([m1, m2])
    db.commit()

    print("Seeding notifications...")
    db.add_all([
        Notification(
            user_id=alex.id,
            actor_id=sophia.id,
            title="Teammate Request Accepted",
            message="Sophia Davis joined ClinicaMind as UI/UX Designer!",
            notification_type="TEAM_REQUEST",
            link="/projects/1"
        ),
        Notification(
            user_id=marcus.id,
            actor_id=rohan.id,
            title="New Teammate Application",
            message="Rohan Verma applied to join CampusPool as Backend Engineer.",
            notification_type="TEAM_REQUEST",
            link="/projects/3"
        ),
        Notification(
            user_id=alex.id,
            actor_id=None,
            title="Campus Alert: TreeHacks Registration Closing",
            message="Registration for TreeHacks 2026 closes in 48 hours. Ensure your team roster is final.",
            notification_type="CAMPUS_ALERT",
            link="/hackathons/1"
        )
    ])
    db.commit()

    print("Seeding moderation report...")
    rep1 = Report(
        reporter_id=sophia.id,
        target_type="POST",
        target_id=p1.id,
        reason="Test Verification Report",
        details="Demonstration item for verifying admin dashboard moderation workflow.",
        status="PENDING"
    )
    db.add(rep1)
    db.commit()

    print("Database seeding completed successfully! All entities initialized.")
    db.close()

if __name__ == "__main__":
    seed()
