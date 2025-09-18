import React, { useState, useEffect } from "react";
import DashboardContent from "./DashboardContent";
import NavbarAL from "../components/NavbarAL";
import HeaderAL from "../components/HeaderAL";
import FullScreenMenuAL from "../components/FullScreenMenuAL";
import Footer from "../components/Footer";
import { Loader } from "lucide-react";
import { useDataStore } from "../store/useDataStore";

const navLinks = [
  "Home",
  "Dashboard",
  "Map Roof",
  "Government Schemes",
  "Support",
];
const navRoutes = ["/", "/dashboard", "/map-roof", "/govschemes", "/support"];

export default function Dashboard() {
  const { fetchUserData, userData, isLoadingData } = useDataStore();
  const [chartData, setChartData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [totalRainfall, setTotalRainfall] = useState("N/A");
  const [locationName, setLocationName] = useState("Bangalore");
  const [searchQuery, setSearchQuery] = useState("Bangalore");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newLocation = locationName;
    if (newLocation.trim() !== "") {
      setSearchQuery(newLocation);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userData && Array.isArray(userData) && userData.length > 0) {
      const recommendation = userData[0];
      if (recommendation && recommendation.district) {
        setLocationName(recommendation.district);
        setSearchQuery(recommendation.district);
      }
    }
  }, [userData]);

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };

    updateTime();
    const timerId = setInterval(updateTime, 60000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=1`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        if (
          !geoResponse.ok ||
          !geoData.results ||
          geoData.results.length === 0
        ) {
          throw new Error("Location not found.");
        }
        const newLat = geoData.results[0].latitude;
        const newLon = geoData.results[0].longitude;

        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);
        const historicalUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${newLat}&longitude=${newLon}&start_date=${
          startDate.toISOString().split("T")[0]
        }&end_date=${
          endDate.toISOString().split("T")[0]
        }&daily=precipitation_sum`;
        const historicalResponse = await fetch(historicalUrl);
        const historicalData = await historicalResponse.json();

        const monthlyRainfall = {};
        let total = 0;
        if (
          historicalData.daily &&
          historicalData.daily.time &&
          historicalData.daily.precipitation_sum
        ) {
          historicalData.daily.time.forEach((dateString, index) => {
            const date = new Date(dateString);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthlyRainfall[monthKey]) {
              monthlyRainfall[monthKey] = {
                totalPrecipitation: 0,
                date: date,
              };
            }
            monthlyRainfall[monthKey].totalPrecipitation +=
              historicalData.daily.precipitation_sum[index];
          });
        }

        const hasUserData = userData && userData[0];

        if (hasUserData) {
          const newChartData = Object.keys(monthlyRainfall).map((key) => {
            const data = monthlyRainfall[key];
            const precipitation = data.totalPrecipitation;
            const currentRoofArea = userData[0].area;
            const storageCapacity = userData[0].structure_capacity_liters;

            const monthlyRunoff = precipitation * currentRoofArea * 0.85;

            const realisticWaterSaved = Math.min(
              monthlyRunoff,
              storageCapacity
            );

            total += realisticWaterSaved;
            return {
              name: data.date.toLocaleDateString("en-US", { month: "short" }),
              value: Math.round(realisticWaterSaved),
              date: data.date,
            };
          });

          newChartData.sort((a, b) => a.date - b.date);
          setChartData(newChartData);
          setTotalRainfall(total.toLocaleString());
        } else {
          setChartData([]);
          setTotalRainfall("N/A");
        }

        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${newLat}&longitude=${newLon}&daily=precipitation_sum&timezone=auto`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        const todayPrecipitation =
          forecastData.daily?.precipitation_sum[0] || 0;

        const newAlertsData = [];
        if (hasUserData) {
          const monsoonThreshold = 50000;
          if (total > monsoonThreshold && todayPrecipitation > 0) {
            newAlertsData.push({
              color: "blue",
              title: "Prepare for the upcoming monsoon season",
              subtitle: "Pre-Rain Alert",
            });
          } else {
            newAlertsData.push({
              color: "green",
              title: "Rainwater harvesting system is active",
              subtitle: "Post-Rain Alert",
            });
          }
        } else {
          newAlertsData.push({
            color: "gray",
            title: "No user data available",
            subtitle: "Please configure your roof details",
          });
        }
        setAlertsData(newAlertsData);
      } catch (error) {
        console.error("Error:", error.message);
        setChartData([]);
        setTotalRainfall("N/A");
        setAlertsData([
          { color: "red", title: "Error", subtitle: error.message },
        ]);
      }
    };

    if (searchQuery) {
      fetchLocationAndWeather();
    }
  }, [searchQuery, userData]);

  if (isLoadingData && !userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-950">
        <Loader className="size-10 animate-spin text-white" />
      </div>
    );
  }

  const userRecommendation = userData && userData[0] ? userData[0] : null;

  const statCardsData = [
    {
      title: "Roof Area (m²)",
      value: userRecommendation ? Math.round(userRecommendation.area) : "N/A",
    },
    {
      title: "Water Saved (Liters)",
      value: userRecommendation
        ? userRecommendation.structure_capacity_liters.toLocaleString()
        : "N/A",
    },
    {
      title: "Groundwater Level (m)",
      value: userRecommendation ? userRecommendation.gwl : "N/A",
    },
    {
      title: "Savings (₹)",
      value: userRecommendation
        ? userRecommendation.annual_savings_inr.toLocaleString()
        : "N/A",
    },
  ];

  return (
    <div>
      <HeaderAL
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        time={time}
      />
      <FullScreenMenuAL
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        navLinks={navLinks}
        navRoutes={navRoutes}
      />
      <div className="h-full font-sans text-slate-50 bg-blue-950 bg-gradient-to-tr from-blue-900 via-blue-950 to-blue-950">
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
              placeholder="Enter city, state..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md shadow-sm"
            >
              Search
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
