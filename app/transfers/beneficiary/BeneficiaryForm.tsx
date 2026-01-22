'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { apiClient } from '@/lib/api';
import AccountInfoBanner from '@/components/AccountInfoBanner';

export default function BeneficiaryForm() {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    account_number: '',
    bank_name: 'Bank Alfalah',
    password: ''
  });
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [operation, setOperation] = useState<'add' | 'delete'>('add');

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
      if (operation === 'add') {
        // Use the manage endpoint for adding beneficiaries (same as deletion)
        const data = await apiClient.request<any>('/banking/beneficiaries/manage/', {
          method: 'POST',
          body: JSON.stringify({
            recipient_name: formData.name,
            beneficiary_account_no: formData.account_number,
            bank_name: formData.bank_name,
            operation: operation,
            password: formData.password
          })
        });

        setMessage(data?.message || 'Beneficiary added successfully!');
      } else {
        // For deletion, use the manage endpoint
        const data = await apiClient.request<any>('/banking/beneficiaries/manage/', {
          method: 'POST',
          body: JSON.stringify({
            beneficiary_account_no: formData.account_number,
            operation: operation,
            password: formData.password
          })
        });

        setMessage(data?.message || 'Beneficiary deleted successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        account_number: '',
        bank_name: 'Bank Alfalah',
        password: ''
      });

      // Refresh beneficiaries
      fetchBeneficiaries();
    } catch (err: any) {
      setError(err.message || 'An error occurred while managing the beneficiary');
      console.error('Beneficiary error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteBeneficiary = async (beneficiaryId: string) => {
    if (!window.confirm('Are you sure you want to delete this beneficiary? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await apiClient.request<any>('/banking/beneficiaries/manage/', {
        method: 'POST',
        body: JSON.stringify({
          beneficiary_account_no: beneficiaryId,
          operation: 'delete',
          password: '' // Will prompt for password
        })
      });

      setMessage(data?.message || 'Beneficiary deleted successfully!');
      fetchBeneficiaries();
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the beneficiary');
      console.error('Delete beneficiary error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Beneficiary Management</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Manage your trusted recipients for quick transfers
          </p>
        </div>

        <div className="mb-6">
          <AccountInfoBanner />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Delete Beneficiary Form */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <h2 className="text-2xl font-bold text-white">Manage Beneficiaries</h2>
              <p className="text-blue-100 mt-1">Add or remove trusted recipients</p>
            </div>

            <div className="p-8">
              {message && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-4">
                <button
                  onClick={() => setOperation('add')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${operation === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Add Beneficiary
                </button>
                <button
                  onClick={() => setOperation('delete')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${operation === 'delete' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Remove Beneficiary
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {operation === 'add' && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="Enter recipient's name"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="account_number"
                          name="account_number"
                          value={formData.account_number}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="Enter account number"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {operation === 'delete' && (
                  <div>
                    <label htmlFor="beneficiary-select" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Beneficiary to Remove
                    </label>
                    <div className="relative">
                      <select
                        id="beneficiary-select"
                        value=""
                        onChange={(e) => {
                          const [account_no, bank_name] = e.target.value.split('|');
                          if (account_no && bank_name) {
                            setFormData(prev => ({
                              ...prev,
                              account_number: account_no,
                              bank_name: bank_name
                            }));
                          }
                        }}
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
                      >
                        <option value="">Select a beneficiary to remove</option>
                        {beneficiaries.map((beneficiary, index) => (
                          <option key={index} value={`${beneficiary.account_number || beneficiary.account_no}|${beneficiary.bank_name || beneficiary.bank}`}>
                            {beneficiary.name || beneficiary.recipient_name} - {(beneficiary.account_number || beneficiary.account_no).slice(-4)}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <div className="relative">
                    <select
                      id="bank_name"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
                    >
                      <option value="Bank Alfalah">Bank Alfalah</option>
                      <option value="JS Bank">JS Bank</option>
                      <option value="Meezan Bank">Meezan Bank</option>
                      <option value="Faysal Bank">Faysal Bank</option>
                      <option value="Nayapay">Nayapay</option>
                      <option value="easypaisa">easypaisa</option>
                      <option value="Sadapay">Sadapay</option>
                      <option value="MCB">MCB</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H6a2 2 0 00-2 2v-6m14 0V9a2 2 0 00-2-2h-2M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Enter password"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {operation === 'add' ? 'Adding...' : 'Removing...'}
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {operation === 'add' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          )}
                        </svg>
                        {operation === 'add' ? 'Add Beneficiary' : 'Remove Beneficiary'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Beneficiaries List */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6">
              <h2 className="text-2xl font-bold text-white">Your Beneficiaries</h2>
              <p className="text-emerald-100 mt-1">Trusted recipients for quick transfers</p>
            </div>

            <div className="p-6">
              {beneficiaries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No Beneficiaries</h3>
                  <p className="mt-2 text-sm text-gray-500">You haven't added any beneficiaries yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {beneficiaries.map((beneficiary, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                          <span className="text-white font-medium text-sm">
                            {beneficiary.name?.charAt(0)?.toUpperCase() ||
                             beneficiary.recipient_name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {beneficiary.name || beneficiary.recipient_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {beneficiary.account_number || beneficiary.account_no} • {beneficiary.bank_name || beneficiary.bank}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBeneficiary(beneficiary.account_number || beneficiary.account_no)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">Secure Management</h3>
              <p className="text-sm text-gray-500">Your beneficiaries are securely stored and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}