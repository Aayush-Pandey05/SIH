import React from 'react';
import { NavLink } from 'react-router-dom';
import Clock from './Clock';
import { MenuIcon, XIcon, ArrowRightIcon } from './Icons';
import { assets } from "../assets/assets"

const Header = ({ scrolled, isMenuOpen, setIsMenuOpen, time }) => (
  <nav className={`fixed w-full z-50 transition-all duration-500 ease-out transform ${
    isMenuOpen
      ? 'bg-sky-50 py-3 shadow-md'
      : scrolled
      ? 'bg-sky-100/80 backdrop-blur-xl shadow-lg py-3'
      : 'bg-transparent py-6'
  }`}>
    <div className="max-w-7xl mx-auto px-6 relative flex items-center justify-between h-16">
      
      <div className={`flex items-center transition-colors duration-300 rounded-full ${
          isMenuOpen
            ? 'bg-sky-100 hover:bg-sky-200'
            : scrolled
            ? 'bg-white/80 hover:bg-white'
            : 'bg-black/20 hover:bg-black/30'
      }`}>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-3 rounded-full transition-colors duration-300 shrink-0 ${
            isMenuOpen
              ? 'text-gray-800 hover:bg-sky-200/50'
              : scrolled
              ? 'text-gray-800 hover:bg-black/10'
              : 'text-white hover:bg-white/10'
        }`}>
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
        <Clock isMenuOpen={isMenuOpen} scrolled={scrolled} time={time} />
      </div>


      {/* MODIFIED SECTION FOR LOGO AND TITLE */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
        <div className={`flex items-center space-x-2 text-2xl font-bold transition-all duration-300 hover:scale-110 cursor-pointer ${
            scrolled ? 'text-gray-900 hover:text-blue-950' : 'text-white'
        }`}>
            <img src={assets.logo} alt="JalSetu Logo" className="h-8 w-auto" />
            <span>JalSetu</span>
        </div>
      </div>
      
      <div className="flex items-center">
        <NavLink
          to="/signup" 
          className={`group flex items-center space-x-2 sm:space-x-4 font-semibold transition-all duration-300 rounded-full py-2 pr-2 ${
            isMenuOpen
              ? 'bg-sky-100 hover:bg-sky-200 pl-6'
              : scrolled
              ? 'bg-blue-600 hover:bg-blue-700 pl-4 sm:pl-6'
              : 'bg-gray-200 hover:bg-white pl-4 sm:pl-6'
          }`}
        >
          <span className={`whitespace-nowrap ${isMenuOpen ? 'text-gray-800' : scrolled ? 'text-white' : 'text-black'}`}>
            Join JalSetu
          </span>
          <div
            className={`rounded-full p-2 transition-transform duration-300 shrink-0 group-hover:scale-110 ${
              isMenuOpen ? 'bg-white' : scrolled ? 'bg-white' : 'bg-black'
            }`}
          >
            <ArrowRightIcon className={`w-5 h-5 ${isMenuOpen ? 'text-gray-800' : scrolled ? 'text-blue-600' : 'text-white'}`} />
          </div>
        </NavLink>
      </div>
    </div>
  </nav>
);

export default Header;