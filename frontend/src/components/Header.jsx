import React from "react";
import { NavLink } from "react-router-dom";
import Clock from "./Clock";
import { MenuIcon, XIcon, ArrowRightIcon } from "./Icons";
import { assets } from "../assets/assets";

const Header = ({  isMenuOpen, setIsMenuOpen }) => (
  <header className="fixed w-full z-50 bg-black/30 backdrop-blur-md shadow-lg py-3 transition-all duration-300">
    <div className="max-w-7xl mx-auto sm:px-6 relative flex items-center justify-between h-16">
      
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
            <Clock/>
          </div>
        </div>
      </div>

      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hidden md:block ${
          isMenuOpen ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center space-x-2 cursor-pointer group">
          <img
            src={assets.logo}
            alt="JalSetu Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-2xl font-bold text-white group-hover:text-blue-950 transition-colors">
            JalSetu
          </span>
        </div>
      </div>

      {/* Right Section → Join Button */}
      <div className="flex items-center">
        <NavLink
          to="/signup"
          className="group bg-black/20 rounded-full flex items-center space-x-3 pl-4 pr-4 py-2 font-medium hover:bg-black/30 transition-colors"
        >
          <span className="font-semibold text-white hidden sm:inline">
            Join JalSetu
          </span>
          <div className="p-2 bg-white/40 rounded-full">
            <ArrowRightIcon />
          </div>
        </NavLink>
      </div>
    </div>
  </header>
);

export default Header;
