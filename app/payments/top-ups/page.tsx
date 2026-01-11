'use client';

import { useState } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';

export default function TopUpsPage() {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    mobile_number: '',
    amount: '',
    provider: 'UFONE',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const response = await fetch('http://localhost:8000/api/v1/top-ups/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          mobile_number: formData.mobile_number,
          amount: parseFloat(formData.amount),
          provider: formData.provider,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Top-up successful!');
        // Reset form
        setFormData({
          mobile_number: '',
          amount: '',
          provider: 'UFONE',
          password: ''
        });
      } else {
        setError(data.detail || 'Top-up failed');
      }
    } catch (err) {
      setError('An error occurred while processing the top-up');
      console.error('Top-up error:', err);
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
        <h1 className="text-3xl font-bold text-center text-[#00008B] mb-8">Mobile Top-ups</h1>

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
            <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number (11 digits)
            </label>
            <input
              type="text"
              id="mobile_number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
              maxLength={11}
              pattern="[0-9]{11}"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
              placeholder="Enter 11-digit mobile number"
            />
            <p className="text-xs text-gray-500 mt-1">Must be exactly 11 digits</p>
          </div>

          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Provider
            </label>
            <select
              id="provider"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
            >
              <option value="UFONE">UFONE</option>
              <option value="JAZZ">JAZZ</option>
              <option value="ZONG">ZONG</option>
              <option value="WARID">WARID</option>
              <option value="NCOM">NCOM</option>
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Top-up
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00008B] text-white py-3 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Top-up'}
          </button>
        </form>
      </div>
    </div>
  );
}