'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface StaggeredCardGridProps {
  children: React.ReactNode[];
  className?: string;
}

const StaggeredCardGrid: React.FC<StaggeredCardGridProps> = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <div ref={ref} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}>
      {children.map((child, index) => {
        // Determine animation direction based on index
        const isLeft = index < 2; // First two cards come from left

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -100 : 100 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
};

export default StaggeredCardGrid;