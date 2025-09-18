import React from "react";

const SchemeCard = ({ item, handleViewDetails, isVisible }) => (
  <div
    className={`scheme-card bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700 p-6 flex flex-col justify-between h-full transform transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 overflow-hidden relative ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
    }`}
  >
    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-70"></div>
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-100 pt-2">
        {item.title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        {item.description}
      </p>
    </div>
    <div className="flex space-x-4 mt-6">
      <button
        className="flex-1 px-4 py-2 text-sm font-medium rounded-md border border-slate-600 text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors"
        onClick={() => handleViewDetails(item)}
      >
        View Details
      </button>
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-cyan-600 text-white text-center hover:bg-cyan-700 transition-colors"
      >
        Visit Site
      </a>
    </div>
  </div>
);

export default SchemeCard;
