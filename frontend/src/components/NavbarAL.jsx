import React, { useState, useRef, useEffect } from "react";

import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";

const NavbarAL = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef, profileButtonRef]);

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-gray-900 font-semibold"
      : "text-gray-500 hover:text-gray-900";

  return (
    <div className="fixed h-20 top-0 left-0 w-full z-50 bg-white flex items-center justify-between px-6 md:px-10 font-medium border-b border-gray-200">
      <Link to="/home" className="flex items-center gap-2">
        <img
          src={assets.logo}
          alt="JalSetu Logo"
          className="h-8 w-8 object-contain"
        />
        <span className="text-2xl font-bold text-gray-800">JalSetu</span>
      </Link>

      <ul className="hidden md:flex gap-8 text-base">
        <NavLink to="/dashboard" className={getNavLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/map-roof" className={getNavLinkClass}>
          Map Roof
        </NavLink>
        <NavLink to="/govschemes" className={getNavLinkClass}>
          Government Schemes 
        </NavLink>
        <NavLink to="/support" className={getNavLinkClass}>
          Support
        </NavLink>
        
        <NavLink to="/webar" className={getNavLinkClass}>
          WebAR
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <button
            ref={profileButtonRef}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="focus:outline-none"
          >
            <img
              src={assets.user}
              alt="User Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </button>
          {isProfileMenuOpen && (
            <div
              ref={profileMenuRef}
              className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-200"
            >
              <div className="flex flex-col items-center p-3 border-b border-gray-100">
                <img
                  src={assets.user}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mb-2"
                />
                <p className="font-semibold text-gray-800">John Doe</p>
                <p className="text-sm text-gray-500">johndoe@example.com</p>
              </div>
              <Link
                to="/account"
                onClick={() => setIsProfileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Account
              </Link>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <img
          onClick={() => setIsMobileMenuOpen(true)}
          src={assets.user}
          alt="Menu"
          className="w-6 h-6 cursor-pointer md:hidden"
        />
      </div>

      {/* Sidebar Menu for small screens */}
      <div
        className={`fixed top-0 right-0 h-full overflow-hidden bg-white transition-all duration-300 shadow-xl ${
          isMobileMenuOpen ? "w-4/5 sm:w-80" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600 pt-5">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-end p-4 cursor-pointer"
          >
            <p className="font-semibold">Close</p>
          </div>
          <NavLink
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-3 pl-6 border-t"
            to="/dashboard"
          >
            Dashboard
          </NavLink>
          <NavLink
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-3 pl-6 border-t"
            to="/map-roof"
          >
            Map Roof
          </NavLink>
          <NavLink
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-3 pl-6 border-t"
            to="/alerts"
          >
            Alerts
          </NavLink>
          <NavLink
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-3 pl-6 border-t"
            to="/government"
          >
            Government
          </NavLink>
          <NavLink
            onClick={() => setIsMobileMenuOpen(false)}
            className="py-3 pl-6 border-t"
            to="/webar"
          >
            WebAR
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavbarAL;
