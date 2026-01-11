// Authentication-related TypeScript types

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiryTime: number; // Unix timestamp
  userId: string;
  roles?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  token?: string;
  user?: {
    id: string;
    username?: string;
    email?: string;
    firstName?: string;
  };
  isLoading: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export interface ProtectedRouteConfig {
  path: string;
  requiresAuth: boolean;
  allowedRoles?: string[];
}