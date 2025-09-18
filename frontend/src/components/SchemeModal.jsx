import React from "react";
import { X } from "lucide-react";

const SchemeModal = ({ selectedItem, handleCloseDetails }) => {
  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-slate-800/50 border border-slate-700 p-8 rounded-xl shadow-2xl w-full max-w-2xl relative text-slate-100 transition-all duration-300 ${
          selectedItem ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
          onClick={handleCloseDetails}
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-500">
          {selectedItem.title}
        </h2>
        <p className="text-slate-300 leading-relaxed">{selectedItem.details}</p>
      </div>
    </div>
  );
};

export default SchemeModal;
