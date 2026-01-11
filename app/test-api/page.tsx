'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

const TestApiPage: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    try {
      // Test if we can reach the backend
      const response = await fetch('http://localhost:8000');
      setTestResults(prev => ({ ...prev, connection: response.ok ? 'Connected to backend' : 'Connection failed' }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, connection: 'Connection failed: ' + error.message }));
    }
    setLoading(false);
  };

  const testTransactionsEndpoint = async () => {
    setLoading(true);
    try {
      // Test transactions endpoint (will fail without auth)
      try {
        const transactions = await apiClient.getTransactions();
        setTestResults(prev => ({ ...prev, transactions: 'Success: Fetched ' + transactions.length + ' transactions' }));
      } catch (error: any) {
        setTestResults(prev => ({ ...prev, transactions: 'Expected failure without auth: ' + error.message }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, transactions: 'Error: ' + error.message }));
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>

      <div className="space-y-4">
        <button
          onClick={testApiConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Backend Connection
        </button>

        <button
          onClick={testTransactionsEndpoint}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2"
        >
          Test Transactions Endpoint
        </button>

        {Object.entries(testResults).map(([key, value]) => (
          <div key={key} className="p-3 bg-gray-100 rounded">
            <strong>{key}:</strong> {value as string}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestApiPage;