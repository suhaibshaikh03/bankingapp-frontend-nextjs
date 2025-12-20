
import React from 'react';

const LiveStatistics: React.FC = () => {
  const stats = [
    { value: '10k+', label: 'Active Users' },
    { value: '$5M+', label: 'Processed Daily' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50+', label: 'Supported Countries' },
  ];

  return (
    <section className="bg-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-6">
              <h3 className="text-4xl font-bold text-blue-500 mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStatistics;
