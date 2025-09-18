// App.js - Main Component
import React, { useState, useEffect, useRef } from "react";

// Import all components
import Header from '../components/Header';
import FullScreenMenu from '../components/FullScreen';
import HeroSection from '../components/Hero';
import ValuePropsSection from '../components/ValueProps';
import WelcomeSection from '../components/Welcome';
import BenefitsSection from '../components/Benefits';
import Footer from '../components/Footer'
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
            setVisibleElements((prev) =>
              new Set(prev).add(entry.target.dataset.animate)
            );
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const animatedElements = document.querySelectorAll("[data-animate]");
    animatedElements.forEach((el) => observerRef.current.observe(el));

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  ;

  const benefits = [
    "Reduce Water Bills",
    "Recharge Groundwater",
    "Sustainable Water Source",
    "Decrease Urban Flooding",
    "Support Local Ecosystems",
    "Easy ROI Calculation",
    "Promote Water Conservation",
    "Drought Mitigation",
    "Community Resilience",
    "Eco-Friendly Solution",
  ];

  return (
    <div className="min-h-screen bg-blue-50 text-white overflow-hidden relative font-sans">
      {/* Background Glow */}
      <div 
        className="fixed w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-500 ease-out"
        style={{ left: mousePosition.x - 192, top: mousePosition.y - 192 }}
      />

      <Header
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <FullScreenMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main>
        <HeroSection visibleElements={visibleElements} />
        <ValuePropsSection visibleElements={visibleElements} />
        <WelcomeSection visibleElements={visibleElements} />
        <BenefitsSection visibleElements={visibleElements} benefits={benefits} />
        <Footer/>
      </main>
    </div>
  );
};

export default Home;
