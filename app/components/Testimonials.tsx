
import React from 'react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "S2Pay made my international transfers so much cheaper!",
      author: 'Satisfied Customer',
    },
    {
      quote: "The virtual cards are a game-changer for online shopping.",
      author: 'Happy User',
    },
    {
      quote: "I love the instant notifications. I always know what's happening with my money.",
      author: 'Secure Customer',
    },
  ];

  return (
    <section className="bg-gray-200 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <p className="text-right font-semibold text-blue-500">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
