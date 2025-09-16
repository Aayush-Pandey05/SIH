import React from 'react';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden faq-item">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left p-6 font-semibold text-white"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-6 text-slate-300">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
