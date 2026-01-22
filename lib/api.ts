import { TransactionHistory } from '../types/transaction';

// Base API URL - will be different in development vs production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://suhaibshaikh03-baningapp-backend.hf.space/';

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

      const response = await fetch(url, {
        ...config,
        signal: controller.signal, // Add signal for timeout cancellation
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Public API request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach the server. Please make sure the backend server is running on https://suhaibshaikh03-baningapp-backend.hf.space/');
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out: Server took too long to respond');
      }
      throw error;
    }
  }

  // Register a new user
  async register(userData: any) {
    // Use the correct endpoint for user creation
    return await this.publicRequest('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
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
      const response = await fetch(`${this.baseUrl}/token`, {
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
        throw new Error('Network error: Unable to reach the server. Please make sure the backend server is running on https://suhaibshaikh03-baningapp-backend.hf.space/');
      }
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    return this.request('/users/me');
  }

  // Get user's accounts
  async getAccounts() {
    return this.request('/accounts/');
  }

  // Get user's transactions
  async getTransactions() {
    return this.request('/transactions/');
  }

  // Get transaction history with current balance
  async getTransactionHistory(): Promise<TransactionHistory> {
    try {
      // Use the new transaction history endpoint that returns everything in one call
      const response = await this.request('/banking/history/');

      // Calculate running balance for each transaction
      let runningBalance = response.current_balance;
      // Sort transactions by date descending to calculate backwards
      const sortedTransactions = [...response.transactions].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Calculate the balance before each transaction, then map to include balance_after
      const transactionsWithBalance = sortedTransactions.map((t: any) => {
        const transaction = {
          id: t.id,
          type: t.transaction_type,
          amount: t.amount,
          date: t.date, // Already formatted in the backend
          description: t.description,
          balance_after: runningBalance
        };

        // Adjust running balance for the next transaction
        if (t.transaction_type === 'credit') {
          runningBalance -= t.amount;
        } else if (t.transaction_type === 'debit') {
          runningBalance += t.amount;
        }

        return transaction;
      }).reverse(); // Reverse back to chronological order (oldest first)

      return {
        currentBalance: response.current_balance,
        transactions: transactionsWithBalance,
      };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  // Create transaction
  async createTransaction(transactionData: any) {
    return this.request('/banking/transactions/', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  // Create account
  async createAccount(accountData: any) {
    return this.request('/banking/accounts/', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  // Get loans
  async getLoans() {
    return this.request('/loans/');
  }

  // Create loan
  async createLoan(loanData: any) {
    return this.request('/loans/', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  }

  // Get beneficiaries
  async getBeneficiaries() {
    return this.request('/beneficiaries/');
  }

  // Create beneficiary
  async createBeneficiary(beneficiaryData: any) {
    return this.request('/beneficiaries/', {
      method: 'POST',
      body: JSON.stringify(beneficiaryData),
    });
  }

  // Get mobile top-ups
  async getMobileTopUps() {
    return this.request('/banking/topups/');
  }

  // Create mobile top-up
  async createMobileTopUp(topUpData: any) {
    return this.request('/banking/topups/', {
      method: 'POST',
      body: JSON.stringify(topUpData),
    });
  }

  // Get bills
  async getBills() {
    return this.request('/bills/');
  }

  // Create bill
  async createBill(billData: any) {
    return this.request('/bills/', {
      method: 'POST',
      body: JSON.stringify(billData),
    });
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export the class as well if needed
export default ApiClient;