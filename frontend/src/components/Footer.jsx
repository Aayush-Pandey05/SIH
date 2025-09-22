import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import assets from "../assets/assets";

const Footer = () => {
  const { t } = useTranslation();
  const footerRef = useRef(null);
  const titleRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 0.1, y: 0, duration: 1.5, ease: "power3.out" }
      );
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
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-b from-slate-800 to-black text-white overflow-hidden py-16 md:py-6"
    >
      <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none z-0">
        <span
          ref={titleRef}
          className="font-extrabold text-white/10 text-7xl sm:text-9xl md:text-[10rem] lg:text-[14rem] leading-none select-none"
        >
          {t('footer.brandName')}
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 sm:gap-28">
          <div ref={(el) => (linksRef.current[0] = el)}>
            <div className="flex gap-3">
              <img
                src={assets.logo}
                alt={t('footer.logoAlt')}
                className="h-10 w-10 rounded-full"
              />
              <h2 className="text-xl font-bold mb-2">{t('footer.brandName')}</h2>
            </div>
            <p className="text-sm text-white/70 mt-1">{t('footer.tagline1')}</p>
            <p className="text-sm text-white/70 mt-1">{t('footer.tagline2')}</p>
          </div>

          <div ref={(el) => (linksRef.current[1] = el)}>
            <h3 className="text-base font-semibold mb-3 text-teal-400">
              {t('footer.quickLinks.title')}
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link
                  to="/"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth"})}
                  className="hover:text-cyan-900 transition-all duration-300 "
                >
                  {t('footer.quickLinks.home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth"})}
                  className=" hover:text-cyan-900 transition-all duration-200"
                >
                  {t('footer.quickLinks.about')}
                </Link>
              </li>
            </ul>
          </div>

          <div ref={(el) => (linksRef.current[2] = el)}>
            <h3 className="text-base font-semibold mb-3 text-teal-400">
              {t('footer.policies.title')}
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a
                  href="https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1914351" target='_blank' 
                  className="hover:text-cyan-900 transition-all duration-300 "
                >
                  {t('footer.policies.resources')}
                </a>
              </li>
              <li>
                <a
                  href="https://www.researchgate.net/publication/357226990_A_Review_of_Indian_Traditional_Method_of_Rain_Water_Harvesting" target='_blank' 
                  className="hover:text-cyan-900 transition-all duration-300 "
                >
                  {t('footer.policies.articles')}
                </a>
              </li>
            </ul>
          </div>

          <div ref={(el) => (linksRef.current[3] = el)}>
            <h3 className="text-base font-semibold mb-3 text-teal-400">
              {t('footer.support.title')}
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link
                  to="/contactus"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth"})}
                  className="hover:text-cyan-900 transition-all duration-300 "
                >
                  {t('footer.support.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-28"></div>
        <div className=" text-center text-sm text-white/70 mt-4">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;