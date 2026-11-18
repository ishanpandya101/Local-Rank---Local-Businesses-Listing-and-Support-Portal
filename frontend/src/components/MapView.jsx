import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, Star, Navigation, Phone, MessageCircle, 
  ShieldCheck, ArrowUpRight, Clock, ExternalLink 
} from "lucide-react";
import { useLocation, formatDistance } from "../context/LocationContext";
import { useTheme } from "../context/ThemeContext";

const MapView = ({ businesses }) => {
  const { userCoords, selectedLocality, calculateDistanceTo } = useLocation();
  const { isDark } = useTheme();
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0] || null);

  // Compute bounding box / center
  const centerLat = selectedBusiness?.coordinates?.lat || userCoords.lat;
  const centerLng = selectedBusiness?.coordinates?.lng || userCoords.lng;

  // OpenStreetMap embed URL with pin coordinates
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.05}%2C${centerLat - 0.03}%2C${centerLng + 0.05}%2C${centerLat + 0.03}&layer=mapnik&marker=${centerLat}%2C${centerLng}`;

  return (
    <div className="bg-white dark:bg-[#0e1017] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-soft grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
      
      {/* Left Column: Businesses List with Distance badges (5 cols) */}
      <div className="lg:col-span-5 border-r border-slate-200 dark:border-slate-800 flex flex-col max-h-[600px]">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#12141c] flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
              Neighborhood Radar
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Distances from <span className="text-slate-900 dark:text-white font-semibold">{selectedLocality}</span>
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
            {businesses.length} Places
          </span>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {businesses.map((shop) => {
            const isSelected = selectedBusiness?.id === shop.id;
            const coords = shop.coordinates || { lat: 21.1702, lng: 72.8311 };
            const dist = calculateDistanceTo(coords.lat, coords.lng);
            const distStr = formatDistance(dist);

            return (
              <div
                key={shop.id}
                onClick={() => setSelectedBusiness(shop)}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? "bg-indigo-50/70 dark:bg-[#1b1f2b] border-l-4 border-indigo-600 pl-3" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-white/10"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">{shop.name}</h5>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
                        ★ {shop.rating}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{shop.location}</p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-indigo-600 dark:text-indigo-300 font-bold flex items-center gap-1">
                        <Navigation size={11} className="text-indigo-500" />
                        {distStr}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{shop.priceRange || "₹₹"}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Column: Live Map & Selected Pin Card (7 cols) */}
      <div className="lg:col-span-7 flex flex-col relative h-[400px] lg:h-auto bg-slate-100 dark:bg-[#08090d]">
        
        {/* OpenStreetMap iframe */}
        <iframe
          title="Neighborhood Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={osmUrl}
          className={`w-full h-full ${
            isDark ? "filter invert-[0.92] hue-rotate-180 contrast-[1.1] opacity-90" : "opacity-100"
          }`}
        />

        {/* Floating Selected Business Card on Map */}
        {selectedBusiness && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#12141c]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <img
                src={selectedBusiness.image}
                alt={selectedBusiness.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {selectedBusiness.name}
                  </h4>
                  {selectedBusiness.verified && (
                    <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{selectedBusiness.location}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-700 dark:text-slate-300 mt-0.5">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">★ {selectedBusiness.rating}</span>
                  <span className="text-indigo-600 dark:text-indigo-300 font-semibold">
                    {formatDistance(calculateDistanceTo(selectedBusiness.coordinates?.lat, selectedBusiness.coordinates?.lng))}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Open Now</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${selectedBusiness.name}, ${selectedBusiness.location}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Navigation size={13} />
                <span>Navigate</span>
              </a>
              <Link
                to={`/business/${selectedBusiness.id}`}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Profile</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default MapView;
