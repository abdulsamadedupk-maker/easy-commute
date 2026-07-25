import React, { useState } from 'react';
import { ImpactStats } from '../types';
import { Leaf, DollarSign, Car, Fuel, TreePine, Award, TrendingUp, Sparkles, ShieldCheck, BarChart2 } from 'lucide-react';

interface ImpactDashboardProps {
  stats: ImpactStats;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ stats }) => {
  // Calculator State
  const [commuteDistanceKm, setCommuteDistanceKm] = useState(25);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [carType, setCarType] = useState<'gas' | 'hybrid' | 'ev'>('gas');

  // Calculation Logic
  const weeklyKm = commuteDistanceKm * 2 * daysPerWeek; // round trip
  const monthlyKm = weeklyKm * 4.2;
  const yearlyKm = weeklyKm * 52;

  // Average gas car emissions: ~0.192 kg CO2 per km. Carpooling divides by 3.
  const soloCo2KgMonthly = Math.round(monthlyKm * 0.192);
  const carpoolCo2KgMonthly = Math.round(soloCo2KgMonthly * 0.35);
  const savedCo2KgMonthly = soloCo2KgMonthly - carpoolCo2KgMonthly;
  const savedCo2KgYearly = savedCo2KgMonthly * 12;

  // Average fuel cost in Pakistan: ~Rs. 18 per km solo.
  const soloCostMonthly = Math.round(monthlyKm * 18);
  const carpoolCostMonthly = Math.round(soloCostMonthly * 0.35);
  const savedDollarsMonthly = soloCostMonthly - carpoolCostMonthly;
  const savedDollarsYearly = savedDollarsMonthly * 12;

  const treesPlantedMonthly = Math.round((savedCo2KgMonthly / 22) * 10) / 10; // 1 tree absorbs ~22kg CO2/year

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs mb-3 border border-emerald-400/30">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Community Carbon Reduction Impact</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white mb-2">
            Every Shared Seat Heals the Planet
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            By sharing daily commutes instead of driving solo, Easy Commute users eliminate tons of greenhouse gases and reduce city traffic congestion every single day.
          </p>
        </div>
      </div>

      {/* Global Community Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CO2 Saved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              +14% this month
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
            {stats.totalCo2SavedKg.toLocaleString()} <span className="text-sm font-semibold text-slate-500">kg</span>
          </span>
          <p className="text-xs text-slate-500 font-medium mt-1">Total CO₂ Emissions Avoided</p>
        </div>

        {/* Money Saved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5 text-teal-600" />
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              Fuel & Tolls
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
            Rs. {stats.totalMoneySavedDollars.toLocaleString()}
          </span>
          <p className="text-xs text-slate-500 font-medium mt-1">Commuter Money Saved</p>
        </div>

        {/* Fuel Saved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Fuel className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Energy Conserved
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
            {stats.totalFuelSavedLiters.toLocaleString()} <span className="text-sm font-semibold text-slate-500">Liters</span>
          </span>
          <p className="text-xs text-slate-500 font-medium mt-1">Gasoline Saved</p>
        </div>

        {/* Trees Equivalent */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <TreePine className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              Forest Equivalent
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
            {stats.treesEquivalent.toLocaleString()} <span className="text-sm font-semibold text-slate-500">Trees</span>
          </span>
          <p className="text-xs text-slate-500 font-medium mt-1">Annual Tree Absorption Equivalent</p>
        </div>

      </div>

      {/* Interactive Carbon & Savings Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Personal Commute Savings Calculator</h2>
            <p className="text-xs text-slate-500">Calculate how much money and CO₂ you will save by switching to Easy Commute</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          
          {/* Controls */}
          <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            
            {/* Distance Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-800">
                <span>One-Way Commute Distance:</span>
                <span className="text-emerald-700 text-sm font-black">{commuteDistanceKm} km</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={commuteDistanceKm}
                onChange={(e) => setCommuteDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>5 km (Local)</span>
                <span>50 km (Suburban)</span>
                <span>100 km (Intercity)</span>
              </div>
            </div>

            {/* Days per week */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-800">
                <span>Days Commuting Per Week:</span>
                <span className="text-emerald-700 text-sm font-black">{daysPerWeek} days / week</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDaysPerWeek(d)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      daysPerWeek === d
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {d} {d === 1 ? 'Day' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Comparison Box */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Your Projected Commuter Savings
              </span>
              <h3 className="text-2xl font-black text-white mb-4">
                Save <span className="text-emerald-400">Rs. {savedDollarsYearly.toLocaleString()}</span> & <span className="text-teal-300">{savedCo2KgYearly.toLocaleString()} kg CO₂</span> per year!
              </h3>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Monthly Money Saved</span>
                  <span className="text-2xl font-black text-emerald-400">Rs. {savedDollarsMonthly.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">vs solo driving fuel & parking</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-medium">Monthly CO₂ Avoided</span>
                  <span className="text-2xl font-black text-teal-300">{savedCo2KgMonthly} kg</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">≈ {treesPlantedMonthly} trees planted / mo</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Easy Commute Smart Carpooling
              </span>
              <span className="font-mono text-[11px] text-slate-400">Based on standard EPA fuel averages</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
