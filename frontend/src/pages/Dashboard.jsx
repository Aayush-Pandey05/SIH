import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import DashboardContent from "./DashboardContent";
import HeaderAL from "../components/HeaderAL";
import { Loader } from "lucide-react";
import { useDataStore } from "../store/useDataStore";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { fetchUserData, userData, isLoadingData } = useDataStore();
  
  const [chartData, setChartData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [totalRainfall, setTotalRainfall] = useState("0");
  const [locationName, setLocationName] = useState(t('dashboard.initialLocation'));
  const [searchQuery, setSearchQuery] = useState(t('dashboard.initialLocation'));
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newLocation = locationName;
    if (newLocation.trim() !== "") {
      setSearchQuery(newLocation);
    }
  };

  const fetchLocationAndWeather = useCallback(
    async (location, currentUserData) => {
      if (!location) return;
      setIsWeatherLoading(true);
      try {
        let newLat, newLon;

        if (
          currentUserData &&
          currentUserData[0]?.latitude &&
          currentUserData[0]?.longitude &&
          currentUserData[0]?.district &&
          location === currentUserData[0].district
        ) {
          newLat = currentUserData[0].latitude;
          newLon = currentUserData[0].longitude;
        } else {
          let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
          let geoResponse = await fetch(geoUrl);
          let geoData = await geoResponse.json();

          if (!geoResponse.ok || !geoData.results || geoData.results.length === 0) {
            const locationWithCountry = `${location}, India`;
            geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationWithCountry)}&count=1`;
            const retryResponse = await fetch(geoUrl);
            const retryData = await retryResponse.json();
            if (!retryResponse.ok || !retryData.results || retryData.results.length === 0) {
              throw new Error(t('dashboard.errors.locationNotFound', { location }));
            }
            geoData.results = retryData.results;
          }
          newLat = geoData.results[0].latitude;
          newLon = geoData.results[0].longitude;
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);
        const historicalUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${newLat}&longitude=${newLon}&start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}&daily=precipitation_sum`;
        const historicalResponse = await fetch(historicalUrl);
        const historicalData = await historicalResponse.json();

        const monthlyRainfall = {};
        let total = 0;
        if (historicalData.daily?.time && historicalData.daily?.precipitation_sum) {
          historicalData.daily.time.forEach((dateString, index) => {
            const date = new Date(dateString);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthlyRainfall[monthKey]) {
              monthlyRainfall[monthKey] = { totalPrecipitation: 0, date: date };
            }
            monthlyRainfall[monthKey].totalPrecipitation += historicalData.daily.precipitation_sum[index];
          });
        }

        const newChartData = Object.values(monthlyRainfall).map((data) => {
          const precipitation = data.totalPrecipitation;
          const currentRoofArea = currentUserData?.[0]?.area || 150;
          const storageCapacity = currentUserData?.[0]?.structure_capacity_liters || 10500;
          const monthlyRunoff = precipitation * currentRoofArea * 0.85;
          const realisticWaterSaved = Math.min(monthlyRunoff, storageCapacity);
          total += realisticWaterSaved;
          return {
            name: data.date.toLocaleDateString(i18n.language, { month: "short" }),
            value: Math.round(realisticWaterSaved),
            date: data.date,
          };
        });

        newChartData.sort((a, b) => a.date - b.date);
        setChartData(newChartData);
        setTotalRainfall(total.toLocaleString(i18n.language));

        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${newLat}&longitude=${newLon}&daily=precipitation_sum&timezone=auto`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        const todayPrecipitation = forecastData.daily?.precipitation_sum[0] || 0;
        
        const newAlertsData = [];
        const monsoonThreshold = 50000;
        if (total > monsoonThreshold && todayPrecipitation > 0) {
          newAlertsData.push({
            color: "blue",
            title: t('dashboard.alerts.monsoon.title'),
            subtitle: t('dashboard.alerts.monsoon.subtitle'),
          });
        } else {
          newAlertsData.push({
            color: "green",
            title: t('dashboard.alerts.active.title'),
            subtitle: t('dashboard.alerts.active.subtitle'),
          });
        }
        setAlertsData(newAlertsData);
      } catch (error) {
        console.error("❌ Weather fetch error:", error.message);
        setChartData([]);
        setTotalRainfall(t('dashboard.stats.notAvailable'));
        setAlertsData([
          {
            color: "red",
            title: t('dashboard.alerts.locationError.title'),
            subtitle: t('dashboard.alerts.locationError.subtitle', { location }),
          },
        ]);
      } finally {
        setIsWeatherLoading(false);
      }
    },
    [t, i18n.language]
  );

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userData?.[0]?.district) {
      const newLocation = userData[0].district;
      setLocationName(newLocation);
      setSearchQuery(newLocation);
    }
  }, [userData]);

  useEffect(() => {
    if (searchQuery) {
      fetchLocationAndWeather(searchQuery, userData);
    }
  }, [searchQuery, fetchLocationAndWeather, userData]);

  if ((isLoadingData && !userData) || (isWeatherLoading && chartData.length === 0)) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-950">
        <Loader className="size-10 animate-spin text-white" />
      </div>
    );
  }

  const userRecommendation = userData?.[0] || null;
  const statCardsData = [
    {
      title: t('dashboard.stats.roofArea'),
      value: userRecommendation ? Math.round(userRecommendation.area) : 150,
    },
    {
      title: t('dashboard.stats.waterSaved'),
      value: totalRainfall,
    },
    {
      title: t('dashboard.stats.gwl'),
      value: userRecommendation?.gwl || t('dashboard.stats.notAvailable'),
    },
    {
      title: t('dashboard.stats.savings'),
      value: userRecommendation ? userRecommendation.annual_savings_inr.toLocaleString(i18n.language) : "1,200",
    },
  ];

  return (
    <div>
      <HeaderAL/>
      <div className="min-h-screen overflow-x-hidden font-sans text-slate-50 bg-gradient-to-b from-slate-800 via-blue-950 to-black">
        <main className="p-12 sm:p-6 lg:p-8 pt-28">
          <form
            onSubmit={handleSearchSubmit}
            className="mt-22 mb-6 flex space-x-2"
          >
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 p-2 shadow-sm text-gray-900 bg-slate-50"
              placeholder={t('dashboard.search.placeholder')}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md shadow-sm"
              disabled={isWeatherLoading}
            >
              {isWeatherLoading ? t('dashboard.search.loadingButton') : t('dashboard.search.button')}
            </button>
          </form>

          <DashboardContent
            statCardsData={statCardsData}
            chartData={chartData}
            totalRainfall={totalRainfall}
            alertsData={alertsData}
          />
        </main>
      </div>
    </div>
  );
}