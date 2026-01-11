'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';

export default function BillPaymentPage() {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    bill_no: '',
    bill_amount: '',
    bill_type: 'Electricity',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [bills, setBills] = useState<any[]>([]);

  const fetchBillDetails = async (billNumber: string) => {
    if (!billNumber.trim()) {
      setFormData(prev => ({
        ...prev,
        bill_amount: ''
      }));
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/bills/reference/${billNumber}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          bill_amount: data.amount.toString(),
          bill_type: data.bill_type
        }));
      } else {
        // If bill not found, clear the amount field
        setFormData(prev => ({
          ...prev,
          bill_amount: ''
        }));
      }
    } catch (error) {
      console.error('Error fetching bill details:', error);
      // On error, don't change the amount field to let user enter manually
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Fetch bill details when bill number changes
    if (name === 'bill_no') {
      fetchBillDetails(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/bills/payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          bill_no: formData.bill_no,
          bill_amount: parseFloat(formData.bill_amount),
          bill_type: formData.bill_type,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Bill payment successful!');
        // Reset form
        setFormData({
          bill_no: '',
          bill_amount: '',
          bill_type: 'Electricity',
          password: ''
        });
        // Refresh bills
        fetchUserBills();
      } else {
        setError(data.detail || 'Bill payment failed');
      }
    } catch (err) {
      setError('An error occurred while processing the bill payment');
      console.error('Bill payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBills = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/bills/user-bills/', {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBills(data.bills || []);
      } else if (response.status === 404) {
        // User has no accounts or no bills, set empty array
        setBills([]);
      }
    } catch (err) {
      console.error('Error fetching bills:', err);
      // Set empty array on error to prevent UI issues
      setBills([]);
    }
  };

  // Fetch bills when component mounts
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchUserBills();
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#00008B] mb-8">Bill Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bill Payment Form */}
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
                <label htmlFor="bill_no" className="block text-sm font-medium text-gray-700 mb-1">
                  Bill Number
                </label>
                <input
                  type="text"
                  id="bill_no"
                  name="bill_no"
                  value={formData.bill_no}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                  placeholder="Enter bill number"
                />
              </div>

              <div>
                <label htmlFor="bill_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Bill Type
                </label>
                <select
                  id="bill_type"
                  name="bill_type"
                  value={formData.bill_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                >
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Credit card">Credit Card</option>
                  <option value="Internet">Internet</option>
                  <option value="Gas">Gas</option>
                  <option value="Rent">Rent</option>
                  <option value="Telephone">Telephone</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label htmlFor="bill_amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Bill Amount
                </label>
                <input
                  type="number"
                  id="bill_amount"
                  name="bill_amount"
                  value={formData.bill_amount}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00008B]"
                  placeholder="Enter bill amount"
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
                {loading ? 'Processing...' : 'Pay Bill'}
              </button>
            </form>
          </div>

          {/* Bill History Table */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[#00008B] mb-6">Your Bills</h2>

            {bills.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bills found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bills.map((bill, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{bill.bill_no}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{bill.bill_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${bill.amount?.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{bill.due_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{bill.paid_date || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {bill.status}
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