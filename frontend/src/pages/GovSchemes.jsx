import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SchemeCard from '../components/Scheme';
import SchemeModal from '../components/SchemeModal';
// Import the function instead of the variable
import { getTranslatedSchemes } from '../components/SchemesData';
import HeaderAL from '../components/HeaderAL';

const GovSchemesPage = () => {
  const { t } = useTranslation();
  // Call the function with 't' to get the translated array
  const allItems = getTranslatedSchemes(t);
  
  const [selectedItem, setSelectedItem] = useState(null);
  // ... rest of your component logic is unchanged
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
    // ... your JSX is unchanged
    <div>
      <HeaderAL />
      <div className={`bg-gradient-to-b from-slate-900 via-blue-950 to-black text-slate-100 min-h-screen font-sans p-4 sm:p-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto mt-20">
          <div className="text-center mb-12 page-header">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
              {t('govSchemesPage.title')}
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              {t('govSchemesPage.subtitle')}
            </p>
          </div>
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