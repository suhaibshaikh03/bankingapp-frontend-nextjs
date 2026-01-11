export interface Transaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
}

export interface TransactionHistory {
  currentBalance: number;
  transactions: Transaction[];
}