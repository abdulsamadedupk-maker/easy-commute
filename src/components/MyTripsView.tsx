import React, { useState } from 'react';
import { BookingRequest, Ride } from '../types';
import { UserCheck, Car, Calendar, Clock, MapPin, Phone, CheckCircle2, XCircle, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';

interface MyTripsViewProps {
  bookings: BookingRequest[];
  rides: Ride[];
  userPublishedRides: Ride[];
  onCancelBooking: (bookingId: string) => void;
  onSelectRide: (ride: Ride) => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  bookings,
  rides,
  userPublishedRides,
  onCancelBooking,
  onSelectRide
}) => {
  const [subTab, setSubTab] = useState<'passenger' | 'driver'>('passenger');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">My Commute Hub</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Manage your reserved passenger seats and published driver commute offers
          </p>
        </div>

        {/* Subtab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setSubTab('passenger')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              subTab === 'passenger'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Reserved Passenger Seats ({bookings.length})
          </button>
          <button
            onClick={() => setSubTab('driver')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              subTab === 'driver'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Driver Rides ({userPublishedRides.length})
          </button>
        </div>
      </div>

      {/* Passenger View */}
      {subTab === 'passenger' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Reserved Passenger Seats Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the <strong>Find Ride</strong> tab to search for drivers traveling on your route and request your seat.
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const matchedRide = rides.find((r) => r.id === booking.rideId);

              return (
                <div key={booking.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Seat Confirmed
                        </span>
                        <span className="text-xs font-mono text-slate-400">Ref: #{booking.id}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {booking.pickupAddress} → {booking.dropoffAddress}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900">Rs. {booking.totalCost}</span>
                      <span className="text-xs text-slate-500 block">
                        {booking.seatsRequested} Seat{booking.seatsRequested > 1 ? 's' : ''} Reserved
                      </span>
                    </div>
                  </div>

                  {matchedRide && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-3 mb-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={matchedRide.driverAvatar}
                          alt={matchedRide.driverName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <strong className="text-slate-900 block">{matchedRide.driverName} ({matchedRide.vehicleModel})</strong>
                          <span className="text-slate-500">
                            Departs {matchedRide.departureDate} at {matchedRide.departureTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectRide(matchedRide)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs transition-all cursor-pointer"
                        >
                          View Map Route
                        </button>
                      </div>
                    </div>
                  )}

                  {booking.note && (
                    <p className="text-xs text-slate-600 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200/60 mb-3">
                      Note to Driver: "{booking.note}"
                    </p>
                  )}

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Cancel Seat Reservation
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Driver View */}
      {subTab === 'driver' && (
        <div className="space-y-4">
          {userPublishedRides.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Published Driver Rides Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click <strong>Offer Ride</strong> in the top navigation bar to post your daily commute route!
              </p>
            </div>
          ) : (
            userPublishedRides.map((ride) => (
              <div key={ride.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Active Offer
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {ride.origin} → {ride.destination}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Departs {ride.departureDate} at {ride.departureTime} • {ride.vehicleModel} ({ride.fuelType})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-700">Rs. {ride.costPerSeatDollars}</span>
                    <span className="text-xs text-slate-500 block">
                      {ride.availableSeats} of {ride.totalSeats} seats left
                    </span>
                  </div>
                </div>

                {ride.passengers && ride.passengers.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      Confirmed Passengers ({ride.passengers.length})
                    </span>
                    {ride.passengers.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                          <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-slate-900">{p.name}</span>
                          <span className="text-slate-500">({p.pickupPoint})</span>
                        </div>
                        <span className="text-emerald-700 font-bold">{p.seatsBooked} Seat Booked</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
