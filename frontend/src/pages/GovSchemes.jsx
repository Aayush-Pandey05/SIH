import React, { useState, useEffect } from 'react';

const schemes = [
  {
    title: 'Jal Shakti Abhiyan: Catch the Rain',
    description: 'A nationwide campaign by the Ministry of Jal Shakti to create rainwater harvesting structures in both rural and urban areas.',
    details: 'Launched in 2019, this mission focuses on water conservation and water security. It operates with the motto "Catch the Rain, Where it Falls, When it Falls". It encourages the construction of rainwater harvesting structures, rejuvenation of traditional water bodies, and afforestation. It is a collaborative effort between central and state governments to address water stress.',
    link: 'https://jalshakti-ddws.gov.in/jal-shakti-abhiyan-catch-the-rain-campaign',
  },
  {
    title: 'Atal Bhujal Yojana (Atal Jal)',
    description: 'A Central Sector Scheme for sustainable management of ground water resources with community participation.',
    details: 'This scheme, launched in 2020, is a ₹6,000 crore initiative funded by the World Bank. It is being implemented in water-stressed areas of seven states to improve groundwater management through community-led activities and innovative recharge structures, including rainwater harvesting.',
    link: 'https://atalbhujalyojana.gov.in/',
  },
  {
    title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    description: 'A scheme to provide end-to-end solutions in the irrigation supply chain, with a focus on "Per Drop, More Crop".',
    details: 'PMKSY aims to expand the cultivable area under assured irrigation. Its components include rainwater harvesting, watershed development, and improving on-farm water use efficiency through techniques like micro-irrigation. It offers financial assistance and subsidies for farmers to build water harvesting structures and use efficient irrigation systems.',
    link: 'https://pmksy.gov.in/',
  },
  {
    title: 'AMRUT 2.0 (Urban Water)',
    description: 'A mission by the Ministry of Housing and Urban Affairs to ensure water security in urban areas.',
    details: 'The Atal Mission for Rejuvenation and Urban Transformation (AMRUT) 2.0 aims to make cities water-secure. It includes provisions for rainwater harvesting, rejuvenation of water bodies, and urban aquifer management. It encourages cities to adopt rainwater harvesting structures and create plans for groundwater recharge to augment freshwater resources.',
    link: 'https://mohua.gov.in/amrut',
  },
  {
    title: 'National Water Policy (2012)',
    description: 'A policy that advocates rainwater harvesting and conservation of water to augment water availability.',
    details: 'The National Water Policy sets out principles for the sustainable management of water resources in India. It emphasizes the need to give water harvesting and conservation measures priority and provides a framework for states to formulate their own water policies. It recommends incentivizing states for reviving traditional water harvesting structures.',
    link: 'https://jalshakti-ddws.gov.in/sites/default/files/NWP_2012_Eng_1.pdf',
  },
  {
    title: 'MGNREGS (Rural Employment)',
    description: 'A flagship scheme that includes water conservation and harvesting structures as a key activity.',
    details: 'The Mahatma Gandhi National Rural Employment Guarantee Scheme (MGNREGS) provides a legal guarantee for 100 days of wage employment in a financial year to rural households. Water conservation and water harvesting structures, such as check dams, farm ponds, and desilting of traditional water bodies, are key works undertaken under this scheme.',
    link: 'https://nrega.nic.in/',
  },
];

const GovSchemes = () => {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleViewDetails = (scheme) => {
    setSelectedScheme(scheme);
  };

  const handleCloseDetails = () => {
    setSelectedScheme(null);
  };

  return (
    <div className={`min-h-screen font-sans text-slate-100 bg-slate-950 bg-[radial-gradient(at_50%_50%,_#1e293b_0%,_#020617_75%)] p-8 transition-all duration-500 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <div className="text-center mb-8 border-b border-white border-opacity-10 pb-6 mt-16">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-500">Government Scheme Integration</h1>
        <p className="text-lg text-slate-400">Based on your location and roof size, here are the government subsidies and schemes you are eligible for.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-800 rounded-xl shadow-lg mb-6">
        <h3 className="text-xl font-semibold text-slate-300 md:mb-0 mb-4 whitespace-nowrap">Generate Your Report Template for government schemes:</h3>
        <button className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-600 transition-colors duration-200 ease-in-out uppercase tracking-wide md:w-auto w-full">Generate</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme, index) => (
          <div key={index} className="bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl" style={{ transitionDelay: `${index * 0.1}s` }}>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-200">{scheme.title}</h3>
              <p className="text-slate-400 text-sm">{scheme.description}</p>
            </div>
            <div className="flex space-x-3 mt-6">
                <button 
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-md border border-slate-600 text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors"
                  onClick={() => handleViewDetails(scheme)}
                >
                  View Details
                </button>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-cyan-600 text-white text-center hover:bg-cyan-700 transition-colors"
                >
                  Visit Site
                </a>
            </div>
          </div>
        ))}
      </div>

      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-11/12 max-w-2xl relative text-slate-100">
            <button 
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl font-bold"
              onClick={handleCloseDetails}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-slate-50">{selectedScheme.title}</h2>
            <p className="text-slate-300">{selectedScheme.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovSchemes;