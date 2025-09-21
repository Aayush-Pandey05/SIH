import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import hooks
import { ChevronDownIcon } from './Icons';

const HeroSection = ({ visibleElements }) => {
  const { t } = useTranslation(); // 2. Initialize the translation hook

  return (
    <section id='hero'
      className="relative h-screen flex items-center justify-center text-center px-6 bg-cover bg-center"
      data-animate="hero"
    >
      <div className="absolute inset-0 bg-white">
        <div className='h-full w-full'>
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <video autoPlay loop muted className="h-full object-cover w-full" src="/Video.mp4"></video>
        </div>
      </div>
      <div className="relative z-10 mt-7">
        <div className={`space-y-6 transition-all duration-1000 ease-out ${
          visibleElements.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-5xl md:text-7xl font-[font6] font-bold leading-tight text-white">
            {t('hero.titleLine1')}
            <br/>
            <span className="font-[font6] text-gray-500">
              {t('hero.titleLine2')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-[font6]">
            {/* 4. Use the t() function for simple text */}
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
        <ChevronDownIcon />
      </div>
    </section>
  );
};

export default HeroSection;