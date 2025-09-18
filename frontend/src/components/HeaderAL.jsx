import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom"; // ✅ added useLocation

import { MenuIcon, XIcon } from "./IconAL";
import assets from "../assets/assets";
import { useAuthStore } from "../store/useAuthStore";

const InitialAvatar = ({ name, className }) => {
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?";
    const parts = name.split(" ");
    return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-cyan-600 text-white font-bold ${className}`}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
};

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Government Schemes", path: "/govschemes" },
  { name: "Map Roof AI", path: "/map-roof" },
  { name: "Support", path: "/support" },
];

const HeaderAL = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { logout, authUser } = useAuthStore();
  const location = useLocation(); // ✅ track route changes

  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const buttonRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // ✅ Scroll / Hero detection
  useEffect(() => {
    const hero = document.getElementById("hero");

    if (!hero) {
      // No hero → treat as transparent at top
      setIsScrolled(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [location.pathname]);

  // ✅ GSAP animation on mount
  useEffect(() => {
    const headerEl = headerRef.current;
    const logoEl = logoRef.current;
    const navItems = navRef.current?.children || [];
    const buttonEl = buttonRef.current;

    const tl = gsap.timeline();
    tl.from(headerEl, { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" })
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

  // ✅ GSAP mobile menu slide
  useEffect(() => {
    if (isMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.6, ease: "power3.out" }
      );
    }
  }, [isMenuOpen]);

  // ✅ Close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const Navigate = useNavigate();

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    Navigate("/", { replace: true });
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed z-50 top-5 left-4 right-4 p-2 rounded-3xl transition-all duration-700 ${
          isScrolled ? "bg-white shadow-lg" : "bg-black/80"
        }`}
      >
        <div className="px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center space-x-2 cursor-pointer group">
            <img src={assets.logo} alt="JalSetu Logo" className="h-8 w-8 rounded-full" />
            <span
              className={`text-2xl font-bold group-hover:text-blue-400 transition-colors duration-700 font-[font17] ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              JalSetu
            </span>
          </div>

          {/* Desktop Nav */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-3 space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-xl sm:text-lg md:text-base lg:text-[2.3vh] font-medium transition-colors duration-700 hover:text-gray-400 ${
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
            ))}
          </nav>

          {/* Right Section */}
          <div ref={buttonRef} className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`group flex items-center space-x-3 px-3 py-1 rounded-full transition-colors duration-700 ${
                  isScrolled ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                <InitialAvatar name={authUser?.fullName} className="w-8 h-8" />
                <span className="font-semibold hidden sm:inline">
                  {authUser?.fullName || "User"}
                </span>
              </button>

              {isProfileMenuOpen && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-3 w-56 bg-slate-950 backdrop-blur-lg 
                        rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
                >
                  <div className="flex flex-col items-center p-4 border-b border-gray-700">
                    <InitialAvatar name={authUser?.fullName} className="w-12 h-12 p-2 border-2 border-slate-600" />
                    <p className="font-semibold text-white text-center">
                      {authUser?.fullName || "User"}
                    </p>
                    <p className="text-sm text-slate-300 text-center">
                      {authUser?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700/50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div
              className={`rounded-full lg:hidden transition-colors duration-700 ${
                isScrolled ? "bg-white" : "bg-black"
              }`}
            >
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-colors duration-700 ${
                  isScrolled ? "text-black hover:bg-gray-200" : "text-white hover:bg-gray-800"
                }`}
              >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 bg-black/90 z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-semibold transition-colors duration-700 ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};

export default HeaderAL;
