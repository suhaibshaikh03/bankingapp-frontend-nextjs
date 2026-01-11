'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { ProtectedRouteProps } from '../../types/auth';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { authState } = useAuth();
  const router = useRouter();

  // If still loading auth status, show loading indicator
  if (authState.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, show "Login to use features" message instead of redirecting to signup
  if (!authState.isAuthenticated) {
    // Show login message for all routes except home ('/')
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    if (currentPath !== '/') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">Login to use features</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }
    // Allow unauthenticated users on home page ('/')
    return <>{children}</>;
  }

  // If roles are specified and user doesn't have required role, deny access
  if (allowedRoles.length > 0) {
    const userHasRole = authState.user?.roles?.some(role => allowedRoles.includes(role));
    if (!userHasRole) {
      router.push('/unauthorized'); // Redirect to unauthorized page
      return null;
    }
  }

  // User is authenticated and has required roles, render children
  return <>{children}</>;
};

export default ProtectedRoute;