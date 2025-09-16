<<<<<<< Updated upstream
import React from 'react';
// At the top of your file
import Logo from '../assets/Logo.png'; // adjust the path if needed
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import NavbarAL from '../components/NavbarAL';
=======
import React, { useState, useEffect } from 'react';
import DashboardContent from './DashboardContent';
import DashboardActions from './DashboardActions';
>>>>>>> Stashed changes

export default function Dashboard() {
    const [chartData, setChartData] = useState([]);
    const [alertsData, setAlertsData] = useState([]);
    const [totalRainfall, setTotalRainfall] = useState('0');
    const [locationName, setLocationName] = useState('Bangalore');
    const [searchQuery, setSearchQuery] = useState('Bangalore');
    const roofArea = 150;

<<<<<<< Updated upstream
// --- SVG ICONS ---
// Using inline SVGs to keep it a single file component. In a real app, you'd use an icon library like lucide-react.
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
);

const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const LandmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <line x1="3" y1="22" x2="21" y2="22"></line>
        <line x1="6" y1="18" x2="6" y2="11"></line>
        <line x1="10" y1="18" x2="10" y2="11"></line>
        <line x1="14" y1="18" x2="14" y2="11"></line>
        <line x1="18" y1="18" x2="18" y2="11"></line>
        <polygon points="12 2 20 7 4 7"></polygon>
    </svg>
);

const WaterDropIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7z"></path>
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-500">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const statCardsData = [
    { title: 'Roof Area (m²)', value: '150' },
    { title: 'Water Saved (Liters)', value: '25,000' },
    { title: 'Tank Level (%)', value: '85' },
    { title: 'Savings (₹)', value: '1,200' },
];

const alertsData = [
    {
        icon: <WaterDropIcon />,
        color: 'blue',
        title: 'Prepare for the upcoming monsoon season',
        subtitle: 'Pre-Rain Alert',
    },
    {
        icon: <CheckCircleIcon />,
        color: 'green',
        title: 'Rainwater harvesting system is active',
        subtitle: 'Post-Rain Alert',
    }
];

// --- SUB-COMPONENTS ---
// const Header = () => (
//     <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white border-b shadow-sm">
// <div className="flex items-center space-x-2">
//     <img src={Logo} alt="JalSetu Logo" className="h-8 w-8 object-contain" />
//     <h1 className="text-xl font-bold text-gray-800">JalSetu 2.0</h1>
// </div>
//         <div className="flex items-center space-x-4">
//             <div className="relative">
//                 <BellIcon />
//                 <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
//             </div>
//             <img 
//                 className="h-9 w-9 rounded-full"
//                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=40&h=40&auto=format&fit=crop" 
//                 alt="User Avatar"
//             />
//         </div>
//     </header>
// );


const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

const WaterSavedChart = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Water Saved Over Time</h3>
        <div className="flex items-baseline space-x-3 mb-4">
            <p className="text-4xl font-bold text-gray-900">25,000 <span className="text-2xl font-medium text-gray-600">Liters</span></p>
            <p className="text-sm text-green-500 font-medium">Last 12 Months +15%</p>
        </div>
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={false} axisLine={false} tickLine={false} domain={['dataMin - 500', 'dataMax + 500']}/>
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid #e5e7eb'
                        }}
                        labelStyle={{ fontWeight: 'bold' }}
                        formatter={(value) => [`${value.toLocaleString()} Liters`, 'Water Saved']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const AlertItem = ({ icon, color, title, subtitle }) => {
    const colorClasses = {
        blue: 'bg-blue-100',
        green: 'bg-green-100',
=======
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const newLocation = locationName;
        if (newLocation.trim() !== '') {
            setSearchQuery(newLocation);
        }
>>>>>>> Stashed changes
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
        <div className="min-h-screen font-sans text-slate-50 bg-blue-950 bg-gradient-to-tr from-blue-900 via-blue-950 to-blue-950">
            <main className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-slate-50 mb-6">Dashboard</h2>
                
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
<<<<<<< Updated upstream
};


const Alerts = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Alerts</h3>
        {alertsData.map((alert, index) => (
            <AlertItem key={index} {...alert} />
        ))}
    </div>
);


const ActionButton = ({ icon, text }) => (
    <button className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
       {icon} {text}
    </button>
);


// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900">
    <NavbarAL/>
    <main className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statCardsData.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>

        {/* Main Content: Chart and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <WaterSavedChart />
          </div>
          <div>
            <Alerts />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ActionButton icon={<MapIcon />} text="Map Roof" />
            <ActionButton icon={<TrendingUpIcon />} text="Check ROI" />
            <ActionButton icon={<LandmarkIcon />} text="Govt Schemes" />
        </div>
      </main>
    </div>
  );
}



=======
}
>>>>>>> Stashed changes
