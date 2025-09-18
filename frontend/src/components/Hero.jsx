// components/HeroSection.js
import React from 'react';
import { ChevronDownIcon } from './Icons';

const HeroSection = ({ visibleElements }) => (
  <section 
    className="relative h-screen flex items-center justify-center text-center px-6 bg-cover bg-center"
    // style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621213009911-9635b7a37265?q=80&w=2070&auto=format&fit=crop')" }}
    data-animate="hero"
  >
    <div className="absolute inset-0 bg-white"><div className='h-full w-full'><div className="absolute  inset-0 bg-black/50 z-10"></div>
      <video autoPlay loop muted className="h-full object-cover w-full" src="/Video.mp4"></video>
    </div></div>
    <div className="relative z-10">
      <div className='bg-white/10 backdrop-blur-md border border-white/20 flex justify-center items-center h-auto min-h-[200px] p-6 md:p-10 rounded-2xl md:rounded-4xl shadow-lg"'>
      <div className={`space-y-6 transition-all duration-1000 ease-out ${
        visibleElements.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight text-black">
          A Water-Secure Future.
          <br/>
          <span className="font-sans text-blue-950">Built With You.</span>
        </h1>
        <p className="text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed">
          Personalized, proactive water journeys, guided by experts and powered by AI, designed to help you conserve better, plan smarter, and stay water-secure longer.
        </p>
      </div>
    </div></div>
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
        <ChevronDownIcon />
    </div>
  </section>
);

export default HeroSection;