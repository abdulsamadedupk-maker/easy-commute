import React from 'react';
import { Ride, SmartMatchResult } from '../types';
import { Clock, MapPin, Users, Zap, Leaf, Star, Sparkles, ChevronRight, CheckCircle2, Navigation } from 'lucide-react';

interface RideCardProps {
  ride: Ride;
  smartMatch?: SmartMatchResult;
  onBookRide: (ride: Ride) => void;
  onViewDetails: (ride: Ride) => void;
  isSelected?: boolean;
}

export const RideCard: React.FC<RideCardProps> = ({
  ride,
  smartMatch,
  onBookRide,
  onViewDetails,
  isSelected
}) => {
  return (
    <div 
      className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
        isSelected 
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10' 
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* AI Smart Match Header Banner */}
      {smartMatch && (
        <div className="mb-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-xl p-3 border border-emerald-800/40 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                {smartMatch.matchScore}%
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">AI Route Match Score</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  +{smartMatch.estimatedPickupDetourMin} min detour • Fair split Rs. {Math.round(smartMatch.fairSplitCost)}
                </p>
              </div>
            </div>

            {/* Smart Badges */}
            <div className="flex flex-wrap gap-1">
              {smartMatch.badges.map((badge) => (
                <span key={badge} className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px]">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* AI Explanation Sentence */}
          <p className="text-xs text-slate-300 mt-2 italic leading-relaxed border-t border-slate-800 pt-2">
            "{smartMatch.aiExplanation}"
          </p>
        </div>
      )}

      {/* Driver Info & Vehicle Badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={ride.driverAvatar}
            alt={ride.driverName}
            className="w-11 h-11 rounded-full object-cover border-2 border-slate-100 shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{ride.driverName}</h3>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                {ride.driverRating}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {ride.driverTripsCount} shared commutes • License: <span className="font-mono text-slate-700">{ride.plateNumber}</span>
            </p>
          </div>
        </div>

        {/* Vehicle Type Pill */}
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            ride.fuelType === 'EV'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : ride.fuelType === 'Hybrid'
              ? 'bg-teal-100 text-teal-800 border border-teal-200'
              : 'bg-slate-100 text-slate-800 border border-slate-200'
          }`}>
            {ride.fuelType === 'EV' && <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600" />}
            {ride.fuelType === 'Hybrid' && <Leaf className="w-3.5 h-3.5 fill-teal-500 text-teal-600" />}
            {ride.vehicleModel}
          </span>
          <p className="text-[11px] text-slate-400 font-medium mt-1">{ride.vehicleColor}</p>
        </div>
      </div>

      {/* Route Timeline */}
      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 mb-4">
        <div className="space-y-3 relative">
          
          {/* Origin */}
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-2xs mt-1 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{ride.origin}</span>
                <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {ride.departureTime}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Departure Location</p>
            </div>
          </div>

          {/* Dotted Route Connector Line */}
          <div className="absolute left-[6px] top-[14px] bottom-[14px] w-0.5 bg-slate-300 border-l border-dashed border-slate-400" />

          {/* Destination */}
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white shadow-2xs mt-1 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{ride.destination}</span>
                <span className="text-xs font-medium text-slate-500">
                  ~{ride.estimatedDurationMin} mins ({ride.distanceKm} km)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Final Destination</p>
            </div>
          </div>

        </div>
      </div>

      {/* Metric Pills & Carbon Savings */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>{ride.availableSeats} of {ride.totalSeats} seats open</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>-{ride.carbonSavedKgPerSeat} kg CO₂</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-right">
          <span className="text-lg font-black text-slate-900">Rs. {ride.costPerSeatDollars}</span>
          <span className="text-xs font-medium text-slate-500"> / seat</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => onViewDetails(ride)}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-slate-600" />
          <span>View Route Map</span>
        </button>

        <button
          onClick={() => onBookRide(ride)}
          disabled={ride.availableSeats === 0}
          className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
            ride.availableSeats > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {ride.availableSeats > 0 ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Request Seat</span>
            </>
          ) : (
            <span>Ride Fully Booked</span>
          )}
        </button>
      </div>

    </div>
  );
};
