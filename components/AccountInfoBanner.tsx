'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiClient } from '@/lib/api';

interface Account {
  id: number;
  account_number: string;
  account_type: string;
  balance: number;
  user_id: number;
}

export default function AccountInfoBanner() {
  const { authState } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!authState.isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiClient.getAccounts();
        setAccounts(data);
      } catch (err: any) {
        console.error('Error fetching accounts:', err);
        setError(err.message || 'Failed to load account information');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [authState.isAuthenticated]);

  if (!authState.isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-4 mb-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Account Information</h3>
            <p className="text-blue-100 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-4 mb-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Account Information</h3>
            <p className="text-red-100 text-sm">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-xl p-4 mb-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Account Information</h3>
            <p className="text-yellow-100 text-sm">No accounts found</p>
          </div>
        </div>
      </div>
    );
  }

  // Get the first account (or you could implement logic to select a primary account)
  const account = accounts[0];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-4 mb-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Account Information</h3>
          <p className="text-blue-100 text-sm">
            Account: {account.account_number} • Type: {account.account_type}
          </p>
        </div>
        <div className="mt-2 sm:mt-0">
          <p className="text-right font-bold text-xl">
            ${account.balance.toFixed(2)}
          </p>
          <p className="text-blue-200 text-xs text-right">Current Balance</p>
        </div>
      </div>
    </div>
  );
}