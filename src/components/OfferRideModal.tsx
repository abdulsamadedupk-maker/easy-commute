import React, { useState } from 'react';
import { Ride, FuelType, RecurrenceType } from '../types';
import { PlusCircle, MapPin, Calendar, Clock, Users, DollarSign, Zap, Car, ShieldCheck, CheckCircle2, Sparkles, X } from 'lucide-react';

interface OfferRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRide: (newRide: Ride) => void;
}

export const OfferRideModal: React.FC<OfferRideModalProps> = ({
  isOpen,
  onClose,
  onAddRide
}) => {
  if (!isOpen) return null;

  const [driverName, setDriverName] = useState('Usman Tariq');
  const [driverPhone, setDriverPhone] = useState('+92 300 9876543');
  const [origin, setOrigin] = useState('Bahria Town Phase 8 (Rawalpindi)');
  const [destination, setDestination] = useState('Blue Area (Islamabad)');
  const [departureDate, setDepartureDate] = useState('2026-07-25');
  const [departureTime, setDepartureTime] = useState('08:15');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('workdays');
  const [totalSeats, setTotalSeats] = useState(3);
  const [totalFuelCostDollars, setTotalFuelCostDollars] = useState(1200);
  const [vehicleModel, setVehicleModel] = useState('Toyota Corolla');
  const [vehicleColor, setVehicleColor] = useState('Super White');
  const [plateNumber, setPlateNumber] = useState('ICT-554');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [notes, setNotes] = useState('Daily quiet work commute to Blue Area. Non-smoking, clean car.');
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto calculate cost per seat (splitting fuel cost between driver + passengers)
  const costPerSeat = Math.max(100, Math.round(totalFuelCostDollars / (totalSeats + 1)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const createdRide: Ride = {
      id: `ride-${Date.now().toString().slice(-4)}`,
      driverName,
      driverAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      driverPhone,
      driverRating: 4.9,
      driverTripsCount: 1,
      vehicleModel,
      vehicleColor,
      plateNumber,
      fuelType,
      origin,
      destination,
      originCoords: { lat: 33.5135, lng: 73.0900 },
      destCoords: { lat: 33.7182, lng: 73.0602 },
      departureDate,
      departureTime,
      estimatedDurationMin: 30,
      totalSeats,
      availableSeats: totalSeats,
      totalFuelCostDollars,
      costPerSeatDollars: costPerSeat,
      distanceKm: 18.0,
      recurrence,
      notes,
      passengers: [],
      carbonSavedKgPerSeat: fuelType === 'EV' ? 4.8 : fuelType === 'Hybrid' ? 3.5 : 2.8,
      fuelSavedLitersPerSeat: 1.8,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    onAddRide(createdRide);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto">
        
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-t-3xl border-b border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30 flex items-center gap-1">
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Driver Offer Studio
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Offer a Commute Ride</h2>
          <p className="text-xs text-slate-300 mt-1">
            Share open seats with daily commuters. Offset your fuel costs and lower road traffic.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Ride Offer Published Live!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your commute offer from <strong>{origin}</strong> to <strong>{destination}</strong> is now searchable and eligible for AI Smart Matching.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Origin & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    📍 Starting Origin / Pickup Hub
                  </label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    🏁 Destination / Arrival Hub
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Schedule & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    📅 Departure Date
                  </label>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ⏰ Departure Time
                  </label>
                  <input
                    type="time"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    🔄 Recurrence
                  </label>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    <option value="one-time">One-time Trip</option>
                    <option value="workdays">Mon - Fri Workdays</option>
                    <option value="daily">Daily Commute</option>
                  </select>
                </div>
              </div>

              {/* Seats & Cost Sharing */}
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">
                    🪑 Open Seats Available
                  </label>
                  <select
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    <option value={1}>1 Passenger Seat</option>
                    <option value={2}>2 Passenger Seats</option>
                    <option value={3}>3 Passenger Seats</option>
                    <option value={4}>4 Passenger Seats</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">
                    ⛽ Total Fuel/Energy Cost (Rs.)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={10000}
                    value={totalFuelCostDollars}
                    onChange={(e) => setTotalFuelCostDollars(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div className="text-right sm:text-center bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-semibold block">Fair Per-Seat Share</span>
                  <span className="text-lg font-black text-emerald-700">Rs. {costPerSeat}</span>
                </div>
              </div>

              {/* Vehicle Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Make & Model</label>
                  <input
                    type="text"
                    required
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Powertrain</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
                  >
                    <option value="EV">⚡ EV Electric</option>
                    <option value="Hybrid">🍃 Hybrid</option>
                    <option value="Petrol">⛽ Petrol</option>
                    <option value="Diesel">🛢️ Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">License Plate</label>
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Pickup Instructions & Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>Publish Commute Offer (Earn ~Rs. {totalSeats * costPerSeat} / trip)</span>
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
