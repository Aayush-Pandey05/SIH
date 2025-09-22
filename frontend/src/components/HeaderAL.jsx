import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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

const HeaderAL = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const headerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const buttonRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setIsScrolled(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [location.pathname]);

  // GSAP intro animation (Unchanged)
  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      .from([logoRef.current, buttonRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.3")
      .from(navRef.current?.children || [], {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.1,
      }, "-=0.3");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    navigate("/", { replace: true });
  };

  const getDesktopLinkClassName = ({ isActive }) => {
    return `text-sm sm:text-base md:text-lg lg:text-xl font-medium font-[font16] transition-colors duration-700 hover:text-gray-400 ${
      isActive
        ? isScrolled
          ? "text-blue-500 font-bold"
          : "text-gray-300"
        : isScrolled
        ? "text-black"
        : "text-white"
    }`;
  };

  const getMobileLinkClassName = ({ isActive }) => {
    return `text-white hover:text-gray-300 transition-colors duration-300 ${
      isActive ? "text-blue-400 font-bold" : ""
    }`;
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
          <div
            ref={logoRef}
            className="flex items-center cursor-pointer group space-x-1 sm:space-x-2 md:space-x-2 lg:space-x-3"
          >
            <img
              src={assets.logo}
              alt="JalSetu Logo"
              className="h-8 w-8 rounded-full"
            />
            <span
              className={`text-sm sm:text-l md:text-xl lg:text-2xl font-bold group-hover:text-blue-400 transition-colors duration-700 font-[font16] ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              JalSetu
            </span>
          </div>

          
          <nav ref={navRef} className="hidden lg:flex items-center gap-8 sm:gap-2 md:gap-3 lg:gap-6 xl:gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={getDesktopLinkClassName}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Section (Buttons) */}
          <div ref={buttonRef} className="flex items-center space-x-4 sm:space-x-3 md:space-x-4 lg:space-x-4 xl:space-x-4">
            
            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`group flex items-center space-x-3 pl-1 pr-3 py-1.5 rounded-full transition-colors duration-700 ${
                  isScrolled ?  "bg-black hover:bg-gray-900": "bg-white hover:bg-gray-200" 
                }`}
              >
                <InitialAvatar name={authUser?.fullName} className="w-8 h-8" />
                <span className={`font-semibold hidden text-sm sm:text-base md:text-lg lg:text-xl sm:inline ${ isScrolled ? "text-white" : "text-black"}`}> 
                  {authUser?.fullName || "Profile"}
                </span>
              </button>

              {isProfileMenuOpen && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-3 w-56 bg-slate-950 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
                >
                  <div className="flex flex-col items-center p-4 border-b border-gray-700">
                    <InitialAvatar name={authUser?.fullName} className="w-12 h-12 p-2 border-2 border-slate-600" />
                    <p className="font-semibold text-white text-center mt-2">
                      {authUser?.fullName || "User"}
                    </p>
                    <p className="text-sm text-slate-300 text-center">
                      {authUser?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700/50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Toggle  */}
            <div
              className={`rounded-full block lg:hidden transition-colors duration-700 ${
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
      <div
        className={`fixed inset-0 z-40 bg-black/90 text-white transform transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl font-bold">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={getMobileLinkClassName}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="mt-6 px-6 py-3 rounded-full text-red-400 border border-red-400 hover:bg-red-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderAL;