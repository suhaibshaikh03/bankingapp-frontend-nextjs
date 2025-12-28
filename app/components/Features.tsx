// app/components/Features.tsx
import React from 'react';
import Link from 'next/link';

const Features: React.FC = () => {
  const descriptionText = 'There is a variety of saving plans which can be tailored to your needs, including: Tax Exempt Savings Regular Savings.';

  type FeatureCard = {
    title: string;
    bgColor: string;
    route: string;
  };

  const featureCards: FeatureCard[] = [
    {
      title: 'Loan Scheme',
      bgColor: 'bg-[#87CEFA]', // Light Sky Blue
      route: '/banking/loan',
    },
    {
      title: 'Deposit Scheme',
      bgColor: 'bg-[#87CEEB]', // Lighter Blue
      route: '/banking/deposit',
    },
    {
      title: 'Payment Bill',
      bgColor: 'bg-[#00BFFF]', // Deep Sky Blue
      route: '/payments/bill-payment',
    },
  ];

  return (
    <section className="w-full flex flex-col">
      <div className="flex flex-col md:flex-row w-full overflow-hidden">
        {featureCards.map((card, index) => (
          <div
            key={index}
            className={`flex-1 ${card.bgColor} flex items-center justify-center p-4 text-center min-h-[300px] md:min-h-[500px] min-w-0`}
          >
            <div className="flex flex-col items-center justify-center w-full max-w-xs space-y-4">
              <h2 className="text-white text-2xl md:text-4xl font-semibold mb-2 md:mb-4">
                {card.title}
              </h2>
              <p className="text-white text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                {descriptionText}
              </p>
              <Link href={card.route} className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105">
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
