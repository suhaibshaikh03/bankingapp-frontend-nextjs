// app/components/Features.tsx
import React from 'react';

const Features: React.FC = () => {
  const descriptionText = 'There is a variety of saving plans which can be tailored to your needs, including: Tax Exempt Savings Regular Savings.';

  const featureCards = [
    {
      title: 'Loan Scheme',
      bgColor: 'bg-[#87CEFA]', // Light Sky Blue
    },
    {
      title: 'Deposit Scheme',
      bgColor: 'bg-[#87CEEB]', // Lighter Blue
    },
    {
      title: 'Payment Bill',
      bgColor: 'bg-[#00BFFF]', // Deep Sky Blue
    },
  ];

  return (
    <section className="w-full flex flex-col">
      <div className="flex flex-col md:flex-row w-full min-h-[500px] max-h-[600px]">
        {featureCards.map((card, index) => (
          <div
            key={index}
            className={`flex-1 ${card.bgColor} flex items-center justify-center p-4 text-center`}
            style={{ height: '500px' }} // Fixed height as per requirement
          >
            <div className="flex flex-col items-center justify-center h-full max-w-xs space-y-4">
              <h2 className="text-white text-4xl font-semibold mb-4">
                {card.title}
              </h2>
              <p className="text-white text-sm leading-relaxed mb-6">
                {descriptionText}
              </p>
              <button className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300">
                Learn more..
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
