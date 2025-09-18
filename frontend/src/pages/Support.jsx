import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import HeaderAL from "../components/HeaderAL";
import FullScreenMenuAL from "../components/FullScreenMenuAL";
import Footer from "../components/Footer";
import assets from "../assets/assets";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  "Home",
  "Dashboard",
  "Map Roof",
  "Government Schemes",
  "Support",
];
const navRoutes = ["/", "/dashboard", "/map-roof", "/govschemes", "/support"];

const SupportPage = () => {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };

    updateTime();
    const timerId = setInterval(updateTime, 60000);

    return () => clearInterval(timerId);
  }, []);

  useGSAP(
    () => {
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
      <HeaderAL
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        time={time}
      />
      <FullScreenMenuAL
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        navLinks={navLinks}
        navRoutes={navRoutes}
      />

      <div ref={mainRef} className="bg-slate-900 text-white min-h-screen">
        <div className="relative h-[50vh] sm:h-[65vh] flex items-center justify-center text-center px-4 support-hero">
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${assets.Support})` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black/70"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-cyan-600">
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

      <Footer />
    </div>
  );
};

export default SupportPage;
