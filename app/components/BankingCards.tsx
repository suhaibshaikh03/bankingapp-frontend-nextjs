'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const BankingCards = () => {
  const descriptionText = 'There is a variety of saving plans which can be tailored to your needs, including: Tax Exempt Savings Regular Savings.';

  // Refs for animations
  const depositRef = useRef(null);
  const withdrawRef = useRef(null);
  const loanRef = useRef(null);

  const depositInView = useInView(depositRef, { once: false, margin: '-100px' });
  const withdrawInView = useInView(withdrawRef, { once: false, margin: '-100px' });
  const loanInView = useInView(loanRef, { once: false, margin: '-100px' });

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col w-full overflow-hidden">
        {/* First Card - Deposit (coming from right) */}
        <div
          ref={depositRef}
          className="w-full bg-[#87CEEB] flex items-center justify-center p-4 text-center min-h-[300px]"
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={depositInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center w-full max-w-4xl space-y-4"
          >
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-2">
              Deposit
            </h2>
            <p className="text-white text-xs md:text-sm leading-relaxed mb-4 max-w-2xl">
              {descriptionText}
            </p>
            <Link href="/banking/deposit" className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105">
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Second Card - Withdraw (coming from left) */}
        <div
          ref={withdrawRef}
          className="w-full bg-[#00BFFF] flex items-center justify-center p-4 text-center min-h-[300px]"
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={withdrawInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center w-full max-w-4xl space-y-4"
          >
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-2">
              Withdraw
            </h2>
            <p className="text-white text-xs md:text-sm leading-relaxed mb-4 max-w-2xl">
              Secure and instant withdrawal services with competitive rates and zero hidden fees. Access your funds anytime, anywhere with our 24/7 banking services.
            </p>
            <Link href="/banking/withdraw" className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105">
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Third Card - Loan (coming from right) */}
        <div
          ref={loanRef}
          className="w-full bg-[#87CEFA] flex items-center justify-center p-4 text-center min-h-[300px]"
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={loanInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center w-full max-w-4xl space-y-4"
          >
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-2">
              Loan
            </h2>
            <p className="text-white text-xs md:text-sm leading-relaxed mb-4 max-w-2xl">
              Flexible loan options with competitive interest rates and personalized terms. Whether it's a personal loan, mortgage, or business loan, we have the right solution for you.
            </p>
            <Link href="/banking/loan" className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105">
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BankingCards;