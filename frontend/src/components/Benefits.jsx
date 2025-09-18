
import React from 'react';

const BenefitsSection = ({ visibleElements, benefits }) => (
  <section className="py-16 bg-black text-white overflow-hidden" data-animate="benefits">
    <div className="space-y-8">
      <div className={`text-center transition-all duration-1000 ease-out ${
        visibleElements.has('benefits') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock the Benefits of Rainwater Harvesting</h2>
        <p className="text-xl text-gray-400">Secure your water supply and contribute to a sustainable future.</p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex space-x-8 animate-[marquee_40s_linear_infinite]">
          {benefits.concat(benefits).map((benefit, index) => (
            <div key={index} className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 hover:bg-white/20 hover:scale-110 transition-all duration-300 cursor-pointer">
              <span className="text-white font-medium whitespace-nowrap">{benefit}</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0%); } to { transform: translateX(-50%); } }`}</style>
      </div>
    </div>
  </section>
);

export default BenefitsSection;