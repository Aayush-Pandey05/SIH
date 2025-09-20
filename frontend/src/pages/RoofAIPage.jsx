import React, {  useEffect } from "react";
import RoofMapper from "../components/RoofMapper";
import { Droplet, TrendingUp, RulerDimensionLine } from "lucide-react";
import rechargePitImage from "../assets/recharge_pit.png";
import { useDataStore } from "../store/useDataStore";
import HeaderAL from "../components/HeaderAL";
import { useTranslation } from "react-i18next";
// Helper function to parse dimensions string and calculate volume
const parseDimensionsAndCalculateVolume = (dimensionsString) => {
  if (!dimensionsString || typeof dimensionsString !== "string") {
    return {
      volume: null,
      width: null,
      depth: null,
      length: null,
      formattedString: "N/A",
    };
  }

  try {
    // Extract numbers from the string using regex
    const numbers = dimensionsString.match(/[\d.]+/g);

    if (!numbers || numbers.length < 3) {
      return {
        volume: null,
        width: null,
        depth: null,
        length: null,
        formattedString: dimensionsString,
      };
    }

    const width = parseFloat(numbers[0]);
    const depth = parseFloat(numbers[1]);
    const length = parseFloat(numbers[2]);

    // Calculate volume
    const volume = width * depth * length;

    return {
      volume: Math.round(volume * 100) / 100, 
      width,
      depth,
      length,
      formattedString: `${width}m × ${depth}m × ${length}m`,
    };
  } catch (error) {
    console.error("Error parsing dimensions:", error);
    return {
      volume: null,
      width: null,
      depth: null,
      length: null,
      formattedString: dimensionsString,
    };
  }
};

const RecommendationCard = ({ data }) => {
  const { t, i18n } = useTranslation();
  if (!data || !Array.isArray(data) || data.length === 0) return null;

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
        {t('mapRoofPage.recommendation.title')}
      </h2>
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-full">
        <img
          src={rechargePitImage}
          alt={`Recommended Structure: ${
            recommendation.structure_type || "N/A"
          }`}
          className="w-full object-cover rounded-md mb-4"
        />
               <h3 className="text-lg font-semibold text-slate-900">
          {t('mapRoofPage.recommendation.structureTitle')}{" "}
          <span className="text-blue-600">
            {recommendation.structure_type || t('mapRoofPage.general.notAvailable')}
          </span>
        </h3>
        <p className="text-sm text-slate-600 mt-2 mb-4">
          {recommendation.ai_recommendation || t('mapRoofPage.recommendation.noRecommendation')}
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-slate-700 border-t border-slate-200 pt-4 gap-2">
          <div className="flex items-center">
            <RupeeIcon className="w-4 h-4 mr-2 text-slate-500" />
            <span>
              {t('mapRoofPage.recommendation.costLabel')} ₹
              {recommendation.estimated_cost_inr?.toLocaleString(i18n.language) || t('mapRoofPage.general.notAvailable')}
            </span>
          </div>
          <div className="flex items-center">
            <DropletIcon className="w-4 h-4 mr-2 text-slate-500" />
            <span>
              {t('mapRoofPage.recommendation.capacityLabel')}{" "}
              {recommendation.structure_capacity_liters?.toLocaleString(i18n.language) || t('mapRoofPage.general.notAvailable')}{" "}
              {t('mapRoofPage.recommendation.capacityUnit')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroundwaterLevelCard = ({ level }) => {
  const { t } = useTranslation();
  if (level === undefined || level === null) return null;

  return (
    <div className="groundwater-section ">
      <h2 className="text-xl font-bold text-slate-200 flex items-center mb-5">
        <Droplet className="w-6 h-6 mr-3 text-blue-400" />
        {t('mapRoofPage.groundwater.title')}
      </h2>
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 py-8 rounded-xl border border-slate-700 shadow-lg flex flex-col gap-6">
        <p className="text-sm text-slate-400">{t('mapRoofPage.groundwater.subtitle')}</p>
        <p className="text-2xl sm:text-3xl font-bold text-blue-400">
          {level} {t('mapRoofPage.groundwater.unit')}
        </p>
      </div>
    </div>
  );
};

const DimensionsCard = ({ dimensionsData }) => {
  const { t } = useTranslation();
  if (!dimensionsData || (!dimensionsData.volume && !dimensionsData.formattedString))
    return null;

  return (
    <div className="dimension-section ">
      <h2 className="text-xl font-bold text-slate-200 flex items-center mb-5">
        <RulerDimensionLine className="w-6 h-6 mr-3 text-blue-400" />
        {t('mapRoofPage.dimensions.title')}
      </h2>
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 py-8 rounded-xl border border-slate-700 shadow-lg flex flex-col gap-4">
        <div>
          <p className="text-sm text-slate-400">{t('mapRoofPage.dimensions.dimensionsLabel')}</p>
          <p className="text-lg sm:text-xl font-bold text-blue-400">
            {dimensionsData.formattedString}
          </p>
        </div>
        {dimensionsData.volume && (
          <div>
            <p className="text-sm text-slate-400">{t('mapRoofPage.dimensions.volumeLabel')}</p>
            <p className="text-2xl sm:text-3xl font-bold text-cyan-400">
              {dimensionsData.volume} {t('mapRoofPage.dimensions.volumeUnit')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const RoiPreviewCard = ({ data }) => {
  const { t, i18n } = useTranslation();
  if (!data || !Array.isArray(data) || data.length === 0) return null;
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
        {t('mapRoofPage.roi.title')}
      </h2>
      <div className="bg-slate-800/50 backdrop-blur-sm p-6 py-12 rounded-xl border border-slate-700 shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <p className="text-sm text-slate-500">{t('mapRoofPage.roi.savingsLabel')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            ₹
            {roiData.annual_savings_inr?.toLocaleString(i18n.language) || t('mapRoofPage.general.notAvailable')}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-slate-500">{t('mapRoofPage.roi.paybackLabel')}</p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600">
            {roiData.payback_period_years || t('mapRoofPage.general.notAvailable')} {t('mapRoofPage.roi.paybackUnit')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function JalSetuPage() {
  const { fetchUserData, isLoadingData, userData } = useDataStore();
  const { t } = useTranslation();
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  console.log({ userData });

  // Parse dimensions from user data
  const dimensionsData =
    userData && Array.isArray(userData) && userData.length > 0
      ? parseDimensionsAndCalculateVolume(userData[0].structure_dimensions)
      : null;

 if (isLoadingData) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-300">{t('mapRoofPage.loadingText')}</p>
      </div>
    );
  }

  return (
    <div>
      <HeaderAL/>
      <div className="bg-gradient-to-b from-slate-900 via-blue-950 to-black min-h-screen p-4 sm:p-6 md:p-8 font-sans">
        <div id="hero">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 pt-20">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-400">
                {t('mapRoofPage.pageTitle')}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto">
                {t('mapRoofPage.pageSubtitle')}
              </p>
            </div>
            <RoofMapper />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div>
            <RecommendationCard data={userData} />
          </div>
          <div className="flex flex-col gap-6 h-full">
            <div className="flex-1">
              <RoiPreviewCard data={userData} />
            </div>
            <div className="flex-1">
              <DimensionsCard dimensionsData={dimensionsData} />
            </div>
            <div className="flex-1">
              <GroundwaterLevelCard
                level={userData?.[0]?.gwl}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}