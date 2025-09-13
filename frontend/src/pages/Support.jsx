import React, { useEffect, useRef, useState } from "react";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import NavbarAL from "../components/NavbarAL";

const Support = () => {
  const container = useRef();
  const [isGsapReady, setIsGsapReady] = useState(false);

  // Load GSAP dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => setIsGsapReady(true);
    document.head.appendChild(script);

    return () => {
      const scriptInDom = document.querySelector(`script[src="${script.src}"]`);
      if (scriptInDom) {
        document.head.removeChild(scriptInDom);
      }
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (isGsapReady && container.current) {
      const gsap = window.gsap;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
        tl.from(".support-header > *", {
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 0.6,
        })
          .from(".search-bar", 
            { opacity: 0,
              y: 20, 
              duration: 0.5 }, 
              "-=0.3")
          .from(".faq-section-title", 
            { opacity: 0, 
              y: 20, 
              duration: 0.5 })
          .from(".faq-item", {
            opacity: 0,
            y: 20,
            duration: 0.4,
            stagger: 0.1,
          })
          .from(".contact-section-title > *", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
          })
          .from(".contact-card", {
            opacity: 0,
            scale: 0.95,
            y: 20,
            duration: 0.4,
            stagger: 0.15,
          });
      }, container);

      return () => ctx.revert();
    }
  }, [isGsapReady]);

  return (
    <div className="bg-white font-sans mt-[3vw]">
       <NavbarAL />
      <main ref={container} className="container mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 support-header">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Support
          </h1>
          <p className="text-md md:text-lg text-gray-600 mt-2">
            How can we help you today?
          </p>
        </div>

        
        <FAQSection />

        
        <ContactSection />
      </main>

     
    </div>
  );
};

export default Support;
