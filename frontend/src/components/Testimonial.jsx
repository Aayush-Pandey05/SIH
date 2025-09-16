import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSection = ({ testimonials, currentTestimonial, setCurrentTestimonial }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }
      });
    }, 5000); 

    return () => clearInterval(timer);
  }, [testimonials.length, setCurrentTestimonial]);

  useEffect(() => {
    gsap.fromTo(contentRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [currentTestimonial]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonial-heading, .testimonial-card", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 testimonial-heading">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-200 mb-4">
            “Leadership for a Water-Secure Future"
          </h2>
        </div>
        
        <div className="relative testimonial-card">
          <div className="bg-gray-900/50 rounded-3xl p-8 md:p-12 shadow-lg border border-cyan-500/10 hover:shadow-2xl hover:shadow-cyan-400/10 transition-shadow duration-500 transform hover:scale-105">
            <div ref={contentRef} className="min-h-[14rem] sm:min-h-[12rem] flex flex-col justify-center">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">"{testimonials[currentTestimonial].text}"</p>
              <p className="text-gray-500 font-medium">— {testimonials[currentTestimonial].author}</p>
            </div>
          </div>
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentTestimonial(index)} 
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentTestimonial ? 'bg-cyan-400' : 'bg-gray-600'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

