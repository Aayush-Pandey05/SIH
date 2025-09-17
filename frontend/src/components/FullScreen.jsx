// components/FullScreenMenu.js
import React from "react";
import { HashLink } from "react-router-hash-link";
const FullScreenMenu = ({ isMenuOpen, setIsMenuOpen }) => (
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
        <a
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="text-5xl font-extrabold text-gray-200 hover:text-cyan-400 transition-all hover:translate-x-2"
        >
          Home
        </a>
      <HashLink
      smooth
      to="/#features-section"
      onClick={() => setIsMenuOpen(false)}
      className="text-5xl font-extrabold text-gray-200 hover:text-cyan-400 transition-all hover:translate-x-2"
    >
      Features
    </HashLink>
        <a
          href="/about"
          onClick={() => setIsMenuOpen(false)}
          className="text-5xl font-extrabold text-gray-200 hover:text-cyan-400 transition-all hover:translate-x-2"
        >
          About Us
        </a>
        <a
          href="/contactus"
          onClick={() => setIsMenuOpen(false)}
          className="text-5xl font-extrabold text-gray-200 hover:text-cyan-400 transition-all hover:translate-x-2"
        >
          Contact Us
        </a>
      </div>
    </div>
  </div>
);

export default FullScreenMenu;
