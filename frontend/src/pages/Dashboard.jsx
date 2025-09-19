import React, { useState, useEffect, useCallback } from "react";
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
  const roofArea = 150; // Default roof area value
  const [chartData, setChartData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [totalRainfall, setTotalRainfall] = useState("0");
  const [locationName, setLocationName] = useState("Bangalore");
  const [searchQuery, setSearchQuery] = useState("Bangalore");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newLocation = locationName;
    if (newLocation.trim() !== "") {
      setSearchQuery(newLocation);
    }
  };

  // Weather data fetch function - wrapped in useCallback to prevent unnecessary re-renders
  const fetchLocationAndWeather = useCallback(
    async (location, currentUserData) => {
      if (!location) return;

      console.log("🔍 Searching for location:", location);
      console.log("📊 Current user data:", currentUserData);

      setIsWeatherLoading(true);
      try {
        let newLat, newLon;

        // Check if we have coordinates from userData AND we're using the district from userData
        if (
          currentUserData &&
          currentUserData[0] &&
          currentUserData[0].latitude &&
          currentUserData[0].longitude &&
          currentUserData[0].district &&
          location === currentUserData[0].district
        ) {
          console.log(
            "📍 Using coordinates from userData for district:",
            currentUserData[0].district
          );
          newLat = currentUserData[0].latitude;
          newLon = currentUserData[0].longitude;
          console.log(`🎯 Coordinates: ${newLat}, ${newLon}`);
        } else {
          // Use geocoding for manual searches or when no coordinates in userData
          console.log("🔍 Using geocoding for location search:", location);

          // Step 1: Geocoding - try multiple formats
          let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            location
          )}&count=1`;
          console.log("🌍 Geocoding URL:", geoUrl);

          const geoResponse = await fetch(geoUrl);
          const geoData = await geoResponse.json();

          console.log("📍 Geocoding response:", geoData);

          if (
            !geoResponse.ok ||
            !geoData.results ||
            geoData.results.length === 0
          ) {
            // Try with ", India" appended if first search fails
            const locationWithCountry = `${location}, India`;
            console.log("🔄 Retrying with:", locationWithCountry);

            geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              locationWithCountry
            )}&count=1`;
            const retryResponse = await fetch(geoUrl);
            const retryData = await retryResponse.json();

            console.log("🔄 Retry response:", retryData);

            if (
              !retryResponse.ok ||
              !retryData.results ||
              retryData.results.length === 0
            ) {
              throw new Error(
                `Location "${location}" not found. Please try a more specific location.`
              );
            }

            // Use retry data if successful
            geoData.results = retryData.results;
          }
          newLat = geoData.results[0].latitude;
          newLon = geoData.results[0].longitude;
        }

        // Step 2: Fetch historical data
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

        // Step 3: Process data for charts and stats
        const monthlyRainfall = {};
        let total = 0;
        if (
          historicalData.daily &&
          historicalData.daily.time &&
          historicalData.daily.precipitation_sum
        ) {
          historicalData.daily.time.forEach((dateString, index) => {
            const date = new Date(dateString);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // Use year and month as a key
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

        const newChartData = Object.keys(monthlyRainfall).map((key) => {
          const data = monthlyRainfall[key];
          const precipitation = data.totalPrecipitation;
          // Use user's roof area if available, otherwise default to 150
          const currentRoofArea =
            currentUserData && currentUserData[0]
              ? currentUserData[0].area
              : 150;
          const storageCapacity =
            currentUserData && currentUserData[0]
              ? currentUserData[0].structure_capacity_liters
              : 10500;

          // Calculate potential runoff for the month
          const monthlyRunoff = precipitation * currentRoofArea * 0.85; // 85% efficiency factor

          // Realistic water saved is limited by storage capacity
          const realisticWaterSaved = Math.min(monthlyRunoff, storageCapacity);

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

        // Step 4: Fetch forecast for alerts
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${newLat}&longitude=${newLon}&daily=precipitation_sum&timezone=auto`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        const todayPrecipitation =
          forecastData.daily?.precipitation_sum[0] || 0;
        const newAlertsData = [];

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
        setAlertsData(newAlertsData);
      } catch (error) {
        console.error("❌ Weather fetch error:", error.message);
        console.error("📍 Failed location:", location);
        setChartData([]);
        setTotalRainfall("N/A");
        setAlertsData([
          {
            color: "red",
            title: "Location Error",
            subtitle: `Cannot find weather data for "${location}". Try a different location or check spelling.`,
          },
        ]);
      } finally {
        setIsWeatherLoading(false);
      }
    },
    []
  ); // Empty dependency array since we pass parameters directly

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  console.log("User Data:", userData);

  // Process userData when it's available and set initial location
  useEffect(() => {
    if (userData && Array.isArray(userData) && userData.length > 0) {
      const recommendation = userData[0];
      console.log("🏠 User recommendation:", recommendation);
      if (recommendation && recommendation.district) {
        const newLocation = recommendation.district;
        console.log("📍 Setting location to:", newLocation);
        setLocationName(newLocation);
        setSearchQuery(newLocation);
      } else {
        console.log("⚠️ No district found in recommendation");
      }
    }
  }, [userData]);

  // Weather data fetch effect - simplified dependencies
  useEffect(() => {
    if (searchQuery) {
      fetchLocationAndWeather(searchQuery, userData);
    }
  }, [searchQuery, fetchLocationAndWeather, userData]);

  // Time update effect
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

  // Show loader when initially loading user data or weather data
  if ((isLoadingData && !userData) || isWeatherLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-950">
        <Loader className="size-10 animate-spin text-white" />
      </div>
    );
  }

  // Get user data for stats
  const userRecommendation = userData && userData[0] ? userData[0] : null;

  const statCardsData = [
    {
      title: "Roof Area (m²)",
      value: userRecommendation
        ? Math.round(userRecommendation.area)
        : roofArea,
    },
    {
      title: "Water Saved (Liters)",
      value: userRecommendation
        ? userRecommendation.structure_capacity_liters.toLocaleString()
        : totalRainfall,
    },
    {
      title: "Groundwater Level (m)",
      value: userRecommendation ? userRecommendation.gwl : "N/A",
    },
    {
      title: "Savings (₹)",
      value: userRecommendation
        ? userRecommendation.annual_savings_inr.toLocaleString()
        : "1,200",
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
              disabled={isWeatherLoading}
            >
              {isWeatherLoading ? "Loading..." : "Search"}
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
