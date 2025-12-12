"""
Authentication Service for Aura Treasury Analyst
Handles user registration, login, and session management
"""

import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

# User database file
USER_DB_FILE = "users_db.json"
SESSIONS_FILE = "sessions_db.json"

def hash_password(password: str, salt: str = None) -> tuple:
    """Hash password with salt"""
    if salt is None:
        salt = secrets.token_hex(16)
    
    # Use SHA-256 with salt
    password_hash = hashlib.sha256(f"{password}{salt}".encode()).hexdigest()
    return password_hash, salt

def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    """Verify password against stored hash"""
    password_hash, _ = hash_password(password, salt)
    return password_hash == stored_hash

def load_users() -> Dict:
    """Load users from database file"""
    if not os.path.exists(USER_DB_FILE):
        return {}
    
    try:
        with open(USER_DB_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading users: {e}")
        return {}

def save_users(users: Dict):
    """Save users to database file"""
    try:
        with open(USER_DB_FILE, 'w') as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"Error saving users: {e}")

def load_sessions() -> Dict:
    """Load sessions from database file"""
    if not os.path.exists(SESSIONS_FILE):
        return {}
    
    try:
        with open(SESSIONS_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading sessions: {e}")
        return {}

def save_sessions(sessions: Dict):
    """Save sessions to database file"""
    try:
        with open(SESSIONS_FILE, 'w') as f:
            json.dump(sessions, f, indent=2)
    except Exception as e:
        print(f"Error saving sessions: {e}")

def create_session(user_email: str) -> str:
    """Create a new session token for user"""
    sessions = load_sessions()
    
    # Generate secure session token
    session_token = secrets.token_urlsafe(32)
    
    # Store session with expiration (24 hours)
    expiration = (datetime.now() + timedelta(hours=24)).isoformat()
    
    sessions[session_token] = {
        "email": user_email,
        "created_at": datetime.now().isoformat(),
        "expires_at": expiration
    }
    
    save_sessions(sessions)
    return session_token

def validate_session(session_token: str) -> Optional[str]:
    """Validate session token and return user email if valid"""
    sessions = load_sessions()
    
    if session_token not in sessions:
        return None
    
    session = sessions[session_token]
    expiration = datetime.fromisoformat(session["expires_at"])
    
    # Check if session has expired
    if datetime.now() > expiration:
        # Remove expired session
        del sessions[session_token]
        save_sessions(sessions)
        return None
    
    return session["email"]

def register_user(email: str, password: str, name: str) -> Dict[str, Any]:
    """
    Register a new user
    Returns: dict with success status and message
    """
    users = load_users()
    
    # Check if user already exists
    if email in users:
        return {
            "success": False,
            "message": "Email already registered"
        }
    
    # Validate email format
    if '@' not in email or '.' not in email:
        return {
            "success": False,
            "message": "Invalid email format"
        }
    
    # Validate password strength
    if len(password) < 8:
        return {
            "success": False,
            "message": "Password must be at least 8 characters long"
        }
    
    # Hash password
    password_hash, salt = hash_password(password)
    
    # Create user record
    users[email] = {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "salt": salt,
        "created_at": datetime.now().isoformat(),
        "last_login": None
    }
    
    save_users(users)
    
    return {
        "success": True,
        "message": "User registered successfully"
    }

def login_user(email: str, password: str) -> Dict[str, Any]:
    """
    Login user and create session
    Returns: dict with success status, message, and session token
    """
    users = load_users()
    
    # Check if user exists
    if email not in users:
        return {
            "success": False,
            "message": "Invalid email or password"
        }
    
    user = users[email]
    
    # Verify password
    if not verify_password(password, user["password_hash"], user["salt"]):
        return {
            "success": False,
            "message": "Invalid email or password"
        }
    
    # Update last login
    user["last_login"] = datetime.now().isoformat()
    save_users(users)
    
    # Create session
    session_token = create_session(email)
    
    return {
        "success": True,
        "message": "Login successful",
        "session_token": session_token,
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    }

def logout_user(session_token: str) -> Dict[str, Any]:
    """
    Logout user by invalidating session
    """
    sessions = load_sessions()
    
    if session_token in sessions:
        del sessions[session_token]
        save_sessions(sessions)
    
    return {
        "success": True,
        "message": "Logged out successfully"
    }

def get_user_info(session_token: str) -> Optional[Dict[str, Any]]:
    """
    Get user information from session token
    """
    email = validate_session(session_token)
    
    if not email:
        return None
    
    users = load_users()
    
    if email not in users:
        return None
    
    user = users[email]
    
    return {
        "name": user["name"],
        "email": user["email"],
        "created_at": user["created_at"],
        "last_login": user["last_login"]
    }
