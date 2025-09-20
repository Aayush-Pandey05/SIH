import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import HeaderAL from "../components/HeaderAL";

import assets from "../assets/assets";

gsap.registerPlugin(ScrollTrigger);
const SupportPage = () => {
  const mainRef = useRef(null);
  
  useGSAP(() => {
    const tl = gsap.timeline({ 
        defaults: { ease: "power3.out", duration: 0.8 },
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top 80%",
        },
      });

      tl.from(".support-hero > *", { opacity: 0, y: 40, stagger: 0.2 })
        .from(".faq-section", { opacity: 0, y: 30 }, "-=0.5")
        .from(".contact-section", { opacity: 0, y: 30 }, "-=0.5");
    },
    { scope: mainRef }
  );

  return (
    <div>
      <HeaderAL />
      <div ref={mainRef} className="bg-gradient-to-b from-slate-900 via-blue-950 to-black text-white min-h-screen font-[font6]" >
        <div id="hero" className="relative h-[50vh] sm:h-[65vh] flex items-center justify-center text-center px-4 support-hero">
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${assets.Support})` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black/70"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-cyan-500">
              Support Center
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto mt-4">
              Your questions, answered. Find the help you need to get started.
            </p>
          </div>
        </div>

        <div className="container mx-auto py-16 sm:py-20 px-4">
          <div className="faq-section">
            <FAQSection />
          </div>
          <div className="contact-section mt-16 sm:mt-20">
            <ContactSection />
          </div>
        </div>
      </div>

    </div>
  );
};

export default SupportPage;
