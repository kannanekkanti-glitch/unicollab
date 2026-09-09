import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from app.seed import seed

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Run seed to initialize pristine SQLite DB
    seed()

client = TestClient(app)

def test_health_and_root():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

    res = client.get("/", headers={"Accept": "application/json"})
    assert res.status_code == 200
    assert "UniCollab" in res.json()["name"]

def test_list_colleges():
    res = client.get("/api/v1/auth/colleges")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    assert any(c["short_code"] == "Stanford" for c in data)
    assert any(c["short_code"] == "IIT Bombay" for c in data)

def test_student_login():
    res = client.post("/api/v1/auth/login", json={
        "email_or_username": "alex@stanford.edu",
        "password": "Pass@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["full_name"] == "Alex Rivera"
    assert data["user"]["verification_status"] == "VERIFIED"

def test_student_registration_and_otp():
    # Register new student
    res = client.post("/api/v1/auth/register", json={
        "email": "freshman@stanford.edu",
        "password": "Password@123",
        "full_name": "Jordan Lee",
        "username": "jordan_lee",
        "college_id": 1,
        "major": "Symbolic Systems",
        "graduation_year": 2028
    })
    assert res.status_code == 200
    token = res.json()["access_token"]
    assert res.json()["user"]["verification_status"] == "PENDING"

    # Request OTP
    otp_res = client.post("/api/v1/auth/send-otp?email=freshman@stanford.edu")
    assert otp_res.status_code == 200
    demo_otp = otp_res.json()["demo_otp"]
    assert len(demo_otp) == 6

    # Verify OTP
    verify_res = client.post("/api/v1/auth/verify-otp", json={
        "email": "freshman@stanford.edu",
        "code": demo_otp
    })
    assert verify_res.status_code == 200
    assert verify_res.json()["user"]["verification_status"] == "VERIFIED"

def test_post_creation_and_voting():
    login_res = client.post("/api/v1/auth/login", json={
        "email_or_username": "alex@stanford.edu",
        "password": "Pass@123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create post
    post_res = client.post("/api/v1/posts", headers=headers, json={
        "title": "Study Group for CS 229 Machine Learning",
        "content": "Looking to form a 4-person study group to prepare for midterms.",
        "category": "Exams",
        "is_campus_only": True
    })
    assert post_res.status_code == 200
    post_data = post_res.json()
    post_id = post_data["id"]

    # Upvote post
    vote_res = client.post(f"/api/v1/posts/{post_id}/vote", headers=headers, json={"vote_type": 1})
    assert vote_res.status_code == 200

    # Add comment
    comment_res = client.post(f"/api/v1/posts/{post_id}/comments", headers=headers, json={
        "content": "Count me in! What chapters are we covering first?"
    })
    assert comment_res.status_code == 200
    assert comment_res.json()["content"] == "Count me in! What chapters are we covering first?"

def test_project_and_teammate_matching():
    # Login as Priya
    login_res = client.post("/api/v1/auth/login", json={
        "email_or_username": "priya@iitb.ac.in",
        "password": "Pass@123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Query projects
    proj_res = client.get("/api/v1/projects?domain=Hardware%20/%20IoT")
    assert proj_res.status_code == 200
    projects = proj_res.json()
    assert len(projects) >= 1
    assert any("AeroGuard" in p["title"] for p in projects)

def test_hackathons_and_events():
    h_res = client.get("/api/v1/hackathons")
    assert h_res.status_code == 200
    hackathons = h_res.json()
    assert len(hackathons) >= 2

    e_res = client.get("/api/v1/events")
    assert e_res.status_code == 200
    events = e_res.json()
    assert len(events) >= 3

def test_global_search():
    res = client.get("/api/v1/search?q=Stanford")
    assert res.status_code == 200
    results = res.json()["results"]
    assert results["total_count"] > 0
    assert len(results["students"]) >= 1

def test_admin_metrics():
    admin_login = client.post("/api/v1/auth/login", json={
        "email_or_username": "admin@unicollab.edu",
        "password": "Admin@123"
    })
    admin_token = admin_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {admin_token}"}

    metrics_res = client.get("/api/v1/admin/metrics", headers=headers)
    assert metrics_res.status_code == 200
    metrics = metrics_res.json()
    assert metrics["total_users"] >= 5
    assert metrics["total_posts"] >= 2
    assert metrics["total_projects"] >= 2
