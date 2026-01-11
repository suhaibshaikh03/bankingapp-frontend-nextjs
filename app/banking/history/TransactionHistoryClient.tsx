'use client';

import React, { useState, useEffect } from 'react';
import { TransactionHistory } from '@/types/transaction';
import { apiClient } from '@/lib/api';
import TransactionTable from '@/app/components/TransactionHistory/TransactionTable';

const TransactionHistoryClient: React.FC = () => {
  const [history, setHistory] = useState<TransactionHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getTransactionHistory();
        setHistory(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        setError('Failed to load transaction history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading transaction history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      {history && <TransactionTable history={history} />}
    </div>
  );
};

export default TransactionHistoryClient;