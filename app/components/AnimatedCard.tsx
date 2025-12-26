'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, index, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Determine animation direction based on index (even = left, odd = right)
  const isLeft = index % 2 === 0;
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -100 : 100 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;