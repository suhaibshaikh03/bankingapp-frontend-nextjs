'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { apiClient } from '@/lib/api';

export default function BeneficiaryPage() {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    account_number: '',
    bank_name: 'Bank Alfalah', // Default bank name
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Prepare the request data for adding a beneficiary using the existing manage endpoint
      const requestData = {
        beneficiary_account_no: formData.account_number,
        bank_name: formData.bank_name, // Selected bank name
        recipient_name: formData.name,
        operation: 'add',
        password: formData.password // User's password for authentication
      };

      // Use the API client to manage beneficiary via the existing endpoint
      const data = await apiClient.request('/api/v1/beneficiaries/manage/', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      setMessage(data.message || 'Beneficiary added successfully!');

      // Reset form
      setFormData({
        name: '',
        account_number: '',
        bank_name: 'Bank Alfalah', // Default bank name
        password: ''
      });

      // Refresh beneficiaries
      fetchBeneficiaries();
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the beneficiary');
      console.error('Beneficiary addition error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBeneficiary = async (accountNumber: string) => {
    setLoading(true);
    setError('');

    try {
      // Prepare the request data for deleting a beneficiary using the existing manage endpoint
      // Need to get the bank name for the specific beneficiary being deleted
      const beneficiaryToDelete = beneficiaries.find(b => (b.account_number || b.account_no) === accountNumber);
      const bankName = beneficiaryToDelete?.bank_name || 'Bank Alfalah'; // Default bank name

      const requestData = {
        beneficiary_account_no: accountNumber,
        bank_name: bankName, // Use the bank name from the beneficiary
        recipient_name: '', // Not needed for deletion
        operation: 'delete',
        password: '' // Will prompt for user's password
      };

      // We need to ask for the user's password to authenticate the deletion
      const password = prompt('Please enter your password to confirm deletion:');
      if (!password) {
        setMessage('');
        return; // User cancelled
      }

      requestData.password = password;

      // Use the API client to manage beneficiary via the existing endpoint
      await apiClient.request('/api/v1/beneficiaries/manage/', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      setMessage('Beneficiary deleted successfully!');
      fetchBeneficiaries();
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the beneficiary');
      console.error('Beneficiary deletion error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBeneficiaries = async () => {
    try {
      // Use the API client to get user beneficiaries
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#00008B] mb-8">Manage Beneficiaries</h1>

        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Beneficiary</h2>

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
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Beneficiary Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                placeholder="Enter name for this beneficiary"
              />
            </div>

            <div>
              <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-1">
                Account Number *
              </label>
              <input
                type="text"
                id="account_number"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                placeholder="Enter account number"
              />
            </div>

            <div>
              <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name *
              </label>
              <select
                id="bank_name"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
              >
                <option value="Bank Alfalah">Bank Alfalah</option>
                <option value="JS Bank">JS Bank</option>
                <option value="Meezan Bank">Meezan Bank</option>
                <option value="Faysal Bank">Faysal Bank</option>
                <option value="Nayapay">Nayapay</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="Sadapay">Sadapay</option>
                <option value="MCB">MCB</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Your Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                placeholder="Enter your password for authentication"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00008B] text-white py-3 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Add Beneficiary'}
            </button>
          </form>
        </div>

        {/* Beneficiary List */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-[#00008B] mb-6">Your Beneficiaries</h2>

          {beneficiaries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No beneficiaries added yet</p>
          ) : (
            <div className="space-y-4">
              {beneficiaries.map((beneficiary, index) => (
                <div key={beneficiary.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                  <div>
                    <div className="font-medium text-gray-900">{beneficiary.name || beneficiary.recipient_name}</div>
                    <div className="text-sm text-gray-500">Account: {beneficiary.account_number || beneficiary.account_no}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteBeneficiary(beneficiary.account_number || beneficiary.account_no)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}