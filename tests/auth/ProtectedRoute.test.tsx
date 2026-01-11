import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { AuthProvider } from '../../components/auth/AuthProvider';

// Mock next/router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', async () => {
    // Mock an authenticated user
    mockLocalStorage.getItem.mockReturnValue('valid-token');

    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('redirects to login when user is not authenticated', async () => {
    // Mock no token
    mockLocalStorage.getItem.mockReturnValue(null);

    const { useRouter } = await import('next/navigation');
    const mockPush = vi.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});