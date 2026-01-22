'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from './auth/AuthProvider';

interface BeneficiaryFormData {
  name: string;
  accountNumber: string;
  bankName: string;
  operation: 'add' | 'delete';
  password: string;
}

const BeneficiaryForm: React.FC = () => {
  const [formData, setFormData] = useState<BeneficiaryFormData>({
    name: '',
    accountNumber: '',
    bankName: '',
    operation: 'add',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<number | null>(null);

  const { authState } = useAuth();

  // Get existing beneficiaries on component mount
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      if (authState.isAuthenticated) {
        try {
          const data = await apiClient.getBeneficiaries();
          setBeneficiaries(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching beneficiaries:', error);
        }
      }
    };

    fetchBeneficiaries();
  }, [authState.isAuthenticated]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.operation === 'add') {
      if (!formData.name.trim()) {
        newErrors.name = 'Recipient name is required';
      }

      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      }

      if (!formData.bankName) {
        newErrors.bankName = 'Bank name is required';
      }
    } else if (formData.operation === 'delete') {
      if (!selectedBeneficiaryId) {
        newErrors.operation = 'Please select a beneficiary to delete';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleOperationChange = (operation: 'add' | 'delete') => {
    setFormData(prev => ({ ...prev, operation }));
    setSelectedBeneficiaryId(null);

    // Clear errors when operation changes
    setErrors({});
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleBeneficiarySelect = (id: number) => {
    setSelectedBeneficiaryId(id);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.operation;
      return newErrors;
    });
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
      await apiClient.login(authState.user?.username || '', formData.password);

      if (formData.operation === 'add') {
        // Prepare beneficiary data
        const beneficiaryData = {
          name: formData.name,
          account_number: formData.accountNumber,
          bank_name: formData.bankName,
          beneficiary_type: "external", // Default type
          user_id: authState.user?.id // This will be set by the backend based on the authenticated user
        };

        // Create the beneficiary
        await apiClient.createBeneficiary(beneficiaryData);

        setFormData({
          name: '',
          accountNumber: '',
          bankName: '',
          operation: 'add',
          password: ''
        });

        setSuccessMessage('Beneficiary added successfully!');

        // Refresh the list
        const updatedBeneficiaries = await apiClient.getBeneficiaries();
        setBeneficiaries(Array.isArray(updatedBeneficiaries) ? updatedBeneficiaries : []);
      } else if (formData.operation === 'delete' && selectedBeneficiaryId) {
        // Delete the beneficiary
        await apiClient.request(`/api/v1/beneficiaries/${selectedBeneficiaryId}`, {
          method: 'DELETE'
        });

        setSuccessMessage('Beneficiary deleted successfully!');

        // Refresh the list
        const updatedBeneficiaries = await apiClient.getBeneficiaries();
        setBeneficiaries(Array.isArray(updatedBeneficiaries) ? updatedBeneficiaries : []);
        setSelectedBeneficiaryId(null);
      }
    } catch (error: any) {
      console.error('Beneficiary operation error:', error);
      setErrors({ submit: error.message || 'Operation failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Supported banks from the spec
  const supportedBanks = [
    'Bank Alfalah',
    'JS Bank',
    'Meezan Bank',
    'Faysal Bank',
    'Nayapay',
    'easypaisa',
    'Sadapay',
    'MCB'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {formData.operation === 'add' ? 'Add Beneficiary' : 'Delete Beneficiary'}
          </h2>

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
            {/* Operation Selection */}
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="operation"
                  checked={formData.operation === 'add'}
                  onChange={() => handleOperationChange('add')}
                  className="mr-2"
                />
                <span>Add Beneficiary</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="operation"
                  checked={formData.operation === 'delete'}
                  onChange={() => handleOperationChange('delete')}
                  className="mr-2"
                />
                <span>Delete Beneficiary</span>
              </label>
            </div>

            {formData.operation === 'add' ? (
              <>
                {/* Recipient Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter recipient's name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter account number"
                  />
                  {errors.accountNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                  )}
                </div>

                {/* Bank Name */}
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <select
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.bankName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a bank</option>
                    {supportedBanks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  {errors.bankName && (
                    <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                  )}
                </div>
              </>
            ) : (
              // Delete operation - show beneficiary selection
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Beneficiary to Delete
                </label>
                {beneficiaries.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {beneficiaries.map(beneficiary => (
                      <div
                        key={beneficiary.id}
                        className={`p-3 border rounded-md cursor-pointer ${
                          selectedBeneficiaryId === beneficiary.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleBeneficiarySelect(beneficiary.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{beneficiary.name}</div>
                            <div className="text-sm text-gray-600">Account: {beneficiary.account_number}</div>
                            <div className="text-sm text-gray-600">Bank: {beneficiary.bank_name}</div>
                          </div>
                          {selectedBeneficiaryId === beneficiary.id && (
                            <span className="text-blue-600">✓ Selected</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border border-gray-300 rounded-md text-gray-500">
                    No beneficiaries found
                  </div>
                )}
                {errors.operation && (
                  <p className="mt-1 text-sm text-red-600">{errors.operation}</p>
                )}
              </div>
            )}

            {/* Password */}
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
              {loading
                ? (formData.operation === 'add' ? 'Adding...' : 'Deleting...')
                : (formData.operation === 'add' ? 'Add Beneficiary' : 'Delete Beneficiary')
              }
            </button>
          </form>
        </div>

        {/* Beneficiary List Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Beneficiaries</h2>

          {beneficiaries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {beneficiaries.map(beneficiary => (
                    <tr key={beneficiary.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{beneficiary.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{beneficiary.account_number}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{beneficiary.bank_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No beneficiaries found. Add one using the form.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryForm;