import React from 'react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "S2Pay made my international transfers so much cheaper!",
      author: 'John',
    },
    {
      quote: "The virtual cards are a game-changer for online shopping.",
      author: 'James',
    },
    {
      quote: "I love the instant notifications. I always know what's happening with my money.",
      author: 'Laura',
    },
    {
      quote: "The multi-currency wallet is perfect for my travels.",
      author: 'Eric',
    },
    {
      quote: "A very secure and trustworthy platform.",
      author: 'Sarah',
    },
    {
      quote: "Mobile recharges are so quick and easy!",
      author: 'Mike'
    }
  ];

  // Duplicate testimonials for a seamless scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="bg-gray-200 py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Testimonials</h2>
        <div className="scrolling-wrapper">
          <div className="scrolling-content">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card flex-shrink-0 w-80 bg-white p-6 rounded-lg shadow-md mx-4">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <p className="text-right font-semibold text-blue-500">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;