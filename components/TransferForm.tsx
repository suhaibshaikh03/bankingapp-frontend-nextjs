'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuth } from './auth/AuthProvider';

interface TransferFormData {
  targetAccountNumber: string;
  amount: string;
  username: string;
  password: string;
}

const TransferForm: React.FC = () => {
  const [formData, setFormData] = useState<TransferFormData>({
    targetAccountNumber: '',
    amount: '',
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentUserBalance, setCurrentUserBalance] = useState<number | null>(null);

  const router = useRouter();
  const { authState } = useAuth();

  // Get user's current balance on component mount
  useEffect(() => {
    const fetchUserBalance = async () => {
      if (authState.isAuthenticated) {
        try {
          const accounts = await apiClient.getAccounts();
          const totalBalance = accounts.reduce((sum: number, account: any) => sum + account.balance, 0);
          setCurrentUserBalance(totalBalance);
        } catch (error) {
          console.error('Error fetching user balance:', error);
        }
      }
    };

    fetchUserBalance();
  }, [authState.isAuthenticated]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.targetAccountNumber.trim()) {
      newErrors.targetAccountNumber = 'Target account number is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Transfer amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (currentUserBalance !== null && amount > currentUserBalance) {
        newErrors.amount = `Insufficient balance. Current balance: $${currentUserBalance.toFixed(2)}`;
      }
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      // First, authenticate the user to make sure credentials are correct
      await apiClient.login(formData.username, formData.password);

      // Get user's accounts to find the source account
      const userAccounts = await apiClient.getAccounts();

      if (userAccounts.length === 0) {
        throw new Error('No accounts found for this user');
      }

      // For simplicity, we'll use the first account as the source account
      // In a real app, you might want to let the user choose which account to use
      const sourceAccount = userAccounts[0];

      // Validate that the source account has sufficient funds
      if (sourceAccount.balance < parseFloat(formData.amount)) {
        throw new Error(`Insufficient balance. Current balance: $${sourceAccount.balance.toFixed(2)}`);
      }

      // Create a debit transaction for the source account (outgoing transfer)
      const transactionData = {
        transaction_type: "debit",
        amount: parseFloat(formData.amount),
        description: `Transfer to account ${formData.targetAccountNumber}`,
        account_id: sourceAccount.id
      };

      // Create the transaction (this will automatically update the account balance)
      const transaction = await apiClient.createTransaction(transactionData);

      // Reset form
      setFormData({
        targetAccountNumber: '',
        amount: '',
        username: '',
        password: ''
      });

      setSuccessMessage('Transfer completed successfully!');

      // Refresh balance
      if (authState.isAuthenticated) {
        const accounts = await apiClient.getAccounts();
        const totalBalance = accounts.reduce((sum: number, account: any) => sum + account.balance, 0);
        setCurrentUserBalance(totalBalance);
      }
    } catch (error: any) {
      console.error('Transfer error:', error);
      setErrors({ submit: error.message || 'Transfer failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Transfer Funds</h2>
        {currentUserBalance !== null && (
          <p className="text-gray-600 mt-1">
            Current Balance: <span className="font-bold">${currentUserBalance.toFixed(2)}</span>
          </p>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="targetAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Target Account Number
          </label>
          <input
            type="text"
            id="targetAccountNumber"
            name="targetAccountNumber"
            value={formData.targetAccountNumber}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.targetAccountNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter target account number"
          />
          {errors.targetAccountNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.targetAccountNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter transfer amount"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing Transfer...' : 'Transfer Funds'}
        </button>
      </form>
    </div>
  );
};

export default TransferForm;