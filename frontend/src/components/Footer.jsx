import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const Footer = () => {
  const footerRef = useRef(null);
  const titleRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background text animation (JalSetu watermark)
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 0.1, y: 0, duration: 1.5, ease: "power3.out" }
      );

      // Fade + stagger for links
      gsap.fromTo(
        linksRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.5,
        }
      );

      // Footer fade-in
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
      );
    }, footerRef);

    return () => ctx.revert(); // cleanup on unmount
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative h-[50vh] bg-gradient-to-b from-slate-800 to-black text-white overflow-hidden py-18 md:py-12"
    >
      {/* Watermark background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span
          ref={titleRef}
          className="font-extrabold text-white/50 text-7xl sm:text-9xl md:text-[10rem] lg:text-[14rem] leading-none select-none"
        >
          JalSetu
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div ref={(el) => (linksRef.current[0] = el)}>
            <h2 className="text-lg font-bold mb-2">JalSetu</h2>
            <p className="text-sm text-white/80">Every Drop Counts.</p>
            <p className="text-sm text-white/80 mt-1">Every Citizen Matters.</p>
          </div>

          <div ref={(el) => (linksRef.current[1] = el)}>
            <h3 className="text-base font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link
                  to="/home"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:underline hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div ref={(el) => (linksRef.current[2] = el)}>
            <h3 className="text-base font-semibold mb-3">Govt. Policies</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link
                  to="/resources"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Resources & Policies
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Knowledge Articles
                </Link>
              </li>
            </ul>
          </div>

          <div ref={(el) => (linksRef.current[3] = el)}>
            <h3 className="text-base font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link
                  to="/feedback"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Provide Feedback
                </Link>
              </li>
              <li>
                <Link
                  to="/contactus"
                  className="hover:underline hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mt-30 pt-6"></div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/70">
          <div>© {new Date().getFullYear()} JalSetu. All Rights Reserved.</div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
            <Link to="/disclaimer" className="hover:underline">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
