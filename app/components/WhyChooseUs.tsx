
import React from 'react';
import { FaShieldAlt, FaHeadset, FaBell, FaFingerprint } from 'react-icons/fa';

const WhyChooseUs: React.FC = () => {
  const securityFeatures = [
    {
      icon: <FaShieldAlt className="text-4xl text-blue-500" />,
      title: '256-bit Encryption',
      description: 'Your data is protected with the highest level of encryption.',
    },
    {
      icon: <FaHeadset className="text-4xl text-blue-500" />,
      title: '24/7 Fraud Monitoring',
      description: 'We constantly monitor for suspicious activity to keep your account safe.',
    },
    {
      icon: <FaBell className="text-4xl text-blue-500" />,
      title: 'Instant Notifications',
      description: 'Get immediate alerts for all your transactions and account activity.',
    },
    {
      icon: <FaFingerprint className="text-4xl text-blue-500" />,
      title: 'Biometric Security',
      description: 'Secure your account with your fingerprint or face.',
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us / Security Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-md">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
