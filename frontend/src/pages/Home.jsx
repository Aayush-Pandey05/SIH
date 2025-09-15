// App.js - Main Component
import React, { useState, useEffect, useRef } from 'react';

// Import all components
import Header from '../components/Header';
import FullScreenMenu from '../components/FullScreen';
import HeroSection from '../components/Hero';
import ValuePropsSection from '../components/ValueProps';
import WelcomeSection from '../components/Welcome';
import BenefitsSection from '../components/Benefits';
import HowItWorksSection from '../components/HowItWorks';
import TestimonialsSection from '../components/Testimonial';
import CtaSection from '../components/Cta';
import Feature from '../components/Feature'
import Footer from '../components/Footer'
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const observerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(prev).add(entry.target.dataset.animate));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach((el) => observerRef.current.observe(el));

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const benefits = [
    "Reduce Water Bills", "Recharge Groundwater", "Sustainable Water Source", "Decrease Urban Flooding", "Support Local Ecosystems",
    "Easy ROI Calculation", "Promote Water Conservation", "Drought Mitigation", "Community Resilience", "Eco-Friendly Solution"
  ];

  const testimonials = [
    { text: "Using JalSetu was a game-changer for our apartment complex. The GIS tool was incredibly accurate, and the AI recommendations helped us choose the perfect recharge pit. Our water bills have dropped by 30%!", author: "R. Sharma, Housing Society President" },
    { text: "I was skeptical about WebAR, but seeing the 3D model of the rainwater tank in my own backyard was amazing. It removed all the guesswork. The whole process, from mapping to planning, was seamless.", author: "Anjali P., Homeowner" },
    { text: "As an urban planner, JalSetu provides invaluable data. The ability to forecast rainwater harvesting potential across different zones helps us create more sustainable city plans. It's a powerful tool for policy-making.", author: "Dr. K. Menon, Urban Planner" },
    { text: "The platform's focus on ROI and providing clear, actionable steps made it easy to convince our local community to invest in rainwater harvesting. We're now better prepared for the dry season.", author: "S. Gupta, Community Leader" }
  ];

  const stepVisuals = [
    "https://images.unsplash.com/photo-1534349762237-7227568a3556?q=80&w=800&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559336197-ded8aaa24de3?q=80&w=800&h=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620912189839-12a83ab5b3d6?q=80&w=800&h=600&auto=format&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-blue-50 text-white overflow-hidden relative font-sans">
      <div 
        className="fixed w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-500 ease-out"
        style={{ left: mousePosition.x - 192, top: mousePosition.y - 192 }}
      />
      
      <Header scrolled={scrolled} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <FullScreenMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main>
        <HeroSection visibleElements={visibleElements} />
        {<Feature/> }
        <ValuePropsSection visibleElements={visibleElements} />
        
        
        
        <WelcomeSection visibleElements={visibleElements} />
        <BenefitsSection visibleElements={visibleElements} benefits={benefits} />
        
        {/* <HowItWorksSection visibleElements={visibleElements} stepVisuals={stepVisuals} /> */}
        {/* <TestimonialsSection 
          visibleElements={visibleElements} 
          testimonials={testimonials} 
          currentTestimonial={currentTestimonial}
          setCurrentTestimonial={setCurrentTestimonial}
        /> */}
        {/* <CtaSection visibleElements={visibleElements} /> */}
        <Footer/>
      </main>
    </div>
  );
};

export default Home;