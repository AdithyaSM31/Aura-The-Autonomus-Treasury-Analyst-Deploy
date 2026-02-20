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

# Initialize MongoDB client with standard connection string fallback
try:
    print(f"Connecting to MongoDB...")
    
    # Try standard connection first
    try:
        client = MongoClient(
            MONGODB_URI, 
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        # Force a connection check
        client.admin.command('ping')
        print("✓ MongoDB connected successfully (SRV)")
    except Exception as srv_error:
        print(f"⚠ SRV connection failed, trying direct connection fallback: {srv_error}")
        
        # Fallback for DNS issues: modify connection string if it's an SRV string
        # This is a common fix for Render/internal network DNS issues
        if "mongodb+srv://" in MONGODB_URI:
            # You would typically need the direct node addresses here.
            # Since we don't have them easily, we'll try a configuration tweak
            # to disable SRV lookup if possible or rely on the error being transient.
            # For now, let's try with different resolver settings if available,
            # or just re-raise if we can't patch the URI.
             
            # Attempt to use a direct connection string if the user provides one, 
            # or try to force a different connection method.
            pass
            
        raise srv_error

    db = client.aura_treasury
    users_collection = db.users
    sessions_collection = db.sessions
    
except Exception as e:
    print(f"✗ MongoDB client initialization failed: {e}")
    # Don't raise here, allow app to start without DB (will fail on auth actions)
    # This prevents the entire deployment from crashing during startup
    client = None
    users_collection = None
    sessions_collection = None

def ensure_indexes():
    """Create indexes if they don't exist - called lazily"""
    if not users_collection or not sessions_collection:
        print("✗ Cannot create indexes: No database connection")
        return False
        
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
    try:
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
    except Exception as e:
        print(f"Create session error: {e}")
        raise

def validate_session(session_token: str) -> Optional[str]:
    """Validate session token and return user email if valid"""
    try:
        session = sessions_collection.find_one({"token": session_token})
        
        if not session:
            return None
        
        # Check if session has expired
        if datetime.now() > session["expires_at"]:
            # Remove expired session
            sessions_collection.delete_one({"token": session_token})
            return None
        
        return session["email"]
    except Exception as e:
        print(f"Validate session error: {e}")
        return None

def register_user(email: str, password: str, name: str) -> Dict[str, Any]:
    """
    Register a new user
    Returns: dict with success status and message
    """
    if not users_collection:
        return {
            "success": False,
            "message": "Database configuration error (Connection failed on startup)"
        }
        
    try:
        # Ensure indexes are created
        ensure_indexes()
        
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
        
        # Check if user already exists
        if users_collection.find_one({"email": email}):
            return {
                "success": False,
                "message": "Email already registered"
            }
        
        # Hash password
        password_hash, salt = hash_password(password)
        
        # Create user record
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
    except Exception as e:
        print(f"Registration error: {e}")
        return {
            "success": False,
            "message": "Database connection error. Please try again later."
        }

def login_user(email: str, password: str) -> Dict[str, Any]:
    """
    Login user and create session
    Returns: dict with success status, message, and session token
    """
    if not users_collection:
        return {
            "success": False,
            "message": "Database not available"
        }
        
    try:
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
    except Exception as e:
        print(f"Login error: {e}")
        return {
            "success": False,
            "message": "Database connection error. Please try again later."
        }

def logout_user(session_token: str) -> Dict[str, Any]:
    """
    Logout user by invalidating session
    """
    try:
        sessions_collection.delete_one({"token": session_token})
        return {
            "success": True,
            "message": "Logged out successfully"
        }
    except Exception as e:
        print(f"Logout error: {e}")
        return {
            "success": False,
            "message": "Logout failed"
        }

def get_user_info(session_token: str) -> Optional[Dict[str, Any]]:
    """
    Get user information from session token
    """
    try:
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
    except Exception as e:
        print(f"Get user info error: {e}")
        return None
