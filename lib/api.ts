import { TransactionHistory } from '../types/transaction';

// Base API URL - will be different in development vs production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create a base API client
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Get authorization header with token
  private getAuthHeaders(): HeadersInit {
    // Get token from the auth system (using the same key as AuthProvider)
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method (with authentication headers)
  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Clear token if unauthorized
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
          // Don't redirect here since this is a shared API client
          // Let the caller handle the redirect if needed
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Public request method (without authentication headers) - for registration/login endpoints
  public async publicRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      // Add timeout to fetch request to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Public API request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach the server. Please make sure the backend server is running on http://localhost:8000');
      }
      throw error;
    }
  }

  // Register a new user
  async register(userData: any) {
    // Try different common endpoint patterns for registration
    const endpoints = ['/api/v1/auth/signup', '/api/v1/auth/register', '/api/v1/users/'];

    for (const endpoint of endpoints) {
      try {
        return await this.publicRequest(endpoint, {
          method: 'POST',
          body: JSON.stringify(userData),
        });
      } catch (error) {
        console.debug(`Registration failed on ${endpoint}:`, error);
        // If this is the last endpoint in the array, re-throw the error
        if (endpoint === endpoints[endpoints.length - 1]) {
          throw error;
        }
      }
    }
  }

  // Authentication methods
  async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      // Add timeout to fetch request to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // For login, we need to send form data, not JSON
      const response = await fetch(`${this.baseUrl}/api/v1/token`, {
        method: 'POST',
        body: formData,
        signal: controller.signal, // Add signal for timeout cancellation
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Login failed: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();

      // Store the token in localStorage using the same key as AuthProvider
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', result.access_token);
      }

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Login request timed out: Server took too long to respond');
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach the server. Please make sure the backend server is running on http://localhost:8000');
      }
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    return this.request('/api/v1/users/me');
  }

  // Get user's accounts
  async getAccounts() {
    return this.request('/api/v1/accounts/');
  }

  // Get user's transactions
  async getTransactions() {
    return this.request('/api/v1/transactions/');
  }

  // Get transaction history with current balance
  async getTransactionHistory(): Promise<TransactionHistory> {
    try {
      // Use the new transaction history endpoint that returns everything in one call
      const response = await this.request('/api/v1/transaction-history/');

      // Transform the response to match the expected frontend format
      const transformedTransactions = response.transactions.map((t: any) => ({
        id: t.id,
        type: t.transaction_type,
        amount: t.amount,
        date: t.date, // Already formatted in the backend
        description: t.description,
      }));

      return {
        currentBalance: response.current_balance,
        transactions: transformedTransactions,
      };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  // Create transaction
  async createTransaction(transactionData: any) {
    return this.request('/api/v1/transactions/', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  // Create account
  async createAccount(accountData: any) {
    return this.request('/api/v1/accounts/', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  // Get loans
  async getLoans() {
    return this.request('/api/v1/loans/');
  }

  // Create loan
  async createLoan(loanData: any) {
    return this.request('/api/v1/loans/', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  }

  // Get beneficiaries
  async getBeneficiaries() {
    return this.request('/api/v1/beneficiaries/');
  }

  // Create beneficiary
  async createBeneficiary(beneficiaryData: any) {
    return this.request('/api/v1/beneficiaries/', {
      method: 'POST',
      body: JSON.stringify(beneficiaryData),
    });
  }

  // Get mobile top-ups
  async getMobileTopUps() {
    return this.request('/api/v1/mobile-topups/');
  }

  // Create mobile top-up
  async createMobileTopUp(topUpData: any) {
    return this.request('/api/v1/mobile-topups/', {
      method: 'POST',
      body: JSON.stringify(topUpData),
    });
  }

  // Get bills
  async getBills() {
    return this.request('/api/v1/bills/');
  }

  // Create bill
  async createBill(billData: any) {
    return this.request('/api/v1/bills/', {
      method: 'POST',
      body: JSON.stringify(billData),
    });
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export the class as well if needed
export default ApiClient;