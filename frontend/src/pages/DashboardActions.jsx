import React, { useState } from 'react';

const ActionButton = ({ icon, text, onClick }) => {
    const MapIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>);
    const TrendingUpIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>);
    const LandmarkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><line x1="3" y1="22" x2="21" y2="22"></line><line x1="6" y1="18" x2="6" y2="11"></line><line x1="10" y1="18" x2="10" y2="11"></line><line x1="14" y1="18" x2="14" y2="11"></line><line x1="18" y1="18" x2="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon></svg>);

    let iconComponent;
    if (icon === 'MapIcon') iconComponent = <MapIcon />;
    if (icon === 'TrendingUpIcon') iconComponent = <TrendingUpIcon />;
    if (icon === 'LandmarkIcon') iconComponent = <LandmarkIcon />;

    return (
        <button onClick={onClick} className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {iconComponent} {text}
        </button>
    );
};

const RoiCalculator = ({ totalRainfall, roofArea }) => {
    const installationCost = 50000;
    const municipalWaterCostPerLiter = 0.05;
    const annualSavings = totalRainfall * municipalWaterCostPerLiter;
    const paybackPeriod = annualSavings > 0 ? (installationCost / annualSavings) : Infinity;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Return on Investment (ROI)</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <p className="text-gray-600">Initial Investment</p>
                    <p className="font-bold">₹{installationCost.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <p className="text-gray-600">Annual Water Savings</p>
                    <p className="font-bold">₹{annualSavings.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <p className="text-gray-600">Estimated Payback Period</p>
                    <p className="font-bold">{isFinite(paybackPeriod) ? `${paybackPeriod.toFixed(1)} years` : 'N/A'}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2 italic">Note: This is an estimation based on a 150m² roof area and average rainfall.</p>
            </div>
        </div>
    );
};

const GovtSchemes = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Government Schemes</h3>
        <p className="text-gray-600 mb-2 font-semibold">National Programs:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li><span className="font-bold">Jal Shakti Abhiyan:</span> A nationwide campaign for water conservation.</li>
            <li><span className="font-bold">Atal Bhujal Yojana:</span> Focuses on sustainable groundwater management in water-stressed areas.</li>
        </ul>
        <p className="text-gray-600 mt-4 mb-2 font-semibold">Local Incentives:</p>
        <p className="text-gray-600">Check with your local municipal corporation or state's water department for specific subsidies and mandatory rainwater harvesting regulations.</p>
    </div>
);

export default function DashboardActions() {
    const [showRoi, setShowRoi] = useState(false);
    const [showSchemes, setShowSchemes] = useState(false);
    
    // Hardcoded rainfall and roof area for the ROI calculator in this component
    const totalRainfall = 50000;
    const roofArea = 150;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <ActionButton icon="MapIcon" text="Map Roof" onClick={() => {}} />
                <ActionButton icon="TrendingUpIcon" text="Check ROI" onClick={() => setShowRoi(!showRoi)} />
                <ActionButton icon="LandmarkIcon" text="Govt Schemes" onClick={() => setShowSchemes(!showSchemes)} />
            </div>
            {showRoi && <RoiCalculator totalRainfall={totalRainfall} roofArea={roofArea} />}
            {showSchemes && <GovtSchemes />}
        </>
    );
}