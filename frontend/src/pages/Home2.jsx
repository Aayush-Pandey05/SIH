import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import HeaderAL from "../components/HeaderAL";
import HeroSectionAL from "../components/HeroAL";
import FeaturesSectionAL from "../components/FeatureAL";
import HowItWorksSection from '../components/HowItWorks';
import TestimonialsSection from '../components/Testimonial';
import {
  GisMapIcon,
  AiMlIcon,
  SmartAlertsIcon,
  GovtIntegrationIcon,
  CommunityImpactIcon,
} from "../components/IconAL";
import assets from "../assets/assets";

const Home2 = () => {
  const { t } = useTranslation();
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); 
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const observerRef = useRef();

  const features = [
    {
      icon: <GisMapIcon />,
      title: t('homePage.features.item1.title'),
      description: t('homePage.features.item1.description'),
    },
    {
      icon: <AiMlIcon />,
      title: t('homePage.features.item2.title'),
      description: t('homePage.features.item2.description'),
    },
    {
      icon: <SmartAlertsIcon />,
      title: t('homePage.features.item3.title'),
      description: t('homePage.features.item3.description'),
    },
    {
      icon: <GovtIntegrationIcon />,
      title: t('homePage.features.item4.title'),
      description: t('homePage.features.item4.description'),
    },
    {
      icon: <CommunityImpactIcon />,
      title: t('homePage.features.item5.title'),
      description: t('homePage.features.item5.description'),
    },
  ];

  const testimonials = [
    { text: t('homePage.testimonials.item1.text'), author: t('homePage.testimonials.item1.author') },
    { text: t('homePage.testimonials.item2.text'), author: t('homePage.testimonials.item2.author') },
    { text: t('homePage.testimonials.item3.text'), author: t('homePage.testimonials.item3.author') },
    { text: t('homePage.testimonials.item4.text'), author: t('homePage.testimonials.item4.author') }
  ];

  const stepVisuals = [
    "https://geoawesome.com/wp-content/uploads/2022/03/London_Google_Maps.webp",
    "https://images.unsplash.com/photo-1610650394144-a778795cf585?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    `${assets.img3}`,
  ];

  useEffect(() => {
    
    const handleMouseMove = (e) =>
      setMousePosition({ x: e.clientX, y: e.clientY });

    // Intersection observer for scroll animations
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
    
  
    window.addEventListener("mousemove", handleMouseMove);

    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return (
    <div className="h-full bg-white text-white relative overflow-hidden">
      
      <div
        className="fixed w-96 h-96 bg-gradient-to-r from-cyan-400/40 to-blue-400/30 rounded-full blur-3xl pointer-events-none z-0 transition-all"
        style={{ left: mousePosition.x - 192, top: mousePosition.y - 192 }}
      />
      
      <HeaderAL />

      <main className="relative z-10">
        <HeroSectionAL visibleElements={visibleElements} />
        <FeaturesSectionAL visibleElements={visibleElements} features={features} />
        <HowItWorksSection visibleElements={visibleElements} stepVisuals={stepVisuals} />
        <TestimonialsSection
          visibleElements={visibleElements}
          testimonials={testimonials}
          currentTestimonial={currentTestimonial}
          setCurrentTestimonial={setCurrentTestimonial}
        />
      </main>
    </div>
  );
};

export default Home2;