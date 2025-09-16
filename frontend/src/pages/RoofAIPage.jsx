import React, { useState, useEffect } from "react";
import RoofMapper from "../components/RoofMapper";
import { Droplet, TrendingUp } from "lucide-react";
import rechargePitImage from "../assets/recharge_pit.png";
import NavbarAL from "../components/NavbarAL";
import { useDataStore } from "../store/useDataStore";
import HeaderAL from '../components/HeaderAL';
import FullScreenMenuAL from '../components/FullScreenMenuAL';
import Footer from '../components/Footer';

const RecommendationCard = ({ data }) => {
  // ✅ Check if data is an array and has at least one element
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  
  // ✅ Get the first object from the array
  const recommendation = data[0];

  const AiIcon = ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 13l-2.5 5.5" />
      <path d="M14.5 13l2.5 5.5" />
      <path d="M12 21V8" />
      <path d="M5 8h14" />
      <path d="M18.5 4.5a3.5 3.5 0 1 0-7 0" />
    </svg>
  );

  const RupeeIcon = ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="M6 13h12" />
      <path d="M9 18c6 0 9-4 9-8.5" />
      <path d="M14 13c0 4.5-3 8.5-9 8.5" />
      <path d="M5 3v15" />
    </svg>
  );

  const DropletIcon = ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C5 11.1 4 13 4 15a7 7 0 0 0 7 7z" />
    </svg>
  );

  return (
    <div className="m-1">
      <h2 className="text-xl font-bold text-slate-200 flex items-center mb-4">
        <AiIcon className="w-6 h-6 mr-2 text-blue-500" />
        AI Recommendation
      </h2>
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-full">
        <img
          src={rechargePitImage}
          alt={`Recommended Structure: ${recommendation.structure_type || 'N/A'}`}
          className="w-full object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold text-slate-900">
          Recommended Structure:{" "}
          <span className="text-blue-600">{recommendation.structure_type || 'N/A'}</span>
        </h3>
        <p className="text-sm text-slate-600 mt-2 mb-4">
          {recommendation.ai_recommendation || 'No recommendation available'}
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-slate-700 border-t border-slate-200 pt-4 gap-2">
          <div className="flex items-center">
            <RupeeIcon className="w-4 h-4 mr-2 text-slate-500" />
            <span>
              Cost: ₹{
                recommendation.estimated_cost_inr && typeof recommendation.estimated_cost_inr === 'number' 
                  ? recommendation.estimated_cost_inr.toLocaleString("en-IN")
                  : 'N/A'
              }
            </span>
          </div>
          <div className="flex items-center">
            <DropletIcon className="w-4 h-4 mr-2 text-slate-500" />
            <span>
              Capacity: {
                recommendation.structure_capacity_liters && typeof recommendation.structure_capacity_liters === 'number'
                  ? recommendation.structure_capacity_liters.toLocaleString("en-IN")
                  : 'N/A'
              } L
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroundwaterLevelCard = ({ level }) => {
  if (level === undefined || level === null) return null;

  return (
    <div className="groundwater-section ">
        <h2 className="text-xl font-bold text-slate-200 flex items-center mb-5">
          <Droplet className="w-6 h-6 mr-3  text-blue-400" />
          Groundwater Level
        </h2>
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col gap-6">
          <p className="text-sm text-slate-400">Current Level in Your Area</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400">
            {level} m
          </p>
        </div>
      </div>
  );
};

const RoiPreviewCard = ({ data }) => {
  // ✅ Check if data is an array and has at least one element
  if (!data || !Array.isArray(data) || data.length === 0) return null;
  
  // ✅ Get the first object from the array
  const roiData = data[0];

  const RoiIcon = ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );

  return (
    <div className="mt-1">
      <h2 className="text-xl font-bold text-slate-200 flex items-center mb-4">
        <TrendingUp className="w-6 h-6 mr-3 text-cyan-400" />
        Your Personalized ROI Preview
      </h2>
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <p className="text-sm text-slate-500">Est. Annual Savings</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            ₹{
              roiData.annual_savings_inr && typeof roiData.annual_savings_inr === 'number'
                ? roiData.annual_savings_inr.toLocaleString("en-IN")
                : 'N/A'
            }
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-slate-500">Payback Period</p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600">
            {roiData.payback_period_years || 'N/A'} Years
          </p>
        </div>
      </div>
    </div>
  );
};

//Header 
const navLinks = ["Home", "Dashboard", "Map Roof", "Government Schemes", "Support"];
const navRoutes = ["/", "/dashboard", "/map-roof", "/govschemes", "/support"];

export default function JalSetuPage() {
  const { fetchUserData, isLoadingData, userData } = useDataStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  
  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true };
      setTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };

    updateTime();
    const timerId = setInterval(updateTime, 60000);

    return () => clearInterval(timerId);
  }, []);

  // Note: SearchIcon is defined but not used in the JSX below.
  const SearchIcon = ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  console.log({ userData });

  if (isLoadingData) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-300">Loading Recommendations...</p>
      </div>
    );
  }

  return (
    <div>
      <HeaderAL isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} time={time} />
      <FullScreenMenuAL isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} navLinks={navLinks} navRoutes={navRoutes} />
      <div className="bg-slate-900 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-6 pt-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100">
            Roof Mapping + AI Recommendation
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto">
            Draw a polygon on the map to mark your roof area. Our AI will
            recommend the best rainwater harvesting structure for you.
          </p>
        </div>
        <RoofMapper />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div>
            <RecommendationCard data={userData} />
          </div>
          <div className="flex flex-col gap-6 h-full">
            <div className="flex-1">
              <RoiPreviewCard data={userData} />
            </div>
            <div className="flex-1">
              {/* ✅ Access gwl from the first element of the array */}
              <GroundwaterLevelCard 
                level={userData && Array.isArray(userData) && userData.length > 0 ? userData[0].gwl : null} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}