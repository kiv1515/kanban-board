import { JwtPayload, jwtDecode } from 'jwt-decode';

// Custom interface for your JWT payload
interface CustomJwtPayload extends JwtPayload {
  email?: string;
  username?: string;
  // Add any other custom claims your JWT includes
}

class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  getProfile(): CustomJwtPayload | null {
    const token = this.getToken();
    try {
      return token ? jwtDecode<CustomJwtPayload>(token) : null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  loggedIn(): boolean {
    const token = this.getToken();
    return Boolean(token && !this.isTokenExpired(token));
  }
  
  isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      if (!decodedToken.exp) return true;
      
      // Add a small buffer (e.g., 60 seconds) to prevent edge cases
      const currentTime = Date.now() / 1000;
      const bufferTime = 60; // seconds
      
      return decodedToken.exp < (currentTime - bufferTime);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  getToken(): string {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token || '';
    } catch (error) {
      console.error('Error retrieving token:', error);
      return '';
    }
  }

  login(idToken: string, refreshToken?: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, idToken);
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
      window.location.href = '/';
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to complete login process');
    }
  }

  logout(): void {
    try {
      // Clear all auth-related storage
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      sessionStorage.clear();
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Failed to complete logout process');
    }
  }

}

export default new AuthService();