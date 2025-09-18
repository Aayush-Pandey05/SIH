import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { NavLink, useLocation } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import { MenuIcon, XIcon, ArrowRightIcon } from "./Icons";
import { assets } from "../assets/assets";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Feature", path: "/#feature" },
  { name: "About", path: "/about" },
  { name: "Contact Us", path: "/contactus" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const buttonRef = useRef(null);

  // ✅ Detect hero fully leaving
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // GSAP intro animation
  useEffect(() => {
    const headerEl = headerRef.current;
    const logoEl = logoRef.current;
    const navItems = navRef.current?.children || [];
    const buttonEl = buttonRef.current;

    const tl = gsap.timeline();
    tl.from(headerEl, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      .from([logoEl, buttonEl], {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.3")
      .from(navItems, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.1,
      }, "-=0.3");
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed z-50 top-5 left-4 right-4 p-2 rounded-3xl transition-all duration-700 ${
          isScrolled ? "bg-white shadow-lg" : "bg-black/80"
        }`}
      >
        <div className="px-4 sm:px-6 flex items-center justify-between h-16">
          
          <div
            ref={logoRef}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <img
              src={assets.logo}
              alt="JalSetu Logo"
              className="h-8 w-8 rounded-full"
            />
            <span
              className={`text-2xl font-bold group-hover:text-blue-400 transition-colors duration-700 font-[font17] ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              JalSetu
            </span>
          </div>

          {/* Desktop Nav */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-3 space-x-6"
          >
            {navLinks.map((link) => {
              const isHashLink = link.path.includes("/#");
              return isHashLink ? (
                <NavHashLink
                  key={link.name}
                  to={link.path}
                  smooth
                  end={link.path === "/"}
                  className={() => {
                    const hash = link.path.split("#")[1];
                    const isActiveHash = location.hash === `#${hash}`;
                    return `text-[2.5vh] font-medium transition-colors duration-700 hover:text-gray-400 ${
                      isActiveHash
                        ? isScrolled
                          ? "text-blue-500 font-bold"
                          : "text-gray-300"
                        : isScrolled
                        ? "text-black"
                        : "text-white"
                    }`;
                  }}
                >
                  {link.name}
                </NavHashLink>
              ) : (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[2.5vh] font-medium transition-colors duration-700 hover:text-gray-400 ${
                      isActive
                        ? isScrolled
                          ? "text-blue-500 font-bold"
                          : "text-gray-300"
                        : isScrolled
                        ? "text-black"
                        : "text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Buttons */}
          <div ref={buttonRef} className="flex items-center space-x-4">
            {/* Join JalSetu */}
            <NavLink
              to="/signup"
              className={`group flex items-center space-x-3 pl-5 pr-3 py-1 font-[font6] rounded-full transition-colors duration-700 ${
                isScrolled ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              <span className="font-semibold hidden sm:inline">
                Join JalSetu
              </span>
              <div
                className={`p-2 rounded-full transition-colors duration-700 ${
                  isScrolled ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                <ArrowRightIcon />
              </div>
            </NavLink>

            {/* Mobile Toggle */}
            <div
              className={`rounded-full lg:hidden transition-colors duration-700 ${
                isScrolled ? "bg-white" : "bg-black"
              }`}
            >
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-colors duration-700 ${
                  isScrolled
                    ? "text-black hover:bg-gray-200"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/90 text-white transform transition-transform duration-700 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl font-bold">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() =>{window.scrollTo({ top: 0, behavior: "smooth"})
              setIsMenuOpen(false)}}
              className="hover:text-blue-400 transition-colors duration-500"
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to="/signup"
            onClick={() => setIsMenuOpen(false)}
            className="mt-6 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
          >
            Join JalSetu
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Header;
