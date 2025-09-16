import React, { useState, useEffect } from 'react';
import DashboardContent from './DashboardContent';
import NavbarAL from '../components/NavbarAL';

export default function Dashboard() {
    const [chartData, setChartData] = useState([]);
    const [alertsData, setAlertsData] = useState([]);
    const [totalRainfall, setTotalRainfall] = useState('0');
    const [locationName, setLocationName] = useState('Bangalore');
    const [searchQuery, setSearchQuery] = useState('Bangalore');
    const roofArea = 150;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const newLocation = locationName;
        if (newLocation.trim() !== '') {
            setSearchQuery(newLocation);
        }
    };

    useEffect(() => {
        const fetchLocationAndWeather = async () => {
            try {
                // Step 1: Geocoding
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=1`;
                const geoResponse = await fetch(geoUrl);
                const geoData = await geoResponse.json();
                if (!geoResponse.ok || !geoData.results || geoData.results.length === 0) {
                    throw new Error("Location not found.");
                }
                const newLat = geoData.results[0].latitude;
                const newLon = geoData.results[0].longitude;

                // Step 2: Fetch historical data
                const endDate = new Date();
                const startDate = new Date();
                startDate.setFullYear(endDate.getFullYear() - 1);
                const historicalUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${newLat}&longitude=${newLon}&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&daily=precipitation_sum`;
                const historicalResponse = await fetch(historicalUrl);
                const historicalData = await historicalResponse.json();

                // Step 3: Process data for charts and stats
                const monthlyRainfall = {};
                let total = 0;
                if (historicalData.daily && historicalData.daily.time && historicalData.daily.precipitation_sum) {
                    historicalData.daily.time.forEach((dateString, index) => {
                        const date = new Date(dateString);
                        const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // Use year and month as a key
                        if (!monthlyRainfall[monthKey]) {
                            monthlyRainfall[monthKey] = {
                                totalPrecipitation: 0,
                                date: date,
                            };
                        }
                        monthlyRainfall[monthKey].totalPrecipitation += historicalData.daily.precipitation_sum[index];
                    });
                }

                const newChartData = Object.keys(monthlyRainfall).map(key => {
                    const data = monthlyRainfall[key];
                    const precipitation = data.totalPrecipitation;
                    total += precipitation * roofArea;
                    return {
                        name: data.date.toLocaleDateString('en-US', { month: 'short' }),
                        value: precipitation * roofArea,
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
                const todayPrecipitation = forecastData.daily?.precipitation_sum[0] || 0;
                const newAlertsData = [];

                const monsoonThreshold = 50000;
                if (total > monsoonThreshold && todayPrecipitation > 0) {
                    newAlertsData.push({ color: 'blue', title: 'Prepare for the upcoming monsoon season', subtitle: 'Pre-Rain Alert' });
                } else {
                    newAlertsData.push({ color: 'green', title: 'Rainwater harvesting system is active', subtitle: 'Post-Rain Alert' });
                }
                setAlertsData(newAlertsData);

            } catch (error) {
                console.error('Error:', error.message);
                setChartData([]);
                setTotalRainfall('N/A');
                setAlertsData([{ color: 'blue', title: 'Error', subtitle: error.message }]);
            }
        };
        fetchLocationAndWeather();
    }, [searchQuery]);

    const statCardsData = [
        { title: 'Roof Area (m²)', value: roofArea },
        { title: 'Water Saved (Liters)', value: totalRainfall },
        { title: 'Tank Level (%)', value: '85' },
        { title: 'Savings (₹)', value: '1,200' },
    ];

    return (
        <div className="min-h-screen font-sans text-slate-50 bg-blue-950 bg-gradient-to-tr from-blue-900 via-blue-950 to-blue-950 ">
            <NavbarAL />
            <main className="p-4 sm:p-6 lg:p-8 mt-18">
                <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
                    <input
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 p-2 shadow-sm text-gray-900 bg-slate-50"
                        placeholder="Enter city, state..."
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md shadow-sm">Search</button>
                </form>

                <DashboardContent 
                    statCardsData={statCardsData}
                    chartData={chartData}
                    totalRainfall={totalRainfall}
                    alertsData={alertsData}
                />
            </main>
        </div>
    );
};

