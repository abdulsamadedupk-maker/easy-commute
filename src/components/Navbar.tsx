import React from 'react';
import { Car, Search, PlusCircle, Leaf, Sparkles, UserCheck, ShieldCheck, BarChart3 } from 'lucide-react';
import { ImpactStats } from '../types';

interface NavbarProps {
  activeTab: 'find' | 'offer' | 'my_trips' | 'impact' | 'assistant';
  setActiveTab: (tab: 'find' | 'offer' | 'my_trips' | 'impact' | 'assistant') => void;
  impactStats: ImpactStats;
  activeRole: 'passenger' | 'driver';
  setActiveRole: (role: 'passenger' | 'driver') => void;
  myBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  impactStats,
  activeRole,
  setActiveRole,
  myBookingsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('find')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">Easy<span className="text-emerald-600">Commute</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  AI Smart Match
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Shared Rides • Fair Cost • Lower CO₂
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('find')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'find'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-600" />
              Find Ride
            </button>

            <button
              onClick={() => setActiveTab('offer')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'offer'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              Offer Ride
            </button>

            <button
              onClick={() => setActiveTab('my_trips')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                activeTab === 'my_trips'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              My Commutes
              {myBookingsCount > 0 && (
                <span className="w-5 h-5 bg-emerald-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center -mr-1">
                  {myBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('impact')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'impact'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              CO₂ Impact
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'assistant'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 hover:bg-emerald-100/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </button>
          </nav>

          {/* Quick Impact Badge & Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Environmental Impact Counter Badge */}
            <div 
              onClick={() => setActiveTab('impact')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium cursor-pointer hover:bg-emerald-100 transition-all"
            >
              <Leaf className="w-4 h-4 text-emerald-600 fill-emerald-500/20" />
              <span>
                <strong className="text-emerald-900 font-bold">{impactStats.totalCo2SavedKg.toLocaleString()} kg</strong> CO₂ Saved
              </span>
            </div>

            {/* Quick Action / Role Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveRole('passenger')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRole === 'passenger'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Passenger
              </button>
              <button
                onClick={() => setActiveRole('driver')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeRole === 'driver'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Driver
              </button>
            </div>

            {/* Direct Offer Ride CTA Button */}
            <button
              onClick={() => setActiveTab('offer')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Post Ride
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden border-t border-slate-200 bg-white px-2 py-1.5 flex justify-around items-center text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('find')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'find' ? 'text-emerald-600 font-bold' : ''
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Find</span>
        </button>

        <button
          onClick={() => setActiveTab('offer')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'offer' ? 'text-emerald-600 font-bold' : ''
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Offer</span>
        </button>

        <button
          onClick={() => setActiveTab('my_trips')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg relative ${
            activeTab === 'my_trips' ? 'text-emerald-600 font-bold' : ''
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span>Trips</span>
          {myBookingsCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {myBookingsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('impact')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'impact' ? 'text-emerald-600 font-bold' : ''
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Impact</span>
        </button>

        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex flex-col items-center gap-1 p-1 rounded-lg ${
            activeTab === 'assistant' ? 'text-emerald-600 font-bold' : ''
          }`}
        >
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span>AI Help</span>
        </button>
      </div>
    </header>
  );
};
