// components/FullScreenMenu.js
import React from "react";
import { Link } from "react-router-dom";

const FullScreenMenuAL = ({ isMenuOpen, setIsMenuOpen, navLinks, navRoutes }) => {
  return (
    <div
      className={`fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-xl transition-all duration-400 ${
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 pt-32 h-full transition-transform duration-400 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-10"
        }`}
      >
        <div className="flex flex-col items-start space-y-8">
          {navLinks.map((link,index) => (
            <Link
              key={link}
              // UPDATED: Use the 'to' prop and get the correct route using the index
              to={navRoutes[index]} 
              onClick={() => setIsMenuOpen(false)}
              className="text-5xl font-extrabold text-gray-200 hover:text-cyan-400 transition-all hover:translate-x-2"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullScreenMenuAL;
