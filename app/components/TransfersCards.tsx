'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const TransfersCards = () => {
  const descriptionText = 'There is a variety of transfer options which can be tailored to your needs, including: International Transfers, Domestic Transfers, Scheduled Transfers.';

  // Refs for animations
  const transferRef = useRef(null);
  const beneficiaryRef = useRef(null);

  const transferInView = useInView(transferRef, { once: false, margin: '-100px' });
  const beneficiaryInView = useInView(beneficiaryRef, { once: false, margin: '-100px' });

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col w-full overflow-hidden">
        {/* First Card - Transfer (coming from right) */}
        <div
          ref={transferRef}
          className="w-full bg-[#87CEEB] flex items-center justify-center p-4 text-center min-h-[300px]"
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={transferInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center w-full max-w-4xl space-y-4"
          >
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-2">
              Transfer Money
            </h2>
            <p className="text-white text-xs md:text-sm leading-relaxed mb-4 max-w-2xl">
              {descriptionText}
            </p>
            <Link href="/transfers/transfer" className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105">
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Second Card - Beneficiary (coming from left) */}
        <div
          ref={beneficiaryRef}
          className="w-full bg-[#00BFFF] flex items-center justify-center p-4 text-center min-h-[300px]"
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={beneficiaryInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center w-full max-w-4xl space-y-4"
          >
            <h2 className="text-white text-2xl md:text-4xl font-semibold mb-2">
              Beneficiary Management
            </h2>
            <p className="text-white text-xs md:text-sm leading-relaxed mb-4 max-w-2xl">
              Manage your beneficiaries with ease. Add, edit, or remove beneficiaries securely. Our system ensures fast and secure money transfers to your trusted contacts.
            </p>
            <Link href="/transfers/beneficiary" className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105">
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TransfersCards;