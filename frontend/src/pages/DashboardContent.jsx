import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

const AlertItem = ({ color, title, subtitle }) => {
    const WaterDropIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7z"></path></svg>);
    const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-500"><path d="M22 11.08V12a10 10 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
    const icon = color === 'blue' ? <WaterDropIcon /> : <CheckCircleIcon />;
    const colorClasses = { blue: 'bg-blue-100', green: 'bg-green-100' };

    return (
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClasses[color] || 'bg-gray-100'}`}>{icon}</div>
            <div>
                <p className="font-semibold text-gray-800">{title}</p>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
        </div>
    );
};

const Alerts = ({ alertsData }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Alerts</h3>
        {alertsData.length > 0 ? alertsData.map((alert, index) => (
            <AlertItem key={index} {...alert} />
        )) : (<p className="text-gray-500">No active weather alerts.</p>)}
    </div>
);

const WaterSavedChart = ({ chartData, totalRainfall }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Water Saved Over Time</h3>
        <div className="flex items-baseline space-x-3 mb-4">
            <p className="text-4xl font-bold text-gray-900">{totalRainfall}<span className="text-2xl font-medium text-gray-600"> Liters</span></p>
            <p className="text-sm text-green-500 font-medium">Last 12 Months</p>
        </div>
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={false} axisLine={false} tickLine={false} domain={['dataMin', 'dataMax']} />
                    <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }} labelStyle={{ fontWeight: 'bold' }} formatter={(value) => [`${value.toLocaleString()} Liters`, 'Water Saved']} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default function DashboardContent({ statCardsData, chartData, totalRainfall, alertsData }) {
    return (
        <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {statCardsData.map((card, index) => (<StatCard key={index} {...card} />))}
            </div>
            
            {/* Main Content: Chart and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                    <WaterSavedChart chartData={chartData} totalRainfall={totalRainfall} />
                </div>
                <div>
                    <Alerts alertsData={alertsData} />
                </div>
            </div>
        </>
    );
}