// components/Clock.js
import React, { useState, useEffect } from 'react';

const Clock = ({ isMenuOpen }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="hidden md:flex items-center pl-2 pr-4 text-sm whitespace-nowrap">
      <span className={isMenuOpen ? "text-gray-800" : "text-gray-300"}>
        {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
      </span>
      <span className={`mx-2 ${isMenuOpen ? "text-gray-300" : "text-gray-600"}`}>|</span>
      <span className={isMenuOpen ? "text-gray-500" : "text-gray-200"}>Bengaluru, IN</span>
    </div>
  );
};

export default Clock;