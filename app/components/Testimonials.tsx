import React from 'react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "S2Pay made my international transfers so much cheaper!",
      author: 'John',
      role: 'Business Owner',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      quote: "The virtual cards are a game-changer for online shopping.",
      author: 'James',
      role: 'Freelancer',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      quote: "I love the instant notifications. I always know what's happening with my money.",
      author: 'Laura',
      role: 'Traveler',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      quote: "The multi-currency wallet is perfect for my travels.",
      author: 'Eric',
      role: 'Digital Nomad',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    {
      quote: "A very secure and trustworthy platform.",
      author: 'Sarah',
      role: 'Finance Professional',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      quote: "Mobile recharges are so quick and easy!",
      author: 'Mike',
      role: 'Tech Enthusiast',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
    }
  ];

  // Duplicate testimonials for a seamless scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-16 overflow-x-hidden bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">What Our Customers Say</h2>
        <div className="relative overflow-hidden w-full">
          <div className="scrolling-wrapper">
            <div className="scrolling-content flex">
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="testimonial-card flex-shrink-0 w-80 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm transition-all duration-500 hover:shadow-md hover:scale-[1.03] mx-4 relative overflow-hidden group"
                >
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -m-16 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full -m-12 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>

                  {/* Quote icon */}
                  <div className="text-blue-500 text-5xl mb-4 font-serif opacity-70">“</div>

                  <p className="text-gray-600 italic mb-6 relative z-10 text-lg leading-relaxed">"{testimonial.quote}"</p>

                  <div className="flex items-center mt-6 relative z-10">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-800 text-lg">{testimonial.author}</p>
                      <p className="text-sm text-gray-500 font-medium">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Star rating */}
                  <div className="flex mt-4 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;