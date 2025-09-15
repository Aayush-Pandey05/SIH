// components/FullScreenMenu.js
import React from 'react';

const FullScreenMenu = ({ isMenuOpen, setIsMenuOpen }) => (
  <div className={`fixed inset-0 z-40 bg-white transition-all duration-500 ease-in-out ${
    isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
  }`}>
    <div className={`max-w-7xl mx-auto px-6 pt-32 h-full transition-transform duration-500 ease-in-out ${
      isMenuOpen ? 'translate-y-0' : '-translate-y-10'
    }`}>
      <div className="flex flex-col items-start space-y-6">
        <a href="/" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black text-gray-900 hover:text-cyan-500 transition-all duration-300 hover:translate-x-2">Home</a>
        <a href="#features-section" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black text-gray-900 hover:text-cyan-500 transition-all duration-300 hover:translate-x-2">Features</a>
        <a href="/about" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black text-gray-900 hover:text-cyan-500 transition-all duration-300 hover:translate-x-2">About Us</a>
        <a href="/contactus" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black text-gray-900 hover:text-cyan-500 transition-all duration-300 hover:translate-x-2">Contact Us</a>
      </div>
    </div>
  </div>
);

export default FullScreenMenu;