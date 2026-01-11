'use client';

import { useAuth } from '../../../components/auth/AuthProvider';
import TransactionHistoryClient from './TransactionHistoryClient';

const TransactionHistoryPage = () => {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
          <p>Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <TransactionHistoryClient />
  );
};

export default TransactionHistoryPage;