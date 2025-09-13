import React, { useEffect, useRef } from 'react';
import FeatureCard from './FeatureCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const featuresData = [
  {
    icon: (
      <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3l6-3m0 0l6 3m-6-3v10" />
      </svg>
    ),
    title: 'GIS Mapping',
    description: 'Visualize and analyze your roof’s RWH potential with precision.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 10v4m-2-2h4M5 3a2 2 0 00-2 2v1m14-3a2 2 0 012 2v1m-16 8a2 2 0 002 2h1m14-3a2 2 0 01-2 2h-1M5 3h14M5 17h14" />
      </svg>
    ),
    title: 'AI/ML Powered',
    description: 'Get smart recommendations for optimal RWH system design.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: 'Smart Alerts',
    description: 'Receive timely notifications for maintenance and rainfall.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Govt. Integration',
    description: 'Seamlessly access subsidies and comply with regulations.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.793V21M3 12.793V21M3 12.793l4.52-4.52a2.828 2.828 0 014.001 0L16.207 13M21 12.793l-4.52-4.52a2.828 2.828 0 00-4.001 0L7.793 13m0 0l-4.273 4.273M7.793 13l4.273 4.273M12 3v4m0 0l-2-2m2 2l2-2" />
      </svg>
    ),
    title: 'WebAR',
    description: 'Visualize your RWH system on your own roof in 3D.',
  },
];

const Features = () => {
  
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        opacity: 0,
        y: 50, 
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.2, 
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%", 
          toggleActions: "play none none none",
        },
      });
    }, featuresRef); 
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-white py-20 px-4">
      <div className="container mx-auto" ref={featuresRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {featuresData.map((feature, index) => (
            <div className="feature-card" key={index}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

