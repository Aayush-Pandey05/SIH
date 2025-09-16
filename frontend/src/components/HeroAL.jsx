// components/HeroSection.js
import React, { useEffect, useRef } from "react";
import { MainWaterDropIcon, ArrowRightIcon } from "./IconAL";
import { gsap } from "gsap";
import {assets} from '../assets/assets'
const HeroSectionAL = ({ visibleElements }) => {
  const logoRef = useRef(null);

  useEffect(() => {
    if (visibleElements.has("hero")) {
      // Drop-in animation
      gsap.fromTo(
        logoRef.current,
        { y: -100, opacity: 0, scale: 0.5 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "bounce.out",
        }
      );

      // Continuous pulse
      gsap.to(logoRef.current, {
        scale: 0.8,
        repeat: 2,
        yoyo: true,
        duration: 2.5,
        ease: "power1.inOut",
      });
    }
  }, [visibleElements]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/VideoAL2.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>

     
      <div className="absolute  inset-0 bg-black/50 z-10"></div>

      {/* Hero Content */}
      <section
        className="relative mt-10 ml-15 z-20 flex items-center justify-center h-full px-4 sm:px-6 lg:px-12"
        data-animate="hero"
      >
        <div
          className={`w-full max-w-3xl mx-auto flex flex-col items-center text-center transition-all duration-1000 ${
            visibleElements.has("hero")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          } bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10`}
        >
          
          <div
  ref={logoRef}
  className="p-1 sm:p-3  rounded-full mb-6 border flex items-center justify-center"
>
  <img
    className="w-25 h-25 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover"
    src={assets.logo}
    alt="JalSetu Logo"
  />
</div>


          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black drop-shadow-lg">
            Welcome to <span className="text-blue-950">JalSetu</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-white font-medium leading-relaxed mb-6 sm:mb-8 px-2">
            JalSetu is your comprehensive solution for planning, optimizing, and adopting Rainwater
            Harvesting (RWH). We combine GIS mapping, AI/ML, smart alerts, government integration,
            and WebAR visualization to make RWH accessible and efficient for every Indian citizen.
          </p>

          {/* CTA Button */}
          <a href="/map-roof">
          <button className="group flex items-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 bg-cyan-500 hover:bg-blue-950 text-white text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:scale-105 transition-all">
            <span>Map Your Roof to Get Started</span>
            <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button></a>
        </div>
      </section>
    </div>
  );
};

export default HeroSectionAL;
