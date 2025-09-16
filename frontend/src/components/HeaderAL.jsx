import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { JalSetuLogo, MenuIcon, XIcon, ArrowRightIcon } from "./IconAL";
import assets from '../assets/assets'

const HeaderAL = ({ isMenuOpen, setIsMenuOpen, time }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);

  // Effect to close the profile dropdown when clicking outside
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
  return (
    
    <header className="fixed w-full z-50 bg-black/30 backdrop-blur-md shadow-lg py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto  sm:px-6 relative flex items-center justify-between h-16">
        {/* Left Section */}
        <div className="flex items-center">
          <div className="bg-black/20 rounded-full flex items-center space-x-2 pr-3 hover:bg-black/30 transition-colors">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-white rounded-full hover:bg-white/10"
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
            <div className="text-sm whitespace-nowrap text-gray-200">
              {/* UPDATED: Both time and location now hide on screens smaller than the 'sm' breakpoint */}
              <span className="font-medium hidden sm:inline">{time}, Bengaluru, IN</span>
            </div>
          </div>
        </div>

        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hidden md:block ${
            isMenuOpen ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex items-center  space-x-2 cursor-pointer group">
            {/* UPDATED: Added a placeholder logo SVG */}
            <img 
              src={assets.logo} 
              alt="JalSetu Logo" 
              className="h-8 w-8 rounded-full" link='/'
            />
            <span className="text-2xl font-bold text-white group-hover:text-blue-950 transition-colors">
              JalSetu
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button
              ref={profileButtonRef}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="group bg-black/20 rounded-full flex items-center space-x-3 pl-2 pr-4 py-2 font-medium hover:bg-black/30 transition-colors"
            >
              <img 
                src="https://i.pravatar.cc/150?img=58" // Paste here Intial Avtar 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full border-2 border-slate-600 group-hover:border-cyan-400 transition"
              />
              <span className="font-semibold text-white hidden sm:inline">Panda</span>
            </button>
            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div
                ref={profileMenuRef}
                className="absolute right-[-1] mt-3 w-60 bg-slate-950 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
              >
                <div className="flex flex-col items-center p-4 border-b border-gray-700">
                  <img 
                    src="https://i.pravatar.cc/150?img=58"
                    alt="User Avatar" 
                    className="w-16 h-16 rounded-full border-2 border-cyan-400 mb-2"
                  />
                  {/* <InitialAvatar name={user.name} className="w-10 h-10 border-2 border-slate-600 group-hover:border-cyan-400 transition" /> */}
                  <p className="font-semibold text-white">Priya S.</p>
                  <p className="text-sm text-slate-400">priya.s@example.com</p>
                </div>
                <div className="py-2">
                  <Link to="/account" onClick={() => setIsProfileMenuOpen(false)} className="block w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700/50">
                    Account
                  </Link>
                  <button 
                    onClick={() => { /* Add logout logic here */ setIsProfileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700/50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAL;

