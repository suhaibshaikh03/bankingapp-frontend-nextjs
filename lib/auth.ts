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
      id: payload.userId || payload.sub || payload.id,
      username: payload.username,
      email: payload.email,
      firstName: payload.firstName || payload.first_name || payload.name || payload.sub || 'User',
    };
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};

// Function to refresh the access token using the refresh token
export const refreshToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return null;
  }

  try {
    // Refresh token using the backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://suhaibshaikh03-baningapp-backend.hf.space/'}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      // Save the new tokens
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      return data.accessToken;
    } else {
      // If refresh fails, remove tokens and return null
      removeToken();
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
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