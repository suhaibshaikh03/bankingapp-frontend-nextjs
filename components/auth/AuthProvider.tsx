'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, AuthToken } from '../../types/auth';
import {
  getToken,
  isTokenValid,
  getUserFromToken,
  removeToken,
  refreshToken,
  isTokenExpiringSoon
} from '../../lib/auth';

interface AuthContextType {
  authState: AuthState;
  login: (tokenData: AuthToken) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: undefined,
    token: undefined,
  });

  // Check authentication status on mount and set up token refresh
  useEffect(() => {
    checkAuthStatus();

    // Set up periodic token refresh check
    const interval = setInterval(async () => {
      const token = getToken();
      if (token && isTokenExpiringSoon(token)) {
        // Try to refresh the token
        const newToken = await refreshToken();
        if (newToken) {
          // Update state with new token
          const user = getUserFromToken(newToken);
          setAuthState({
            isAuthenticated: true,
            token: newToken,
            user,
            isLoading: false,
          });
        } else {
          // If refresh failed, log the user out
          setAuthState({
            isAuthenticated: false,
            token: undefined,
            user: undefined,
            isLoading: false,
          });
        }
      }
    }, 60000); // Check every minute

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    const token = getToken();

    if (token) {
      if (isTokenValid(token)) {
        const user = getUserFromToken(token);
        setAuthState({
          isAuthenticated: true,
          token,
          user,
          isLoading: false,
        });
      } else if (isTokenExpiringSoon(token)) {
        // Try to refresh the token
        const newToken = await refreshToken();
        if (newToken) {
          const user = getUserFromToken(newToken);
          setAuthState({
            isAuthenticated: true,
            token: newToken,
            user,
            isLoading: false,
          });
        } else {
          // If refresh failed, set to unauthenticated
          setAuthState({
            isAuthenticated: false,
            token: undefined,
            user: undefined,
            isLoading: false,
          });
        }
      } else {
        // Token is invalid and can't be refreshed
        setAuthState({
          isAuthenticated: false,
          token: undefined,
          user: undefined,
          isLoading: false,
        });
      }
    } else {
      // No token at all
      setAuthState({
        isAuthenticated: false,
        token: undefined,
        user: undefined,
        isLoading: false,
      });
    }
  };

  const login = async (tokenData: AuthToken) => {
    // Save tokens to localStorage
    typeof window !== 'undefined' && localStorage.setItem('accessToken', tokenData.accessToken);
    if (tokenData.refreshToken) {
      typeof window !== 'undefined' && localStorage.setItem('refreshToken', tokenData.refreshToken);
    }

    try {
      // Get user from token first
      let user = getUserFromToken(tokenData.accessToken);

      // Then fetch the full user profile from the API to ensure all fields are populated
      const apiUserResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://suhaibshaikh03-baningapp-backend.hf.space/'}/users/me`, {
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (apiUserResponse.ok) {
        const apiUser = await apiUserResponse.json();
        // Merge the API user data with token data to ensure complete user object
        user = {
          ...user,
          id: apiUser.id,
          username: apiUser.username || user?.username,
          email: apiUser.email || user?.email,
          firstName: apiUser.first_name || apiUser.firstName || user?.firstName || 'User',
        };
      }

      setAuthState({
        isAuthenticated: true,
        token: tokenData.accessToken,
        user,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching user profile after login:', error);
      // Fallback to user from token if API call fails
      const user = getUserFromToken(tokenData.accessToken);
      setAuthState({
        isAuthenticated: true,
        token: tokenData.accessToken,
        user,
        isLoading: false,
      });
    }
  };

  const logout = () => {
    // Remove tokens from localStorage
    removeToken();

    setAuthState({
      isAuthenticated: false,
      token: undefined,
      user: undefined,
      isLoading: false,
    });
  };

  const contextValue: AuthContextType = {
    authState,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};