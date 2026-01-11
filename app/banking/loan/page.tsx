'use client';

import { useState } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';

export default function LoanPage() {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    loan_type: 'car',
    loan_amount: '',
    loan_term_months: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loans, setLoans] = useState<any[]>([]);

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
      const response = await fetch('http://localhost:8000/api/v1/loans/request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          loan_type: formData.loan_type,
          loan_amount: parseFloat(formData.loan_amount),
          loan_term_months: parseInt(formData.loan_term_months),
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Loan request submitted successfully!');
        // Reset form
        setFormData({
          loan_type: 'car',
          loan_amount: '',
          loan_term_months: '',
          password: ''
        });
        // Refresh loans
        fetchUserLoans();
      } else {
        setError(data.detail || 'Loan request failed');
      }
    } catch (err) {
      setError('An error occurred while submitting the loan request');
      console.error('Loan request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLoans = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/loans/user-loans/', {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLoans(data.loans || []);
      }
    } catch (err) {
      console.error('Error fetching loans:', err);
    }
  };

  // Fetch loans when component mounts
  if (typeof window !== 'undefined') {
    fetchUserLoans();
  }

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#00008B] mb-8">Loan Request</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Loan Request Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
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
                <label htmlFor="loan_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Type
                </label>
                <select
                  id="loan_type"
                  name="loan_type"
                  value={formData.loan_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                >
                  <option value="car">Car Loan</option>
                  <option value="house">House Loan</option>
                  <option value="other">Other Loan</option>
                </select>
              </div>

              <div>
                <label htmlFor="loan_amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Amount
                </label>
                <input
                  type="number"
                  id="loan_amount"
                  name="loan_amount"
                  value={formData.loan_amount}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                  placeholder="Enter loan amount"
                />
              </div>

              <div>
                <label htmlFor="loan_term_months" className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term (Months)
                </label>
                <input
                  type="number"
                  id="loan_term_months"
                  name="loan_term_months"
                  value={formData.loan_term_months}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                  placeholder="Enter loan term in months"
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
                {loading ? 'Processing...' : 'Submit Loan Request'}
              </button>
            </form>
          </div>

          {/* Loan History Table */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[#00008B] mb-6">Your Loans</h2>

            {loans.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No loans found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loans.map((loan, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{loan.loan_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{loan.loan_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${loan.paid_amount?.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${loan.remaining_amount?.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{(loan.interest_rate * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">{loan.loan_term_months} mo</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                            loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}