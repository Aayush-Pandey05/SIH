import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center flex flex-col items-center gap-4 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-cyan-300">
      <div className="flex-shrink-0 bg-cyan-100 p-4 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      
      <p className="text-gray-500 text-base leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
