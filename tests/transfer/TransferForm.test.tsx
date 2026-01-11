import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransferForm from '../../src/components/Transfer/TransferForm';
import { TransferRequest } from '../../src/types/transfer';

// Mock onSubmit function
const mockOnSubmit = jest.fn();

describe('TransferForm', () => {
  const defaultProps = {
    onSubmit: mockOnSubmit,
    currentBalance: 1000.00
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the transfer form with all required fields', () => {
    render(<TransferForm {...defaultProps} />);

    expect(screen.getByLabelText(/Target Account Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount to Transfer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Transfer Funds/i })).toBeInTheDocument();
  });

  it('displays current balance', () => {
    render(<TransferForm {...defaultProps} />);

    expect(screen.getByText(/\$1000\.00/)).toBeInTheDocument();
  });

  it('updates form fields when user types', () => {
    render(<TransferForm {...defaultProps} />);

    const targetAccountInput = screen.getByLabelText(/Target Account Number/i);
    fireEvent.change(targetAccountInput, { target: { value: '123456789' } });

    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const amountInput = screen.getByLabelText(/Amount to Transfer/i);
    fireEvent.change(amountInput, { target: { value: '100.00' } });

    expect(targetAccountInput).toHaveValue('123456789');
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
    expect(amountInput).toHaveValue(100.00);
  });

  it('shows error when amount exceeds balance', async () => {
    render(<TransferForm {...defaultProps} />);

    const targetAccountInput = screen.getByLabelText(/Target Account Number/i);
    fireEvent.change(targetAccountInput, { target: { value: '123456789' } });

    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const amountInput = screen.getByLabelText(/Amount to Transfer/i);
    fireEvent.change(amountInput, { target: { value: '1500.00' } }); // More than balance

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(await screen.findByText(/Transfer amount exceeds available balance/i)).toBeInTheDocument();
  });

  it('calls onSubmit when form is valid', async () => {
    render(<TransferForm {...defaultProps} />);

    const targetAccountInput = screen.getByLabelText(/Target Account Number/i);
    fireEvent.change(targetAccountInput, { target: { value: '123456789' } });

    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const amountInput = screen.getByLabelText(/Amount to Transfer/i);
    fireEvent.change(amountInput, { target: { value: '100.00' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      targetAccountNumber: '123456789',
      username: 'testuser',
      password: 'password123',
      amount: 100.00
    });
  });
});