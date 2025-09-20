
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

import Header from '../components/Header';

import HeroSection from '../components/Hero';
import ValuePropsSection from '../components/ValueProps';
import WelcomeSection from '../components/Welcome';
import BenefitsSection from '../components/Benefits';
import Footer from '../components/Footer'


const Home = () => {
  // isMenuOpen state is no longer needed here
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



  const { t } = useTranslation();
 const translatedBenefits = [
    t('benefits.list.item1'),
    t('benefits.list.item2'),
    t('benefits.list.item3'),
    t('benefits.list.item4'),
    t('benefits.list.item5'),
    t('benefits.list.item6'),
    t('benefits.list.item7'),
    t('benefits.list.item8'),
    t('benefits.list.item9'),
    t('benefits.list.item10'),
  ];
  

  return (
    <div className="min-h-screen bg-blue-50 text-white overflow-hidden relative font-sans">
      {/* Background Glow */}
      <div 
        className="fixed z-0 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none  transition-all duration-500 ease-out"
        style={{ left: mousePosition.x - 192, top: mousePosition.y - 192 }}
      />

      {/* The Header is now simpler and self-contained */}
      <Header scrolled={scrolled} />
      <main>
        <HeroSection visibleElements={visibleElements} />
        <ValuePropsSection visibleElements={visibleElements} />
        <WelcomeSection visibleElements={visibleElements} />
          <BenefitsSection visibleElements={visibleElements} benefits={translatedBenefits} />
        <Footer/>
      </main>
    </div>
  );
};

export default Home;