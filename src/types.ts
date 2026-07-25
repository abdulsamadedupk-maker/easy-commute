export type FuelType = 'EV' | 'Hybrid' | 'Petrol' | 'Diesel';

export type RecurrenceType = 'one-time' | 'daily' | 'workdays' | 'custom';

export type RideStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Passenger {
  id: string;
  name: string;
  avatar: string;
  pickupPoint: string;
  dropoffPoint: string;
  seatsBooked: number;
  status: 'confirmed' | 'pending';
  bookedAt: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Ride {
  id: string;
  driverName: string;
  driverAvatar: string;
  driverPhone: string;
  driverRating: number;
  driverTripsCount: number;
  vehicleModel: string;
  vehicleColor: string;
  plateNumber: string;
  fuelType: FuelType;
  origin: string;
  destination: string;
  originCoords: Coordinates;
  destCoords: Coordinates;
  waypoints?: { name: string; coords: Coordinates }[];
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:MM
  estimatedDurationMin: number;
  totalSeats: number;
  availableSeats: number;
  totalFuelCostDollars: number;
  costPerSeatDollars: number;
  distanceKm: number;
  recurrence: RecurrenceType;
  notes?: string;
  passengers: Passenger[];
  carbonSavedKgPerSeat: number;
  fuelSavedLitersPerSeat: number;
  status: RideStatus;
  createdAt: string;
}

export interface SearchQuery {
  pickupLocation: string;
  destination: string;
  date: string;
  travelTime: string;
  seatsNeeded: number;
  maxDetourMin: number;
  fuelFilter: 'all' | 'EV' | 'hybrid';
  sortBy: 'smart_match' | 'time' | 'price' | 'co2';
}

export interface SmartMatchResult {
  rideId: string;
  matchScore: number; // 0 - 100
  routeSimilarityPercentage: number;
  estimatedPickupDetourMin: number;
  detourExtraDistanceKm: number;
  fairSplitCost: number;
  co2SavedKg: number;
  aiExplanation: string;
  badges: string[]; // e.g. "Zero Emission EV", "Minimal Detour", "Perfect Time Sync"
}

export interface BookingRequest {
  id: string;
  rideId: string;
  passengerName: string;
  passengerPhone: string;
  passengerAvatar?: string;
  pickupAddress: string;
  dropoffAddress: string;
  seatsRequested: number;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'rejected';
  timestamp: string;
  note?: string;
}

export interface ImpactStats {
  totalRidesShared: number;
  totalPassengersCarried: number;
  totalFuelSavedLiters: number;
  totalMoneySavedDollars: number;
  totalCo2SavedKg: number;
  treesEquivalent: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'search' | 'filter_ev' | 'book_ride';
    query?: Partial<SearchQuery>;
    rideId?: string;
  };
}
