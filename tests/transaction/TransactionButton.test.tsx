import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TransactionButton from '../../src/components/TransactionHistory/TransactionButton';

describe('TransactionButton', () => {
  it('renders the button with correct text', () => {
    render(
      <BrowserRouter>
        <TransactionButton />
      </BrowserRouter>
    );

    expect(screen.getByText('Transaction History')).toBeInTheDocument();
  });

  it('has correct link destination', () => {
    render(
      <BrowserRouter>
        <TransactionButton />
      </BrowserRouter>
    );

    const button = screen.getByRole('link', { name: /Transaction History/i });
    expect(button).toHaveAttribute('href', '/banking/history');
  });

  it('has correct styling classes', () => {
    render(
      <BrowserRouter>
        <TransactionButton />
      </BrowserRouter>
    );

    const button = screen.getByRole('link', { name: /Transaction History/i });
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
  });
});