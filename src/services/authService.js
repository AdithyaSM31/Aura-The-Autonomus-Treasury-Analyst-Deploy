// Authentication Service for Frontend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class AuthService {
  constructor() {
    this.sessionToken = localStorage.getItem('session_token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async register(email, password, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.session_token) {
        this.sessionToken = data.session_token;
        this.user = data.user;
        
        // Store in localStorage
        localStorage.setItem('session_token', data.session_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      if (this.sessionToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_token: this.sessionToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      this.sessionToken = null;
      this.user = null;
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
    }
  }

  async getUserInfo() {
    try {
      if (!this.sessionToken) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Session expired or invalid
        this.logout();
        return null;
      }

      if (data.success) {
        this.user = data.user;
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      }

      return null;
    } catch (error) {
      console.error('Get user info error:', error);
      return null;
    }
  }

  isAuthenticated() {
    return this.sessionToken !== null && this.user !== null;
  }

  getUser() {
    return this.user;
  }

  getSessionToken() {
    return this.sessionToken;
  }
}

const authService = new AuthService();
export default authService;
