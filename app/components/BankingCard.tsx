'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface BankingCardProps {
  title: string;
  color: string;
  direction: 'left' | 'right';
  className?: string;
}

const BankingCard: React.FC<BankingCardProps> = ({ title, color, direction, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const directionOffset = direction === 'left' ? -100 : 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: directionOffset }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: directionOffset }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`${className} bg-gradient-to-r ${color} text-white py-16 cursor-pointer min-w-[200px]`}
    >
      <h2 className="text-3xl font-bold text-center">{title}</h2>
    </motion.div>
  );
};

export default BankingCard;