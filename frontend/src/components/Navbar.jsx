import React from "react";
import { Link } from "react-router-dom";
import { Droplets } from "lucide-react";

const Navbar = () => {
  return (
    <header className="px-6 py-4">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Droplets className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-blue-600">JalSetu 2.0</h1>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="px-4 py-2 text-blue-600 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
