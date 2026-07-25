import React, { useState } from 'react';
import { Ride, BookingRequest } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { X, CheckCircle2, User, Phone, MapPin, Calendar, Clock, DollarSign, Leaf, Zap, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';

interface RideDetailModalProps {
  ride: Ride | null;
  onClose: () => void;
  onConfirmBooking: (booking: Omit<BookingRequest, 'id' | 'timestamp' | 'status'>) => void;
}

export const RideDetailModal: React.FC<RideDetailModalProps> = ({
  ride,
  onClose,
  onConfirmBooking
}) => {
  if (!ride) return null;

  const [passengerName, setPassengerName] = useState('Ali Hassan');
  const [passengerPhone, setPassengerPhone] = useState('+92 300 5551234');
  const [pickupAddress, setPickupAddress] = useState(ride.origin);
  const [dropoffAddress, setDropoffAddress] = useState(ride.destination);
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalCost = seatsRequested * ride.costPerSeatDollars;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmBooking({
      rideId: ride.id,
      passengerName,
      passengerPhone,
      pickupAddress,
      dropoffAddress,
      seatsRequested,
      totalCost,
      note
    });
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in duration-150">
        
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-t-3xl border-b border-emerald-800/40">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-400/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Ride Offer #{ride.id}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Departure: {ride.departureDate} at {ride.departureTime}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {ride.origin} → {ride.destination}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Driven by {ride.driverName} ({ride.vehicleModel}) • {ride.availableSeats} of {ride.totalSeats} seats left
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {/* Interactive Map Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> Route & Waypoints Visualizer
            </h3>
            <InteractiveMap selectedRide={ride} rides={[ride]} height="260px" showAllRoutes={false} />
          </div>

          {/* Driver & Vehicle Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Driver Profile Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={ride.driverAvatar}
                alt={ride.driverName}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">{ride.driverName}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Verified Driver
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  ⭐ {ride.driverRating} Rating • {ride.driverTripsCount} Rides Completed
                </p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  📞 {ride.driverPhone}
                </p>
              </div>
            </div>

            {/* Vehicle Specs Box */}
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Vehicle Specs</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold">
                  {ride.fuelType}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900">{ride.vehicleModel} ({ride.vehicleColor})</p>
              <p className="text-xs text-slate-600 font-mono">Plate Number: {ride.plateNumber}</p>
              <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900 font-semibold">
                <span>🍃 Carbon Saved: -{ride.carbonSavedKgPerSeat} kg CO₂</span>
                <span>⛽ Fuel Saved: ~{ride.fuelSavedLitersPerSeat}L</span>
              </div>
            </div>

          </div>

          {/* Driver Notes */}
          {ride.notes && (
            <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Driver Note:</strong> "{ride.notes}"
              </div>
            </div>
          )}

          {/* Passengers Already Confirmed */}
          {ride.passengers && ride.passengers.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Confirmed Co-Commuters ({ride.passengers.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {ride.passengers.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                    <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                    <span>{p.name}</span>
                    <span className="text-emerald-600">({p.seatsBooked} seat)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Request Form */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-800">
            {isSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Seat Request Submitted!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  We've notified driver {ride.driverName}. You can view and manage your active commute in the <strong>My Commutes</strong> tab.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reserve Your Commute Seat
                  </h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800">
                    Rs. {ride.costPerSeatDollars} / seat
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Passenger Name</label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Pickup Spot</label>
                    <input
                      type="text"
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Dropoff Spot</label>
                    <input
                      type="text"
                      required
                      value={dropoffAddress}
                      onChange={(e) => setDropoffAddress(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Seats Requested</label>
                    <select
                      value={seatsRequested}
                      onChange={(e) => setSeatsRequested(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-hidden"
                    >
                      {Array.from({ length: ride.availableSeats }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Seat{i > 0 ? 's' : ''} (Rs. {(i + 1) * ride.costPerSeatDollars})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Fuel Cost Share</span>
                    <span className="text-2xl font-black text-emerald-400">Rs. {totalCost}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Note for Driver (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. I will be holding a green backpack near the main entrance."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Ride Seat Reservation (Rs. {totalCost})</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
