import { AuthToken } from '@/types/auth';

// Function to check if a JWT token is valid and not expired
export const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  try {
    // Split the token to get the payload (middle part)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      // Invalid JWT format
      return false;
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(tokenParts[1]));

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    // If there's an error decoding, the token is invalid
    console.error('Error validating token:', error);
    return false;
  }
};

// Function to get token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Function to save token to localStorage
export const saveToken = (token: AuthToken): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token.accessToken);
    if (token.refreshToken) {
      localStorage.setItem('refreshToken', token.refreshToken);
    }
  }
};

// Function to remove token from localStorage
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Function to get user info from token
export const getUserFromToken = (token: string | null) => {
  if (!token) {
    return null;
  }

  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    return {
      id: payload.user_id || payload.sub || payload.id,
      username: payload.sub, // sub contains the username
      email: payload.email,
      firstName: payload.firstName || payload.first_name || payload.name || 'User',
    };
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};

// Function to refresh the access token using the refresh token
// Note: The backend doesn't currently support refresh tokens, so this function returns null
export const refreshToken = async (): Promise<string | null> => {
  // Since the backend doesn't support refresh tokens, we return null
  // This means users will need to log in again when their token expires
  return null;
};

// Function to check if a token is about to expire (within 5 minutes)
export const isTokenExpiringSoon = (token: string | null): boolean => {
  if (!token) {
    return true; // If no token, treat as expiring
  }

  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return true; // Invalid token format
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const fiveMinutesInSeconds = 5 * 60;

    // Return true if token expires in the next 5 minutes or less
    return payload.exp - currentTime <= fiveMinutesInSeconds;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // On error, assume token is expiring
  }
};