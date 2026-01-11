import Link from 'next/link';
import React from 'react';

interface TransactionButtonProps {
  text: string;
  href: string;
  className?: string;
}

const TransactionButton: React.FC<TransactionButtonProps> = ({ text, href, className = '' }) => {
  return (
    <Link href={href} className={`inline-block ${className}`}>
      {text}
    </Link>
  );
};

export default TransactionButton;