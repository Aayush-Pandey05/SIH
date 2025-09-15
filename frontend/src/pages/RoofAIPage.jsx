import React, { useState, useEffect } from 'react';

const RecommendationCard = ({ data }) => {
  if (!data) return null; 
  
  const SearchIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const AiIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 13l-2.5 5.5" />
      <path d="M14.5 13l2.5 5.5" />
      <path d="M12 21V8" />
      <path d="M5 8h14" />
      <path d="M18.5 4.5a3.5 3.5 0 1 0-7 0" />
    </svg>
  );

  const RupeeIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="M6 13h12" />
      <path d="M9 18c6 0 9-4 9-8.5" />
      <path d="M14 13c0 4.5-3 8.5-9 8.5" />
      <path d="M5 3v15" />
    </svg>
  );

  const DropletIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C5 11.1 4 13 4 15a7 7 0 0 0 7 7z" />
    </svg>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 flex items-center mb-4">
        <AiIcon className="w-6 h-6 mr-2 text-blue-600" />
        AI Recommendation
      </h2>
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-full">
        <img 
          src={data.imageUrl}
          alt={`Recommended Structure: ${data.structure}`}
          className="w-full h-40 sm:h-48 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold text-slate-900">Recommended Structure: <span className="text-blue-600">{data.structure}</span></h3>
        <p className="text-sm text-slate-600 mt-2 mb-4">{data.description}</p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-slate-700 border-t border-slate-200 pt-4 gap-2">
          <div className="flex items-center">
            <RupeeIcon className="w-4 h-4 mr-2 text-slate-500" />
            <span>Cost: ₹{data.cost.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center">
            <DropletIcon className="w-4 h-4 mr-2 text-slate-500" />
            <span>Capacity: {data.capacity.toLocaleString('en-IN')} L</span>
          </div>
        </div>
        {data.subsidy > 0 && (
          <div className="mt-3 text-xs text-green-600 bg-green-50 p-2 rounded-md">
            <strong>Subsidy:</strong> ₹{data.subsidy.toLocaleString('en-IN')} available
          </div>
        )}
      </div>
    </div>
  );
};

const RoiPreviewCard = ({ data }) => {
  if (!data) return null; 

  const RoiIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 flex items-center mb-4">
        <RoiIcon className="w-6 h-6 mr-2 text-blue-600" />
        ROI Preview
      </h2>
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start pb-4 border-b border-slate-200">
          <div>
            <p className="text-sm text-slate-500">Est. Annual Savings</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">₹{data.annualSavings.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-full sm:w-auto sm:text-right">
            <p className="text-sm text-slate-500">Payback Period</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">{data.paybackPeriod} Years</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full h-32 bg-slate-50 rounded-md flex items-end justify-around p-2" aria-label="ROI chart placeholder">
            {data.chartData.map((height, index) => (
              <div 
                key={index} 
                className="w-4 bg-blue-300 rounded-t-sm" 
                style={{ height: `${height}%` }}
                title={`Year ${index + 1}`}
              ></div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">{data.disclaimer}</p>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function JalSetuPage() {
  // State to hold data from the database
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const SearchIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockApiData = {
        roofArea: 150,
        recommendation: {
          structure: 'Recharge Pit',
          description: 'Based on your soil type (sandy loam), rainfall (800mm/year), and groundwater depth (15m), a recharge pit is the most effective structure.',
          cost: 15000,
          capacity: 10000,
          subsidy: 5000,
          imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=Recharge+Pit',
        },
        roi: {
          annualSavings: 2500,
          paybackPeriod: 6,
          chartData: [50, 60, 75, 90, 80, 85, 95],
          disclaimer: 'Based on average water consumption and local rates. Actual savings may vary.',
        }
      };
      
      setPageData(mockApiData);
      setLoading(false);
    };

    fetchData();
  }, []); 

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-600">Loading Recommendations...</p>
      </div>
    );
  }

  // Render the page with data
  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
            Roof Mapping + AI Recommendation
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl mx-auto">
            Draw a polygon on the map to mark your roof area. Our AI will recommend the best rainwater harvesting structure for you.
          </p>
        </div>

        <div className="relative mb-8">
          <div 
            className="w-full h-[350px] sm:h-[400px] md:h-[500px] bg-slate-200 rounded-xl border border-slate-300 shadow-md flex items-center justify-center"
            aria-label="Map Placeholder"
          >
            <p className="text-slate-500">Map Component Goes Here</p>
          </div>
          
          <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-full sm:max-w-sm">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search for your location"
                className="w-full p-3 pl-10 rounded-lg shadow-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 px-3 rounded-lg shadow-lg text-sm">
            <strong>Roof Area:</strong> {pageData?.roofArea} sq. m.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecommendationCard data={pageData?.recommendation} />
          <RoiPreviewCard data={pageData?.roi} />
        </div>
      </div>
    </div>
  );
}