import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Droplet } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        ".drop",
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "bounce.out",
        }
      );

      
      gsap.to(".drop", {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
        delay: 1.2 
      });
      
      
      tl.fromTo(
        ".hero-text", 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2, 
        },
        "-=0.6" 
      );

    }, heroRef); 

    
    return () => ctx.revert();
  }, []);

  return (
    
    <section 
      ref={heroRef} 
      className="text-center px-4 sm:px-8 lg:px-16 bg-white flex flex-col items-center mt-32"
    >
      
      
      <div className="flex justify-center w-full mb-6">
        <div
          className="drop flex items-center justify-center mb-4 sm:mb-6 bg-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shadow-md"
        >
          <Droplet className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-500" fill="currentColor" />
        </div>
      </div>
      <h1 className="hero-text text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black">
        Welcome to <span className="text-blue-600">JalSetu </span>
      </h1>
      <p className="hero-text text-base sm:text-lg md:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto mb-8 px-2 sm:px-0">
        JalSetu is your comprehensive solution for planning, optimizing, and adopting Rainwater Harvesting (RWH). 
        We combine GIS mapping, AI/ML, smart alerts, government integration, and WebAR visualization to make RWH 
        accessible and efficient for every Indian citizen.
      </p>

      <Link to="/map-roof" className="hero-text">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg shadow-lg font-medium transition text-sm sm:text-base md:text-lg"
        >
          Map Your Roof to Get Started →
        </button>
      </Link>
    </section>
  );
};

export default HeroSection;