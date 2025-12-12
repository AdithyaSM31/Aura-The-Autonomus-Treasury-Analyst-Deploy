# Authentication Setup Guide

## Real User Authentication

The application now uses a real authentication system with user registration and login functionality.

### Features

- **User Registration**: New users can create accounts with email, password, and name
- **Secure Login**: Passwords are hashed with SHA-256 and salt
- **Session Management**: 24-hour session tokens for authenticated users
- **Persistent Storage**: User data stored in JSON files (can be upgraded to database)

### Backend Files

1. **auth_service.py** - Core authentication logic
   - `register_user()` - Create new user accounts
   - `login_user()` - Authenticate and create sessions
   - `validate_session()` - Check session validity
   - `get_user_info()` - Retrieve user details

2. **main.py** - API endpoints added:
   - `POST /auth/register` - Register new user
   - `POST /auth/login` - Login user
   - `POST /auth/logout` - Logout user
   - `GET /auth/user` - Get user info

### Frontend Files

1. **src/services/authService.js** - Frontend authentication service
   - Handles API calls to backend
   - Manages localStorage for session tokens
   - Provides authentication state management

2. **src/components/LoginPage.js** - Updated login/signup UI
   - Real form validation
   - Error and success message display
   - Password strength requirements
   - Both login and registration modes

3. **src/App.js** - Updated app state management
   - Checks for existing sessions on load
   - Handles logout properly
   - Maintains user state

### Password Requirements

- Minimum 8 characters
- Must be hashed before storage
- Confirmation required on registration

### Session Management

- 24-hour session expiration
- Automatic logout on expired sessions
- Secure token generation using secrets module

### Database Files

Two JSON files are automatically created:

1. **users_db.json** - User credentials and profiles
2. **sessions_db.json** - Active session tokens

⚠️ **Security Note**: For production use, consider:
- Moving to a proper database (PostgreSQL, MongoDB)
- Using bcrypt or Argon2 for password hashing
- Implementing HTTPS
- Adding email verification
- Implementing password reset functionality
- Adding rate limiting for login attempts

### Testing the Authentication

1. Start the backend server:
   ```bash
   python main.py
   ```

2. Start the frontend:
   ```bash
   npm start
   ```

3. Register a new account with:
   - Full name
   - Valid email address
   - Password (min 8 characters)

4. Login with your credentials

5. Session persists across page refreshes

### API Usage Example

**Register:**
```javascript
POST http://localhost:8000/auth/register
{
  "email": "user@example.com",
  "password": "securepass123",
  "name": "John Doe"
}
```

**Login:**
```javascript
POST http://localhost:8000/auth/login
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Login successful",
  "session_token": "abc123...",
  "user": {
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

### Demo Mode

Demo mode has been disabled. To re-enable it for testing:

Set in `src/config/googleAuth.js`:
```javascript
export const DEMO_MODE = true;
```

This allows the app to work without the backend server for demo purposes.
