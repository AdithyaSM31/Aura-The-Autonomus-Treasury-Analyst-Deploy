import { GOOGLE_CLIENT_ID, GOOGLE_SCOPE, DEMO_MODE } from '../config/googleAuth';

class GoogleAuthService {
  constructor() {
    this.isLoaded = false;
    this.user = null;
  }

  async loadGoogleAPI() {
    if (this.isLoaded) return Promise.resolve();

    // In demo mode, skip actual Google API loading
    if (DEMO_MODE) {
      this.isLoaded = true;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
            scope: GOOGLE_SCOPE
          }).then(() => {
            this.isLoaded = true;
            resolve();
          }).catch(reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async signIn() {
    try {
      await this.loadGoogleAPI();
      
      // Demo mode - return mock user
      if (DEMO_MODE) {
        this.user = {
          id: 'demo-user-123',
          name: 'Demo User',
          email: 'demo@aura-treasury.com',
          imageUrl: 'https://via.placeholder.com/150',
          token: 'demo-token'
        };
        return this.user;
      }
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      
      const profile = user.getBasicProfile();
      this.user = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl(),
        token: user.getAuthResponse().id_token
      };

      return this.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      if (this.isLoaded && !DEMO_MODE) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        await authInstance.signOut();
      }
      this.user = null;
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
      throw error;
    }
  }

  isSignedIn() {
    return this.user !== null;
  }

  getCurrentUser() {
    return this.user;
  }
}

const googleAuthService = new GoogleAuthService();
export default googleAuthService;