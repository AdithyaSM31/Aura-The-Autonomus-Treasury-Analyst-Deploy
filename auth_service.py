"""
Authentication Service for Aura Treasury Analyst
Handles user registration, login, and session management with MongoDB
"""

import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, DuplicateKeyError

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable is required")

# Initialize MongoDB client with SSL/TLS parameters
try:
    client = MongoClient(
        MONGODB_URI,
        tls=True,
        tlsAllowInvalidCertificates=False,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000
    )
    db = client.aura_treasury
    users_collection = db.users
    sessions_collection = db.sessions
    
    print("✓ MongoDB client initialized")
except Exception as e:
    print(f"✗ MongoDB client initialization failed: {e}")
    raise

def ensure_indexes():
    """Create indexes if they don't exist - called lazily"""
    try:
        users_collection.create_index("email", unique=True)
        sessions_collection.create_index("token", unique=True)
        # Test connection
        client.admin.command('ping')
        print("✓ MongoDB connected and indexes created")
        return True
    except Exception as e:
        print(f"⚠ MongoDB connection warning: {e}")
        return False

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



def create_session(user_email: str) -> str:
    """Create a new session token for user"""
    # Generate secure session token
    session_token = secrets.token_urlsafe(32)
    
    # Store session with expiration (24 hours)
    expiration = datetime.now() + timedelta(hours=24)
    
    sessions_collection.insert_one({
        "token": session_token,
        "email": user_email,
        "created_at": datetime.now(),
        "expires_at": expiration
    })
    
    return session_token

def validate_session(session_token: str) -> Optional[str]:
    """Validate session token and return user email if valid"""
    session = sessions_collection.find_one({"token": session_token})
    
    if not session:
        return None
    
    # Check if session has expired
    if datetime.now() > session["expires_at"]:
        # Remove expired session
        sessions_collection.delete_one({"token": session_token})
        return None
    
    return session["email"]

def register_user(email: str, password: str, name: str) -> Dict[str, Any]:
    """
    Register a new user
    Returns: dict with success status and message
    """
    # Ensure indexes are created
    ensure_indexes()
    
    # Check if user already exists
    if users_collection.find_one({"email": email}):
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
    try:
        users_collection.insert_one({
            "name": name,
            "email": email,
            "password_hash": password_hash,
            "salt": salt,
            "created_at": datetime.now(),
            "last_login": None
        })
        
        return {
            "success": True,
            "message": "User registered successfully"
        }
    except DuplicateKeyError:
        return {
            "success": False,
            "message": "Email already registered"
        }

def login_user(email: str, password: str) -> Dict[str, Any]:
    """
    Login user and create session
    Returns: dict with success status, message, and session token
    """
    # Check if user exists
    user = users_collection.find_one({"email": email})
    
    if not user:
        return {
            "success": False,
            "message": "Invalid email or password"
        }
    
    # Verify password
    if not verify_password(password, user["password_hash"], user["salt"]):
        return {
            "success": False,
            "message": "Invalid email or password"
        }
    
    # Update last login
    users_collection.update_one(
        {"email": email},
        {"$set": {"last_login": datetime.now()}}
    )
    
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
    sessions_collection.delete_one({"token": session_token})
    
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
    
    user = users_collection.find_one({"email": email})
    
    if not user:
        return None
    
    return {
        "name": user["name"],
        "email": user["email"],
        "created_at": user["created_at"].isoformat() if isinstance(user["created_at"], datetime) else user["created_at"],
        "last_login": user["last_login"].isoformat() if user["last_login"] and isinstance(user["last_login"], datetime) else user["last_login"]
    }
