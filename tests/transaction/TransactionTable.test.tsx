import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionTable from '../../src/components/TransactionHistory/TransactionTable';
import { TransactionHistory } from '../../src/types/transaction';

// Mock data for testing
const mockTransactionHistory: TransactionHistory = {
  currentBalance: 1000.5,
  transactions: [
    { id: 1, type: 'credit', amount: 200.0, date: '2026-01-01', description: 'Test credit' },
    { id: 2, type: 'debit', amount: 50.5, date: '2026-01-02', description: 'Test debit' },
  ]
};

describe('TransactionTable', () => {
  it('renders current balance correctly', () => {
    render(<TransactionTable history={mockTransactionHistory} />);

    expect(screen.getByText(/Current Balance: \$1000.5/i)).toBeInTheDocument();
  });

  it('renders transaction table with correct headers', () => {
    render(<TransactionTable history={mockTransactionHistory} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('displays transaction data correctly', () => {
    render(<TransactionTable history={mockTransactionHistory} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Credit')).toBeInTheDocument();
    expect(screen.getByText('+200.0')).toBeInTheDocument();
    expect(screen.getByText('Test credit')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Debit')).toBeInTheDocument();
    expect(screen.getByText('-50.5')).toBeInTheDocument();
    expect(screen.getByText('Test debit')).toBeInTheDocument();
  });

  it('applies correct CSS classes for debit and credit types', () => {
    render(<TransactionTable history={mockTransactionHistory} />);

    // Check that debit is red and credit is green
    const debitElement = screen.getByText('Debit');
    const creditElement = screen.getByText('Credit');

    expect(creditElement).toHaveClass('text-green-600');
    expect(debitElement).toHaveClass('text-red-600');
  });
});