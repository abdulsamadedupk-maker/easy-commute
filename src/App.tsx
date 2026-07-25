import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { RideCard } from './components/RideCard';
import { InteractiveMap } from './components/InteractiveMap';
import { RideDetailModal } from './components/RideDetailModal';
import { OfferRideModal } from './components/OfferRideModal';
import { ImpactDashboard } from './components/ImpactDashboard';
import { CommuteAssistantWidget } from './components/CommuteAssistantWidget';
import { MyTripsView } from './components/MyTripsView';
import { INITIAL_MOCK_RIDES, INITIAL_COMMUNITY_STATS } from './data/mockRides';
import { Ride, SearchQuery, SmartMatchResult, BookingRequest, ImpactStats } from './types';
import { Sparkles, MapPin, Car, ShieldCheck, Leaf, Filter, Zap, ArrowUpDown, Info } from 'lucide-react';

export default function App() {
  // Primary State
  const [rides, setRides] = useState<Ride[]>(INITIAL_MOCK_RIDES);
  const [publishedRides, setPublishedRides] = useState<Ride[]>([]);
  const [impactStats, setImpactStats] = useState<ImpactStats>(INITIAL_COMMUNITY_STATS);

  // Active User Bookings
  const [bookings, setBookings] = useState<BookingRequest[]>([
    {
      id: 'book-901',
      rideId: 'ride-101',
      passengerName: 'Ali Hassan',
      passengerPhone: '+92 300 5551234',
      pickupAddress: 'Bahria Town Phase 8 (Rawalpindi)',
      dropoffAddress: 'Blue Area (Islamabad)',
      seatsRequested: 1,
      totalCost: 350,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      note: 'I will be waiting near PWD Gate.'
    }
  ]);

  // View & Role State
  const [activeTab, setActiveTab] = useState<'find' | 'offer' | 'my_trips' | 'impact' | 'assistant'>('find');
  const [activeRole, setActiveRole] = useState<'passenger' | 'driver'>('passenger');

  // Modal & Selection State
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    pickupLocation: '',
    destination: '',
    date: '2026-07-25',
    travelTime: '08:15',
    seatsNeeded: 1,
    maxDetourMin: 10,
    fuelFilter: 'all',
    sortBy: 'smart_match'
  });

  // AI Smart Match Results
  const [smartMatchesMap, setSmartMatchesMap] = useState<Record<string, SmartMatchResult>>({});
  const [isLoadingSmartMatch, setIsLoadingSmartMatch] = useState(false);

  // Run AI Smart Match on rides list
  const runSmartMatch = async () => {
    setIsLoadingSmartMatch(true);
    try {
      const allRides = [...rides, ...publishedRides];
      const res = await fetch('/api/smart-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery,
          rides: allRides
        })
      });

      const data = await res.json();
      if (data.matches && Array.isArray(data.matches)) {
        const map: Record<string, SmartMatchResult> = {};
        data.matches.forEach((m: SmartMatchResult) => {
          map[m.rideId] = m;
        });
        setSmartMatchesMap(map);
      }
    } catch (err) {
      console.error('Failed to run smart match:', err);
    } finally {
      setIsLoadingSmartMatch(false);
    }
  };

  // Run initial match on load
  useEffect(() => {
    runSmartMatch();
  }, []);

  // Filtered & Sorted Rides List
  const filteredRides = useMemo(() => {
    const allRides = [...rides, ...publishedRides];

    return allRides.filter((ride) => {
      // Pickup filter
      if (searchQuery.pickupLocation) {
        const pLower = searchQuery.pickupLocation.toLowerCase();
        const oLower = ride.origin.toLowerCase();
        if (!oLower.includes(pLower)) {
          // Allow loose matching or matching via waypoints
          const wpMatch = ride.waypoints?.some(wp => wp.name.toLowerCase().includes(pLower));
          if (!wpMatch) return false;
        }
      }

      // Destination filter
      if (searchQuery.destination) {
        const dLower = searchQuery.destination.toLowerCase();
        const destLower = ride.destination.toLowerCase();
        if (!destLower.includes(dLower)) return false;
      }

      // Fuel filter
      if (searchQuery.fuelFilter === 'EV' && ride.fuelType !== 'EV') return false;
      if (searchQuery.fuelFilter === 'hybrid' && ride.fuelType !== 'EV' && ride.fuelType !== 'Hybrid') return false;

      // Available seats check
      if (ride.availableSeats < searchQuery.seatsNeeded) return false;

      return true;
    }).sort((a, b) => {
      if (searchQuery.sortBy === 'smart_match') {
        const scoreA = smartMatchesMap[a.id]?.matchScore || 50;
        const scoreB = smartMatchesMap[b.id]?.matchScore || 50;
        return scoreB - scoreA;
      }
      if (searchQuery.sortBy === 'price') {
        return a.costPerSeatDollars - b.costPerSeatDollars;
      }
      if (searchQuery.sortBy === 'co2') {
        return b.carbonSavedKgPerSeat - a.carbonSavedKgPerSeat;
      }
      if (searchQuery.sortBy === 'time') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      return 0;
    });
  }, [rides, publishedRides, searchQuery, smartMatchesMap]);

  // Handle New Booking Creation
  const handleConfirmBooking = (bookingData: Omit<BookingRequest, 'id' | 'timestamp' | 'status'>) => {
    const newBooking: BookingRequest = {
      ...bookingData,
      id: `book-${Date.now().toString().slice(-4)}`,
      status: 'confirmed',
      timestamp: new Date().toISOString()
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update ride available seats
    setRides((prevRides) =>
      prevRides.map((r) => {
        if (r.id === bookingData.rideId) {
          const updatedSeats = Math.max(0, r.availableSeats - bookingData.seatsRequested);
          return {
            ...r,
            availableSeats: updatedSeats,
            passengers: [
              ...r.passengers,
              {
                id: `p-${Date.now()}`,
                name: bookingData.passengerName,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                pickupPoint: bookingData.pickupAddress,
                dropoffPoint: bookingData.dropoffAddress,
                seatsBooked: bookingData.seatsRequested,
                status: 'confirmed',
                bookedAt: new Date().toISOString()
              }
            ]
          };
        }
        return r;
      })
    );

    // Update Impact Metrics
    setImpactStats((prev) => ({
      ...prev,
      totalRidesShared: prev.totalRidesShared + 1,
      totalPassengersCarried: prev.totalPassengersCarried + bookingData.seatsRequested,
      totalCo2SavedKg: Math.round(prev.totalCo2SavedKg + bookingData.seatsRequested * 4.2),
      totalMoneySavedDollars: Math.round(prev.totalMoneySavedDollars + bookingData.seatsRequested * 350)
    }));
  };

  // Handle Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      setRides((prev) =>
        prev.map((r) => {
          if (r.id === target.rideId) {
            return {
              ...r,
              availableSeats: Math.min(r.totalSeats, r.availableSeats + target.seatsRequested)
            };
          }
          return r;
        })
      );
    }
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  // Handle Publishing New Ride Offer by Driver
  const handleAddRide = (newRide: Ride) => {
    setPublishedRides((prev) => [newRide, ...prev]);
    setIsOfferModalOpen(false);
    // Refresh smart match ranking
    setTimeout(() => {
      runSmartMatch();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased flex flex-col">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        impactStats={impactStats}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        myBookingsCount={bookings.length}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 py-6">
        
        {/* FIND RIDE TAB */}
        {activeTab === 'find' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Hero Search Section */}
            <HeroSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={runSmartMatch}
              isLoadingSmartMatch={isLoadingSmartMatch}
              totalAvailableRidesCount={rides.length + publishedRides.length}
            />

            {/* Split View: Map Route Visualizer + Ride Offer Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Interactive Leaflet Map Visualizer */}
              <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Commute Route & Pickup Map
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {filteredRides.length} Route{filteredRides.length !== 1 ? 's' : ''} Rendered
                    </span>
                  </div>

                  <InteractiveMap
                    selectedRide={selectedRide}
                    rides={filteredRides}
                    onSelectRide={(r) => setSelectedRide(r)}
                    height="420px"
                    showAllRoutes={true}
                  />

                  {selectedRide ? (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                      <div>
                        <strong className="text-emerald-900 block font-bold">
                          Selected: {selectedRide.driverName}'s {selectedRide.vehicleModel}
                        </strong>
                        <span className="text-emerald-700">
                          {selectedRide.origin} → {selectedRide.destination}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedRide(null)}
                        className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                      >
                        Reset Selection
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-2 italic text-center">
                      💡 Click any driver pin or route polyline on the map to preview driver specs and reserve a seat.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: AI Smart Matched Rides List */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Section Header with Sort Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" /> Available Commute Matches
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing {filteredRides.length} ride offers matching your preferences
                    </p>
                  </div>

                  {/* Sort Pill */}
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-slate-400">Sort:</span>
                    <select
                      value={searchQuery.sortBy}
                      onChange={(e) => setSearchQuery({ ...searchQuery, sortBy: e.target.value as any })}
                      className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden"
                    >
                      <option value="smart_match">🤖 AI Smart Match</option>
                      <option value="time">⏰ Departure Time</option>
                      <option value="price">💵 Price (Lowest First)</option>
                      <option value="co2">🍃 CO₂ Saved</option>
                    </select>
                  </div>
                </div>

                {/* Ride Cards Stack */}
                {filteredRides.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-2xs space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                      <Car className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No Rides Found For This Route Filter</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Try adjusting your pickup location, destination, or fuel filter. Or be the first driver to post an offer on this route!
                    </p>
                    <button
                      onClick={() => setIsOfferModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
                    >
                      Offer a Ride on This Route
                    </button>
                  </div>
                ) : (
                  filteredRides.map((ride) => (
                    <RideCard
                      key={ride.id}
                      ride={ride}
                      smartMatch={smartMatchesMap[ride.id]}
                      onBookRide={(r) => setSelectedRide(r)}
                      onViewDetails={(r) => setSelectedRide(r)}
                      isSelected={selectedRide?.id === ride.id}
                    />
                  ))
                )}

              </div>

            </div>

          </div>
        )}

        {/* OFFER RIDE TAB */}
        {activeTab === 'offer' && (
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Offer a Commute Ride</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out your daily driver route, departure time, open seats, and fuel cost share.
                  </p>
                </div>
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Open Offer Modal
                </button>
              </div>

              {/* Direct Form Trigger */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <Car className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Driver Offer Portal Active</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  By publishing your commute, you allow commuters traveling along your way to share your fuel costs and decrease traffic congestion.
                </p>
                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Launch Driver Offer Form
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MY COMMUTES / TRIPS TAB */}
        {activeTab === 'my_trips' && (
          <MyTripsView
            bookings={bookings}
            rides={rides}
            userPublishedRides={publishedRides}
            onCancelBooking={handleCancelBooking}
            onSelectRide={(r) => setSelectedRide(r)}
          />
        )}

        {/* CO2 IMPACT DASHBOARD TAB */}
        {activeTab === 'impact' && (
          <ImpactDashboard stats={impactStats} />
        )}

        {/* AI ASSISTANT CONCIERGE TAB */}
        {activeTab === 'assistant' && (
          <div className="px-4">
            <CommuteAssistantWidget availableRides={[...rides, ...publishedRides]} />
          </div>
        )}

      </main>

      {/* Ride Detail & Booking Modal */}
      <RideDetailModal
        ride={selectedRide}
        onClose={() => setSelectedRide(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Driver Offer Ride Modal */}
      <OfferRideModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onAddRide={handleAddRide}
      />

      {/* App Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              EC
            </div>
            <span className="font-bold text-slate-800">Easy Commute</span>
            <span>• Smart Carpooling for Sustainable Cities</span>
          </div>

          <div className="flex items-center gap-4 font-medium text-slate-600">
            <button onClick={() => setActiveTab('impact')} className="hover:text-emerald-600 transition-all cursor-pointer">
              CO₂ Savings
            </button>
            <button onClick={() => setActiveTab('assistant')} className="hover:text-emerald-600 transition-all cursor-pointer">
              AI Match Concierge
            </button>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              ⚡ Powered by Gemini 3.6 Flash
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
