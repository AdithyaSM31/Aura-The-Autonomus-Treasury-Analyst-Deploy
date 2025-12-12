# Aura Configuration
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Groq API Configuration
# IMPORTANT: Set GROQ_API_KEY in your .env file or environment variables
GEMINI_API_KEY = os.getenv("GROQ_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is required. Please set it in .env file or environment.")

# API Configuration - Using Groq API
GEMINI_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
