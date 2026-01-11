'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { apiClient } from '@/lib/api';

export default function TransferPage() {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    target_account_number: '',
    username: authState.user?.username || '',
    password: '',
    amount: '',
    entry_method: 'manual' // 'manual' or 'beneficiary'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('');

  const fetchBeneficiaries = async () => {
    try {
      const data = await apiClient.getBeneficiaries();
      setBeneficiaries(data || []);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
    }
  };

  // Fetch beneficiaries when component mounts
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchBeneficiaries();
    }
  }, [authState.isAuthenticated]);

  const handleEntryMethodChange = (method: string) => {
    setFormData(prev => ({
      ...prev,
      entry_method: method,
      target_account_number: '' // Clear account number when switching methods
    }));
    setSelectedBeneficiary(''); // Clear beneficiary selection when switching methods
  };

  const handleBeneficiaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedBeneficiary(selectedId);

    if (selectedId) {
      // Find the selected beneficiary
      const beneficiary = beneficiaries.find(b => b.id?.toString() === selectedId || b.name === selectedId);
      if (beneficiary) {
        setFormData(prev => ({
          ...prev,
          target_account_number: beneficiary.account_number || beneficiary.account_no || '',
          entry_method: 'beneficiary'
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        target_account_number: '',
        entry_method: 'manual'
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle the target_account_number differently when using manual input
    if (name === 'target_account_number' && formData.entry_method === 'manual') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setSelectedBeneficiary(''); // Clear beneficiary selection
    } else if (name !== 'target_account_number') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/transfers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          target_account_number: formData.target_account_number,
          username: formData.username,
          password: formData.password,
          amount: parseFloat(formData.amount)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Transfer successful!');
        // Reset form
        setFormData({
          target_account_number: '',
          username: authState.user?.username || '',
          password: '',
          amount: ''
        });
      } else {
        setError(data.detail || 'Transfer failed');
      }
    } catch (err) {
      setError('An error occurred while processing the transfer');
      console.error('Transfer error:', err);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-[#00008B] mb-8">Transfer Funds</h1>

        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Entry Method Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">How would you like to enter the account?</h3>
            <div className="flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="entry_method"
                  value="beneficiary"
                  checked={formData.entry_method === 'beneficiary'}
                  onChange={() => handleEntryMethodChange('beneficiary')}
                  className="h-4 w-4 text-[#00008B] focus:ring-[#00008B]"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Select Beneficiary</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="entry_method"
                  value="manual"
                  checked={formData.entry_method === 'manual'}
                  onChange={() => handleEntryMethodChange('manual')}
                  className="h-4 w-4 text-[#00008B] focus:ring-[#00008B]"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Manual Entry</span>
              </label>
            </div>
          </div>

          {/* Conditional Rendering based on entry method */}
          {formData.entry_method === 'beneficiary' && (
            <div>
              <label htmlFor="beneficiary_select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Beneficiary *
              </label>
              <select
                id="beneficiary_select"
                value={selectedBeneficiary}
                onChange={handleBeneficiaryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                required
              >
                <option value="">Choose a beneficiary</option>
                {beneficiaries.map((beneficiary, index) => (
                  <option key={beneficiary.id || index} value={beneficiary.id?.toString() || beneficiary.name}>
                    {beneficiary.name || beneficiary.recipient_name} - {beneficiary.account_number || beneficiary.account_no}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.entry_method === 'manual' && (
            <div>
              <label htmlFor="target_account_number" className="block text-sm font-medium text-gray-700 mb-1">
                Target Account Number *
              </label>
              <input
                type="text"
                id="target_account_number"
                name="target_account_number"
                value={formData.target_account_number}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                placeholder="Enter target account number"
              />
            </div>
          )}

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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
              placeholder="Enter username"
              readOnly
            />
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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Transfer
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00008B] text-white py-3 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Transfer Funds'}
          </button>
        </form>
      </div>
    </div>
  );
}