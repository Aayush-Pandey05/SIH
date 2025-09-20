import React, { useState, useEffect } from 'react';
import SchemeCard from '../components/Scheme';
import SchemeModal from '../components/SchemeModal';
import { allItems } from '../components/SchemesData';
import HeaderAL from '../components/HeaderAL';

const GovSchemesPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  return (
    <div>
      <HeaderAL />
      <div className={`bg-gradient-to-b from-slate-900 via-blue-950 to-black text-slate-100 min-h-screen font-sans p-4 sm:p-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto mt-20">
          <div className="text-center mb-12 page-header">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
              Government Schemes & Policies
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Based on your location and roof size, JalSetu helps you identify and apply for relevant government subsidies and initiatives.
            </p>
          </div>

          {/* Generate Report Bar */}
          {/* <div className="flex flex-col md:flex-row items-center justify-between p-3 bg-slate-950 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg mb-16 report-bar">
            <h3 className="pl-5 text-lg font-semibold text-slate-200 md:mb-0 mb-4 text-center md:text-left">
              Generate a personalized report for your property
            </h3>
            <button className="px-4 py-3 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition-opacity duration-200 uppercase tracking-wide md:w-auto w-full">
              Generate Report
            </button>
          </div> */}
          
          {/* Grid of Scheme Cards */}
          <div className="schemes-section">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch font-[font6]">
              {allItems.map((item, index) => (
                <div key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                  <SchemeCard 
                    item={item} 
                    handleViewDetails={handleViewDetails} 
                    isVisible={isLoaded} 
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* The SchemeModal component (unchanged) */}
          <SchemeModal 
            selectedItem={selectedItem} 
            handleCloseDetails={handleCloseDetails} 
          />
        </div>
      </div>
    </div>
  );
};

export default GovSchemesPage;