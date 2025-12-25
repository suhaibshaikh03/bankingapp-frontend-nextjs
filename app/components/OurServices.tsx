
import React from 'react';
import { FaMobileAlt, FaUsers, FaCreditCard, FaGlobe } from 'react-icons/fa';

const OurServices: React.FC = () => {
  const services = [
    {
      icon: <FaMobileAlt className="text-4xl text-blue-500" />,
      title: 'Mobile Recharge',
      description: 'Easily top-up your mobile phone from anywhere.',
    },
    {
      icon: <FaUsers className="text-4xl text-blue-500" />,
      title: 'Peer-to-Peer Transfers',
      description: 'Send money to your friends and family instantly.',
    },
    {
      icon: <FaCreditCard className="text-4xl text-blue-500" />,
      title: 'Virtual Cards',
      description: 'Create virtual cards for secure online shopping.',
    },
    {
      icon: <FaGlobe className="text-4xl text-blue-500" />,
      title: 'Multi-currency Wallets',
      description: 'Hold and manage your money in multiple currencies.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services at a Glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
