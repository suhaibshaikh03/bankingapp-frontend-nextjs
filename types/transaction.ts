export interface Transaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
  balance_after?: number;
}

export interface TransactionHistory {
  currentBalance: number;
  transactions: Transaction[];
}