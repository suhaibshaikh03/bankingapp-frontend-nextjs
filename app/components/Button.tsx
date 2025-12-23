import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  href?: string; // For navigation links
  asLink?: boolean; // To indicate if this should render as a Link component
  external?: boolean; // For external links
}

const Button: React.FC<ButtonProps> = ({
  children,
  text,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  href,
  asLink = false,
  external = false
}) => {
  const baseClasses = `px-3 py-2 rounded-md transition-colors duration-200 ${className}`;

  if (asLink && href) {
    if (external) {
      return (
        <a
          href={href}
          className={baseClasses}
          onClick={onClick}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text || children}
        </a>
      );
    } else {
      return (
        <Link href={href} className={baseClasses} onClick={onClick}>
          {text || children}
        </Link>
      );
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {text || children}
    </button>
  );
};

export default Button;