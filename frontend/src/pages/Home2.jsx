// pages/JalSetuDashboardLanding.js
import React, { useState, useEffect, useRef } from "react";
import HeaderAL from "../components/HeaderAL";
import FullScreenMenuAL from "../components/FullScreenMenuAL";
import HeroSectionAL from "../components/HeroAL";
import FeaturesSectionAL from "../components/FeatureAL";
import Feature from '../components/Feature';
import HowItWorksSection from '../components/HowItWorks';
import TestimonialsSection from '../components/Testimonial';
import Footer from '../components/Footer'
import {
  GisMapIcon,
  AiMlIcon,
  SmartAlertsIcon,
  GovtIntegrationIcon,
  CommunityImpactIcon,
} from "../components/IconAL";
import assets from "../assets/assets";

const Home2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [time, setTime] = useState("");
  const observerRef = useRef();

  const navLinks = ["Home", "Dashboard", "Map Roof", "Government Schemes", "Support"];
  const navRoutes=["/","/dashboard","/map-roof","/govschemes","/support"];
  const features = [
    { icon: <GisMapIcon />, title: "GIS Mapping", description: "Visualize and analyze your roof's RWH potential." },
    { icon: <AiMlIcon />, title: "AI/ML Powered", description: "Get smart recommendations for optimal RWH system design." },
    { icon: <SmartAlertsIcon />, title: "Smart Alerts", description: "Receive timely notifications for maintenance and rainfall." },
    { icon: <GovtIntegrationIcon />, title: "Govt. Integration", description: "Access subsidies and comply with regulations." },
    { icon: <CommunityImpactIcon />, title: "Community Impact", description: "Track your neighborhood's collective water savings." },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.dataset.animate));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const animatedElements = document.querySelectorAll("[data-animate]");
    animatedElements.forEach((el) => observerRef.current.observe(el));

    const updateTime = () => {
      const options = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true };
      setTime(new Intl.DateTimeFormat([], options).format(new Date()));
    };

    updateTime();
    const timerId = setInterval(updateTime, 60000);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(timerId);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);
  const stepVisuals = [
    "https://geoawesome.com/wp-content/uploads/2022/03/London_Google_Maps.webp",
    "https://images.unsplash.com/photo-1610650394144-a778795cf585?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    `${assets.img3}`
  ];
   const testimonials = [
    { text: "Water is not just a natural resource; it is our lifeline. Each citizen must take responsibility for conserving every drop and adopting measures like rainwater harvesting", author: "Droupadi Murmu ,Current President of India" },
    { text: "Rainwater harvesting should become a compulsory mission for every home and institution in our country.", author: "Dr. A.P.J. Abdul Kalam ,Former President of India" },
    { text: "Water conservation should become a social responsibility and a mass movement. Every drop saved today secures our tomorrow.", author: "Narendra Modi ,Prime Minister of India" },
    { text: "If we conserve rain, we conserve life. Water harvesting is not an option, it is survival.", author: "Rajendra Singh ,Waterman of India, Ramon Magsaysay Awardee" }
  ];

  return (
    <div className="h-full  bg-white text-white relative overflow-hidden">
      {/* Background glow */}
      <div
        className="fixed w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none z-0 transition-all"
        style={{ left: mousePosition.x - 192, top: mousePosition.y - 192 }}
      />

      <HeaderAL isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} time={time} />
      <FullScreenMenuAL isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} navLinks={navLinks} navRoutes={navRoutes} />

      <main className=" relative z-10">
        <HeroSectionAL visibleElements={visibleElements} />
        <Feature/>
        <FeaturesSectionAL visibleElements={visibleElements} features={features} />
        <HowItWorksSection visibleElements={visibleElements} stepVisuals={stepVisuals} /> 
         <TestimonialsSection 
          visibleElements={visibleElements} 
          testimonials={testimonials} 
          currentTestimonial={currentTestimonial}
          setCurrentTestimonial={setCurrentTestimonial}
        />
        <Footer/>

      </main>
    </div>
  );
};

export default Home2;
