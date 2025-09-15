// components/WelcomeSection.js
import React from 'react';
import { assets } from '../assets/assets';

const WelcomeSection = ({ visibleElements }) => {
  const features = [
    "Personalized Solutions",
    "Data-Driven Decisions",
    "Measurable Community Impact"
  ];

  return (
    <section id='features-section'className="py-30 px-6 bg-gray-900" data-animate="welcome">
      <div className="max-w-6xl mx-auto">
        <div
          className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ease-out ${
            visibleElements.has('welcome')
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-10'
          }`}
        >
          {/* Left Side */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-100 uppercase tracking-wider">
                for a water-secure india
              </h2>
              <p className="text-lg text-gray-400">
                Traditional water management is struggling to keep up. We
                believe in empowering every citizen with the tools to make a
                difference.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Empowering Citizens with Water Intelligence
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                JalSetu connects advanced satellite mapping, artificial
                intelligence, and augmented reality into a simple platform.
                <br />
                <br />
                Our mission is to make rainwater harvesting accessible,
                understandable, and effective for everyone, from individual
                homes to entire communities.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side (Image Card) */}
          <div className="relative bg-gradient-to-br from-gray-700 to-gray-800 border border-cyan-500/20 rounded-3xl h-96 flex items-center justify-center group hover:shadow-2xl hover:shadow-cyan-400/10 hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden">
            <img 
              src={assets.img2}
              alt="AI Analysis Dashboard"
              className="w-full h-96 object-cover cursor-pointer rounded-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl cursor-pointer"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
