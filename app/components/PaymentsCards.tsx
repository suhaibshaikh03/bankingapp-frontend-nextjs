'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const PaymentsCards = () => {
  const descriptionText = 'There is a variety of payment options which can be tailored to your needs, including: Bill Payments, Mobile Top-ups, Utility Payments.';

  // Refs for animations
  const billPaymentRef = useRef(null);
  const topUpsRef = useRef(null);

  const billPaymentInView = useInView(billPaymentRef, { once: false, margin: '-100px' });
  const topUpsInView = useInView(topUpsRef, { once: false, margin: '-100px' });

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col w-full overflow-hidden">
        {/* First Card - Bill Payment (coming from right) */}
        <div
          ref={billPaymentRef}
          className="w-full bg-[#87CEEB] flex items-center justify-center p-4 text-center min-h-[300px]"
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={billPaymentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center w-full max-w-4xl space-y-4"
          >
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-2">
              Bill Payment
            </h2>
            <p className="text-white text-xs md:text-sm leading-relaxed mb-4 max-w-2xl">
              {descriptionText}
            </p>
            <Link href="/payments/bill-payment" className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105">
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Second Card - Top-ups (coming from left) */}
        <div
          ref={topUpsRef}
          className="w-full bg-[#00BFFF] flex items-center justify-center p-4 text-center min-h-[300px]"
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={topUpsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center w-full max-w-4xl space-y-4"
          >
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-2">
              Top-ups
            </h2>
            <p className="text-white text-xs md:text-sm leading-relaxed mb-4 max-w-2xl">
              Recharge your mobile, data, and other services quickly and securely. Our top-up service supports all major operators and provides instant confirmation for your transactions.
            </p>
            <Link href="/payments/top-ups" className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105">
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsCards;