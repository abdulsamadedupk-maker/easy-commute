import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Ride } from '../types';
import { Navigation, ShieldCheck, Zap } from 'lucide-react';

interface InteractiveMapProps {
  selectedRide?: Ride | null;
  rides: Ride[];
  onSelectRide?: (ride: Ride) => void;
  height?: string;
  showAllRoutes?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedRide,
  rides,
  onSelectRide,
  height = '380px',
  showAllRoutes = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map if not already created
    if (!mapInstanceRef.current) {
      const defaultLat = selectedRide?.originCoords.lat || 33.6844;
      const defaultLng = selectedRide?.originCoords.lng || 73.0479;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Add OpenStreetMap tile layer (clean vector-like style)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Easy Commute Route Engine',
        maxZoom: 19
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layerGroup = markersGroupRef.current;

    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Custom Icon Creators
    const createCustomIcon = (color: string, iconText: string, isEV?: boolean) => {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: ${color};
            color: white;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border: 2px solid white;
            white-space: nowrap;
          ">
            <span>${iconText}</span>
            ${isEV ? '<span style="background: #10b981; color: white; border-radius: 50%; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; font-size: 8px;">⚡</span>' : ''}
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });
    };

    const bounds: L.LatLngBounds = L.latLngBounds([]);

    const ridesToDraw = selectedRide && !showAllRoutes ? [selectedRide] : rides;

    ridesToDraw.forEach((ride) => {
      const isSelected = selectedRide?.id === ride.id;
      const lineColor = isSelected ? '#059669' : '#64748b';
      const opacity = isSelected ? 0.9 : 0.5;
      const weight = isSelected ? 5 : 3;

      // Origin Marker
      const originLat = ride.originCoords.lat;
      const originLng = ride.originCoords.lng;
      bounds.extend([originLat, originLng]);

      const originMarker = L.marker([originLat, originLng], {
        icon: createCustomIcon(
          isSelected ? '#047857' : '#334155',
          `${ride.driverName.split(' ')[0]} • Rs.${ride.costPerSeatDollars}`,
          ride.fuelType === 'EV'
        )
      });

      originMarker.on('click', () => {
        if (onSelectRide) onSelectRide(ride);
      });

      originMarker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <img src="${ride.driverAvatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
            <div>
              <strong style="font-size: 13px; display: block;">${ride.driverName}</strong>
              <span style="font-size: 11px; color: #059669; font-weight: 600;">${ride.vehicleModel} (${ride.fuelType})</span>
            </div>
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            📍 <strong>From:</strong> ${ride.origin}<br/>
            🏁 <strong>To:</strong> ${ride.destination}<br/>
            ⏰ <strong>Departs:</strong> ${ride.departureTime}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <span style="font-weight: 700; color: #0f172a; font-size: 13px;">Rs. ${ride.costPerSeatDollars}/seat</span>
            <span style="font-size: 10px; background: #ecfdf5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
              🍃 -${ride.carbonSavedKgPerSeat}kg CO₂
            </span>
          </div>
        </div>
      `);

      layerGroup.addLayer(originMarker);

      // Destination Marker
      const destLat = ride.destCoords.lat;
      const destLng = ride.destCoords.lng;
      bounds.extend([destLat, destLng]);

      const destMarker = L.circleMarker([destLat, destLng], {
        radius: isSelected ? 8 : 6,
        color: isSelected ? '#047857' : '#475569',
        fillColor: '#ffffff',
        fillOpacity: 1,
        weight: 3
      });
      layerGroup.addLayer(destMarker);

      // Route Polyline simulation (Origin -> Waypoints -> Dest)
      const routePoints: [number, number][] = [[originLat, originLng]];
      if (ride.waypoints && ride.waypoints.length > 0) {
        ride.waypoints.forEach((wp) => {
          routePoints.push([wp.coords.lat, wp.coords.lng]);
          bounds.extend([wp.coords.lat, wp.coords.lng]);
        });
      }
      routePoints.push([destLat, destLng]);

      const polyline = L.polyline(routePoints, {
        color: lineColor,
        weight: weight,
        opacity: opacity,
        dashArray: isSelected ? undefined : '6, 6'
      });

      polyline.on('click', () => {
        if (onSelectRide) onSelectRide(ride);
      });

      layerGroup.addLayer(polyline);
    });

    if (bounds.isValid() && ridesToDraw.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [selectedRide, rides, showAllRoutes]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-2">
        <Navigation className="w-4 h-4 text-emerald-600" />
        <span>Live Commute Route Visualizer</span>
        {selectedRide && (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">
            {selectedRide.driverName}'s Route
          </span>
        )}
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full" />

      {/* Map Legend Footer */}
      <div className="bg-white px-4 py-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-2xs"></span>
            <span className="font-medium text-slate-700">Driver Origin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white border-2 border-emerald-700"></span>
            <span className="font-medium text-slate-700">Destination</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-emerald-600 rounded-full"></span>
            <span className="font-medium text-slate-700">Smart Route Path</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
          <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600" />
          <span>Real-time detour & pickup points supported</span>
        </div>
      </div>
    </div>
  );
};
