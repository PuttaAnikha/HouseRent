import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiActivity, FiNavigation, FiBookOpen, FiShield, FiBriefcase, FiMapPin, FiInfo } from 'react-icons/fi';

const MarketInsights = () => {
  const [selectedCity, setSelectedCity] = useState('Hyderabad');

  // Hardcoded premium market statistical data for Indian metros
  const cityData = {
    Hyderabad: {
      appreciationRate: '11.2% YoY',
      rentalYield: '4.8%',
      investmentRating: 'A+ (Strong Buy)',
      forecast: 'High tech sector growth in Gachibowli and Hitec City continues to drive rent prices up. Residential appreciation is projected to grow by 12% in the next 12 months.',
      chartData: [
        { year: '2022', avgRent: 1050, rentalYield: 4.1 },
        { year: '2023', avgRent: 1200, rentalYield: 4.3 },
        { year: '2024', avgRent: 1380, rentalYield: 4.5 },
        { year: '2025', avgRent: 1550, rentalYield: 4.6 },
        { year: '2026', avgRent: 1700, rentalYield: 4.8 }
      ],
      neighbourhoods: [
        { name: 'Gachibowli', schools: '9.2/10', safety: '9.0/10', transport: '8.5/10', amenities: '9.0/10', appreciation: '12.5%', score: 'A++' },
        { name: 'Jubilee Hills', schools: '9.8/10', safety: '9.5/10', transport: '7.5/10', amenities: '9.8/10', appreciation: '9.0%', score: 'A' },
        { name: 'Hitec City', schools: '9.0/10', safety: '8.8/10', transport: '9.0/10', amenities: '9.2/10', appreciation: '13.0%', score: 'A++' },
        { name: 'Madhapur', schools: '8.8/10', safety: '8.5/10', transport: '8.5/10', amenities: '8.8/10', appreciation: '11.8%', score: 'A+' }
      ]
    },
    Mumbai: {
      appreciationRate: '9.8% YoY',
      rentalYield: '3.2%',
      investmentRating: 'A (Steady Accumulate)',
      forecast: 'Bandra and Worli show premium price stability. Infrastructure additions like trans-harbour link and new metro routes are boosting property demand in suburban areas.',
      chartData: [
        { year: '2022', avgRent: 2000, rentalYield: 2.8 },
        { year: '2023', avgRent: 2200, rentalYield: 3.0 },
        { year: '2024', avgRent: 2450, rentalYield: 3.1 },
        { year: '2025', avgRent: 2700, rentalYield: 3.2 },
        { year: '2026', avgRent: 2950, rentalYield: 3.2 }
      ],
      neighbourhoods: [
        { name: 'Bandra West', schools: '9.6/10', safety: '9.4/10', transport: '8.5/10', amenities: '9.8/10', appreciation: '8.5%', score: 'A' },
        { name: 'Andheri West', schools: '8.8/10', safety: '8.5/10', transport: '9.2/10', amenities: '9.0/10', appreciation: '10.5%', score: 'A+' },
        { name: 'Worli', schools: '9.2/10', safety: '9.2/10', transport: '8.0/10', amenities: '9.5/10', appreciation: '9.0%', score: 'A' },
        { name: 'Powai', schools: '9.0/10', safety: '8.9/10', transport: '7.8/10', amenities: '9.2/10', appreciation: '11.0%', score: 'A+' }
      ]
    },
    Bengaluru: {
      appreciationRate: '11.5% YoY',
      rentalYield: '5.2%',
      investmentRating: 'A++ (Strong Buy / Market Leader)',
      forecast: 'Bengaluru commands the highest rental yields in major Indian metros. Outer Ring Road and Whitefield areas remain hot due to continuous tech park hiring and commercial growth.',
      chartData: [
        { year: '2022', avgRent: 1200, rentalYield: 4.5 },
        { year: '2023', avgRent: 1400, rentalYield: 4.8 },
        { year: '2024', avgRent: 1650, rentalYield: 5.0 },
        { year: '2025', avgRent: 1900, rentalYield: 5.1 },
        { year: '2026', avgRent: 2150, rentalYield: 5.2 }
      ],
      neighbourhoods: [
        { name: 'Whitefield', schools: '9.0/10', safety: '8.8/10', transport: '7.5/10', amenities: '9.0/10', appreciation: '14.0%', score: 'A++' },
        { name: 'Indiranagar', schools: '9.6/10', safety: '9.2/10', transport: '8.8/10', amenities: '9.8/10', appreciation: '7.5%', score: 'A-' },
        { name: 'Koramangala', schools: '9.2/10', safety: '9.0/10', transport: '8.5/10', amenities: '9.6/10', appreciation: '9.5%', score: 'A' },
        { name: 'Sarjapur Road', schools: '9.0/10', safety: '8.5/10', transport: '8.0/10', amenities: '8.8/10', appreciation: '12.8%', score: 'A+' }
      ]
    },
    Delhi: {
      appreciationRate: '9.2% YoY',
      rentalYield: '3.9%',
      investmentRating: 'A- (Moderate Hold)',
      forecast: 'Premium South Delhi sectors like Vasant Kunj show consistent growth. Metro extension routes are pushing prices up in surrounding residential sub-markets and Dwarka sectors.',
      chartData: [
        { year: '2022', avgRent: 1100, rentalYield: 3.5 },
        { year: '2023', avgRent: 1250, rentalYield: 3.6 },
        { year: '2024', avgRent: 1400, rentalYield: 3.8 },
        { year: '2025', avgRent: 1550, rentalYield: 3.9 },
        { year: '2026', avgRent: 1680, rentalYield: 3.9 }
      ],
      neighbourhoods: [
        { name: 'Vasant Kunj', schools: '9.4/10', safety: '9.0/10', transport: '8.0/10', amenities: '9.2/10', appreciation: '8.8%', score: 'A' },
        { name: 'Saket', schools: '9.2/10', safety: '8.8/10', transport: '8.8/10', amenities: '9.4/10', appreciation: '9.2%', score: 'A' },
        { name: 'Dwarka', schools: '8.5/10', safety: '8.0/10', transport: '8.8/10', amenities: '8.5/10', appreciation: '11.2%', score: 'A+' },
        { name: 'Greater Kailash', schools: '9.5/10', safety: '9.2/10', transport: '7.8/10', amenities: '9.5/10', appreciation: '8.0%', score: 'A' }
      ]
    }
  };

  const activeData = cityData[selectedCity];

  return (
    <div className="min-h-screen bg-bgLight py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-dark-800 tracking-tight sm:text-4xl">
              Market Insights &amp; Neighbourhood Trends
            </h1>
            <p className="mt-2 text-dark-400 font-semibold text-sm">
              Verify price appreciation curves, local school safety, and investment potential metrics.
            </p>
          </div>
          
          {/* City Selection dropdown */}
          <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-dark-100 shadow-sm self-start">
            <FiMapPin className="text-primary-500 text-lg" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-sm font-bold text-dark-700 focus:outline-none cursor-pointer bg-white"
            >
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
        </div>

        {/* Investment and Yield Card Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-500 flex items-center justify-center text-2xl">
              <FiTrendingUp />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Yearly Appreciation</span>
              <span className="text-2xl font-extrabold text-dark-800">{activeData.appreciationRate}</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-500 flex items-center justify-center text-2xl">
              <FiActivity />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Average Rental Yield</span>
              <span className="text-2xl font-extrabold text-dark-800">{activeData.rentalYield}</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-accent-100 text-accent-600 flex items-center justify-center text-2xl">
              <FiBriefcase />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Investment Rating</span>
              <span className="text-2xl font-extrabold text-dark-800">{activeData.investmentRating}</span>
            </div>
          </div>
        </div>

        {/* Main Charts & Analysis row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rent Price Trends Line Graph */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-6 sm:p-8 border border-dark-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-dark-50 pb-4">
              <h2 className="text-lg font-extrabold text-dark-800 tracking-tight flex items-center space-x-2">
                <FiTrendingUp className="text-primary-500" />
                <span>Price Index Trend (Average Rent / Month)</span>
              </h2>
              <span className="text-xs font-bold text-primary-500 px-3 py-1 bg-primary-50 rounded-full">
                {selectedCity} Index
              </span>
            </div>
            
            <div className="h-[300px] w-full text-xs font-semibold">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" unit="$" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                  />
                  <Line type="monotone" dataKey="avgRent" name="Avg Rent ($)" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="rentalYield" name="Yield %" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Investment & Forecast Narrative */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-dark-100 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-dark-800 uppercase tracking-wider flex items-center space-x-2">
              <FiInfo className="text-primary-500" />
              <span>Investment Potential</span>
            </h3>
            <p className="text-dark-500 text-sm leading-relaxed font-medium">
              {activeData.forecast}
            </p>
            <div className="border-t border-dark-100 pt-4 mt-2">
              <span className="text-xs font-bold text-dark-400 block mb-2 uppercase">Key Recommendation</span>
              <span className="px-4 py-2 rounded-xl bg-accent-50 text-accent-700 font-extrabold text-xs inline-block border border-accent-100">
                ✨ Buy underappreciated residential sectors
              </span>
            </div>
          </div>
        </div>

        {/* Neighbourhood Insights Table */}
        <div className="bg-white rounded-[2.5rem] border border-dark-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-dark-100 bg-white">
            <h2 className="text-lg font-extrabold text-dark-800 tracking-tight">
              {selectedCity} Neighbourhood Metrics
            </h2>
            <p className="text-xs text-dark-400 font-semibold mt-1">
              Comparison scorecard of local school scores, transit facilities, and crime rate factors.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-dark-50 text-dark-500 font-bold uppercase text-[10px] tracking-wider border-b border-dark-100">
                  <th className="py-4 px-6">Neighbourhood</th>
                  <th className="py-4 px-6 flex items-center space-x-1"><FiBookOpen className="text-primary-400" /> <span>Schools Rating</span></th>
                  <th className="py-4 px-6"><div className="flex items-center space-x-1"><FiShield className="text-primary-400" /> <span>Safety Score</span></div></th>
                  <th className="py-4 px-6"><div className="flex items-center space-x-1"><FiNavigation className="text-primary-400" /> <span>Transport</span></div></th>
                  <th className="py-4 px-6">Appreciation (YoY)</th>
                  <th className="py-4 px-6 text-center">ROI Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50 font-medium text-dark-700">
                {activeData.neighbourhoods.map((n) => (
                  <tr key={n.name} className="hover:bg-dark-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-dark-850">{n.name}</td>
                    <td className="py-4 px-6 text-dark-600">{n.schools}</td>
                    <td className="py-4 px-6 text-dark-600">{n.safety}</td>
                    <td className="py-4 px-6 text-dark-600">{n.transport}</td>
                    <td className="py-4 px-6 text-green-600 font-bold">{n.appreciation}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                        n.score === 'A++' 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : n.score === 'A+' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-accent-50 border-accent-200 text-accent-700'
                      }`}>
                        {n.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketInsights;
