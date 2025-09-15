// components/CtaSection.js
import React from 'react';
import { ArrowRightIcon } from './Icons';

const CtaSection = ({ visibleElements }) => (
  <section className="py-20 px-6 bg-black text-white" data-animate="cta">
    <div className="max-w-4xl mx-auto text-center">
      <div className={`transition-all duration-1000 ease-out ${
        visibleElements.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Secure Your Water Future?</h2>
        <p className="text-xl text-gray-400 mb-8">Start planning your rainwater harvesting project today. It's free, easy, and impactful.</p>
        <button className="group bg-cyan-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-cyan-600 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 flex items-center space-x-2 mx-auto transform">
          <span>Get Started with JalSetu</span>
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  </section>
);

export default CtaSection;