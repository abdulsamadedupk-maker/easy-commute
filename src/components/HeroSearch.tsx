import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock, Users, Sparkles, Filter, Zap, ArrowRight, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { SearchQuery } from '../types';

interface HeroSearchProps {
  searchQuery: SearchQuery;
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
  onSearch: () => void;
  isLoadingSmartMatch: boolean;
  totalAvailableRidesCount: number;
}

const POPULAR_LOCATIONS = [
  'Bahria Town',
  'DHA Phase II',
  'Blue Area',
  'PWD Housing Society',
  'G-10 Markaz',
  'F-8 Markaz',
  'I-8 Markaz',
  'NUML Islamabad',
  'Commercial Market',
  'NUST H-12'
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  isLoadingSmartMatch,
  totalAvailableRidesCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleQuickLocationClick = (type: 'pickup' | 'destination', loc: string) => {
    if (type === 'pickup') {
      setSearchQuery((prev) => ({ ...prev, pickupLocation: loc }));
    } else {
      setSearchQuery((prev) => ({ ...prev, destination: loc }));
    }
  };

  const handleSwapLocations = () => {
    setSearchQuery((prev) => ({
      ...prev,
      pickupLocation: prev.destination,
      destination: prev.pickupLocation
    }));
  };

  return (
    <div className="bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8 border border-emerald-800/50">
      
      {/* Subtle Background Glow Accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Badge & Heading */}
      <div className="relative z-10 max-w-3xl mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>AI-Powered Smart Match Ride Sharing</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
          Share your daily commute. <span className="text-emerald-400 underline decoration-emerald-500/50 underline-offset-4">Cut costs & CO₂.</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Find drivers traveling your exact route. Enjoy minimal detour pickup, fair fuel cost sharing, and zero carbon guilt.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="relative z-10 bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          
          {/* Pickup Location */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-emerald-500 transition-all">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup Location
            </label>
            <input
              type="text"
              placeholder="e.g. Bahria Town"
              value={searchQuery.pickupLocation}
              onChange={(e) => setSearchQuery({ ...searchQuery, pickupLocation: e.target.value })}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-hidden placeholder-slate-400"
            />
          </div>

          {/* Destination */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-emerald-500 transition-all">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Destination
            </label>
            <input
              type="text"
              placeholder="e.g. Blue Area"
              value={searchQuery.destination}
              onChange={(e) => setSearchQuery({ ...searchQuery, destination: e.target.value })}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-hidden placeholder-slate-400"
            />
          </div>

          {/* Time & Date */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-emerald-500 transition-all">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Preferred Departure
            </label>
            <input
              type="time"
              value={searchQuery.travelTime}
              onChange={(e) => setSearchQuery({ ...searchQuery, travelTime: e.target.value })}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Seats Needed */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:border-emerald-500 transition-all">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 text-teal-600" /> Open Seats Needed
            </label>
            <select
              value={searchQuery.seatsNeeded}
              onChange={(e) => setSearchQuery({ ...searchQuery, seatsNeeded: Number(e.target.value) })}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              <option value={1}>1 Seat (Single Commuter)</option>
              <option value={2}>2 Seats (Pair)</option>
              <option value={3}>3 Seats (Group)</option>
            </select>
          </div>

        </div>

        {/* Quick Location Shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
          <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider mr-1">Popular Hubs:</span>
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                if (!searchQuery.pickupLocation) {
                  handleQuickLocationClick('pickup', loc);
                } else if (!searchQuery.destination) {
                  handleQuickLocationClick('destination', loc);
                } else {
                  handleQuickLocationClick('pickup', loc);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-medium transition-all border border-slate-200/60"
            >
              + {loc}
            </button>
          ))}
          {(searchQuery.pickupLocation || searchQuery.destination) && (
            <button
              onClick={handleSwapLocations}
              className="ml-auto px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 transition-all flex items-center gap-1"
            >
              ⇄ Swap Origin/Dest
            </button>
          )}
        </div>

        {/* Advanced Filters Drawer Toggle */}
        {showAdvanced && (
          <div className="pt-3 mb-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50/50 p-3 rounded-xl border-emerald-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Max Detour Tolerance</label>
              <select
                value={searchQuery.maxDetourMin}
                onChange={(e) => setSearchQuery({ ...searchQuery, maxDetourMin: Number(e.target.value) })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
              >
                <option value={5}>Up to +5 minutes detour</option>
                <option value={10}>Up to +10 minutes detour</option>
                <option value={15}>Up to +15 minutes detour</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Fuel Preference</label>
              <select
                value={searchQuery.fuelFilter}
                onChange={(e) => setSearchQuery({ ...searchQuery, fuelFilter: e.target.value as any })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
              >
                <option value="all">All Vehicles (EV, Hybrid & Gas)</option>
                <option value="EV">⚡ EV Zero-Emission Only</option>
                <option value="hybrid">🍃 Hybrid & EV Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Sort Results By</label>
              <select
                value={searchQuery.sortBy}
                onChange={(e) => setSearchQuery({ ...searchQuery, sortBy: e.target.value as any })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
              >
                <option value="smart_match">🤖 AI Smart Match Score</option>
                <option value="time">⏰ Departure Time</option>
                <option value="price">💵 Lowest Cost Per Seat (Rs.)</option>
                <option value="co2">🍃 Highest CO₂ Savings</option>
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            {showAdvanced ? 'Hide Advanced Filters' : 'More Filters & Detour Specs'}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onSearch}
              disabled={isLoadingSmartMatch}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
            >
              {isLoadingSmartMatch ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Calculating Smart Matches...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Run AI Smart Match ({totalAvailableRidesCount} Rides)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
