import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Star, Heart, MapPin, Phone, Clock, ShieldCheck, 
  Layers, ArrowUpRight, Check, MessageCircle, Navigation 
} from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useCompare } from "../context/CompareContext";
import { useLocation, formatDistance } from "../context/LocationContext";

const BusinessCard = ({ business, onShowToast }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { calculateDistanceTo } = useLocation();
  const navigate = useNavigate();

  const isFav = isFavorite(business.id);
  const inComp = isInCompare(business.id);

  // Compute live distance from user coords to this business coords
  const coords = business.coordinates || { lat: 21.1702, lng: 72.8311 };
  const distanceKm = calculateDistanceTo(coords.lat, coords.lng);
  const formattedDistance = formatDistance(distanceKm);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(business.id);
    if (onShowToast) {
      onShowToast(isFav ? `Removed ${business.name} from saved` : `Saved ${business.name}!`);
    }
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (inComp) {
      removeFromCompare(business.id);
      if (onShowToast) onShowToast(`Removed ${business.name} from comparison`);
    } else {
      const res = addToCompare(business);
      if (onShowToast) onShowToast(res.msg);
    }
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const cleanNumber = (business.whatsapp || business.phone || "").replace(/\D/g, "");
    const url = `https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(business.name)},%20I%20found%20your%20listing%20on%20LocalRank.`;
    window.open(url, "_blank");
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${business.phone}`;
  };

  const handleDirections = (e) => {
    e.stopPropagation();
    const q = encodeURIComponent(`${business.name}, ${business.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
  };

  return (
    <div 
      onClick={() => navigate(`/business/${business.id}`)}
      className="group bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between text-left"
    >
      <div>
        {/* Photo Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img
            src={business.image || "https://images.unsplash.com/photo-1528698827591-e19ccd7c8b04?w=800"}
            alt={business.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30"></div>

          {/* Top Left: Open Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-900 dark:text-white shadow-sm border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Open Now</span>
          </div>

          {/* Top Right: Compare & Favorite Pills */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={handleCompareClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
                inComp 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white"
              }`}
              title={inComp ? "Remove from Compare" : "Compare"}
            >
              {inComp ? <Check size={13} strokeWidth={3} /> : <Layers size={13} />}
            </button>

            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
                isFav 
                  ? "bg-pink-600 text-white" 
                  : "bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400"
              }`}
              title="Save place"
            >
              <Heart size={13} className={isFav ? "fill-white" : ""} />
            </button>
          </div>

          {/* Bottom Left: Live GPS Distance */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            {formattedDistance ? (
              <span className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <Navigation size={11} className="fill-white/30" />
                {formattedDistance}
              </span>
            ) : (
              <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                {business.location}
              </span>
            )}
          </div>

          {/* Bottom Right: Price Range */}
          <div className="absolute bottom-3 right-3">
            <span className="text-[11px] font-semibold text-white bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
              {business.priceRange || "₹₹"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2.5">
          
          {/* Breadcrumb: Category & Area */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {business.category}
            </span>
            {business.verified && (
              <span className="shrink-0 text-emerald-700 dark:text-emerald-400 flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck size={12} />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Business Name */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
            {business.name}
          </h3>

          {/* Rating, Reviews & Trust */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded-md">
              <Star size={12} fill="currentColor" />
              <span>{business.rating || 4.5}</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400">
              ({business.ratingCount || 12} reviews)
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Score: {business.smartScore || 9.2}/10
            </span>
          </div>

          {/* Location Line */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 truncate">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{business.location}</span>
          </div>

          {/* Snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {business.tagline || business.desc}
          </p>

          {/* Tags */}
          {business.tags && business.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {business.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#162032] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        
        {/* Direct Contact Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCall}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            title="Call Phone"
          >
            <Phone size={13} />
          </button>
          
          <button
            onClick={handleWhatsApp}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            title="Chat on WhatsApp"
          >
            <MessageCircle size={13} />
          </button>
          
          <button
            onClick={handleDirections}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            title="Open in Google Maps"
          >
            <Navigation size={13} />
          </button>
        </div>

        <Link
          to={`/business/${business.id}`}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Details</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default BusinessCard;
