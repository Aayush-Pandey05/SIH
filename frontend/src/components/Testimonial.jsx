// components/TestimonialsSection.js
import React from 'react';

const TestimonialsSection = ({ visibleElements, testimonials, currentTestimonial, setCurrentTestimonial }) => (
  <section className="py-20 px-6 bg-gray-800" data-animate="testimonials">
    <div className="max-w-4xl mx-auto">
      <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
        visibleElements.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Real Stories from<br /><span className="text-gray-400">Our Community</span></h2>
      </div>
      <div className="relative">
        <div className={`bg-gray-900/50 rounded-3xl p-12 shadow-lg border border-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-500 transform hover:scale-105 ${
          visibleElements.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">"{testimonials[currentTestimonial].text}"</div>
          <div className="text-gray-500 font-medium">— {testimonials[currentTestimonial].author}</div>
        </div>
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button key={index} onClick={() => setCurrentTestimonial(index)} className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentTestimonial ? 'bg-cyan-400' : 'bg-gray-600'
              }`} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;