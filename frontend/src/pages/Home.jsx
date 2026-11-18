import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Search, MapPin, Star, Activity, Utensils, Coffee, 
  Dumbbell, Zap, Sparkles, SlidersHorizontal, ChevronRight, 
  ShieldCheck, Heart, Grid, List, CheckCircle2, TrendingUp, 
  Store, Award, Clock, ArrowRight, X, PhoneCall, RefreshCw, 
  Navigation, Crosshair, Map, LayoutGrid, Car, Laptop, 
  Home as HomeIcon, MoreHorizontal, Users, Plus 
} from "lucide-react";
import BusinessCard from "../components/BusinessCard";
import MapView from "../components/MapView";
import { fetchAllBusinesses } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import { useLocation, LOCALITIES, formatDistance } from "../context/LocationContext";

const CATEGORIES_LIST = [
  { name: "All", label: "All Categories", icon: <LayoutGrid size={22} /> },
  { name: "Medical", label: "Medical &\nHealth", icon: <Activity size={22} /> },
  { name: "Food", label: "Food &\nDining", icon: <Utensils size={22} /> },
  { name: "Cafe", label: "Cafes &\nHangouts", icon: <Coffee size={22} /> },
  { name: "Gym", label: "Gym &\nFitness", icon: <Dumbbell size={22} /> },
  { name: "Salon", label: "Salon &\nSpa", icon: <Sparkles size={22} /> },
  { name: "Auto", label: "Auto &\nDetailing", icon: <Car size={22} /> },
  { name: "Electronics", label: "Tech &\nGadgets", icon: <Laptop size={22} /> },
  { name: "Grocery", label: "Home\nServices", icon: <HomeIcon size={22} /> },
  { name: "Bakery", label: "More", icon: <MoreHorizontal size={22} /> },
];

const Home = ({ onShowToast }) => {
  const [searchParams] = useSearchParams();
  const { favorites } = useFavorites();
  const { 
    selectedLocality, 
    isDetecting, 
    isGpsActive, 
    detectLiveLocation, 
    changeLocality,
    calculateDistanceTo 
  } = useLocation();

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("distance"); // Nearest first
  const [maxDistanceRadius, setMaxDistanceRadius] = useState("all");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [only4Plus, setOnly4Plus] = useState(false);
  const [showOnlySaved, setShowOnlySaved] = useState(searchParams.get("favorites") === "true");
  
  // View mode: 'grid' | 'list' | 'map'
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(9);

  // Sync favorites param
  useEffect(() => {
    if (searchParams.get("favorites") === "true") {
      setShowOnlySaved(true);
    }
  }, [searchParams]);

  // Load businesses
  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const data = await fetchAllBusinesses({
        category: selectedCategory !== "All" ? selectedCategory : undefined
      });
      setBusinesses(data);
    } catch (err) {
      console.error("Load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, [selectedCategory]);

  // Handle GPS detection
  const handleDetectLocation = async () => {
    const res = await detectLiveLocation();
    if (res.success) {
      if (onShowToast) onShowToast("Live GPS active! Sorted by nearest places.", "success");
      setSortBy("distance");
    } else {
      if (onShowToast) onShowToast(res.msg, "info");
    }
  };

  // Filter & sort logic
  const filteredBusinesses = useMemo(() => {
    let list = businesses.filter(b => {
      if (showOnlySaved && !favorites.includes(b.id)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesCat = b.category.toLowerCase().includes(q);
        const matchesLoc = b.location.toLowerCase().includes(q);
        const matchesDesc = (b.desc || "").toLowerCase().includes(q);
        const matchesTags = (b.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesLoc && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      if (maxDistanceRadius !== "all") {
        const maxKm = Number(maxDistanceRadius);
        const coords = b.coordinates || { lat: 21.1702, lng: 72.8311 };
        const d = calculateDistanceTo(coords.lat, coords.lng);
        if (d !== null && d > maxKm) return false;
      }

      if (onlyVerified && !b.verified) return false;
      if (only4Plus && (b.rating || 0) < 4.5) return false;

      return true;
    });

    list.sort((a, b) => {
      if (sortBy === "distance") {
        const coordsA = a.coordinates || { lat: 21.1702, lng: 72.8311 };
        const coordsB = b.coordinates || { lat: 21.1702, lng: 72.8311 };
        const distA = calculateDistanceTo(coordsA.lat, coordsA.lng) || 999;
        const distB = calculateDistanceTo(coordsB.lat, coordsB.lng) || 999;
        return distA - distB;
      } else if (sortBy === "highest-rated") {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === "most-reviewed") {
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      } else if (sortBy === "smart-score") {
        return (b.smartScore || 0) - (a.smartScore || 0);
      }
      return 0;
    });

    return list;
  }, [
    businesses, 
    searchQuery, 
    showOnlySaved, 
    favorites, 
    maxDistanceRadius, 
    onlyVerified, 
    only4Plus, 
    sortBy, 
    calculateDistanceTo
  ]);

  // Spotlight places
  const spotlightBusinesses = useMemo(() => {
    return businesses.filter(b => b.featured || (b.rating || 0) >= 4.8).slice(0, 3);
  }, [businesses]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans text-left selection:bg-indigo-500/20 overflow-x-hidden pt-16">
      
      {/* ============================================================
          1. EXACT HERO SECTION MATCHING USER'S SCREENSHOT
          ============================================================ */}
      <section className="relative bg-[#0a0d1b] pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-left">
        
        {/* Ambient Glowing Purple Arcs */}
        <div className="absolute -top-24 right-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        {/* Decorative Ring on far right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 border-[12px] border-purple-600/20 rounded-full blur-[1px] pointer-events-none hidden lg:block -mr-48"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (7 cols): Heading, Eyebrow, CTAs, Stats */}
          <div className="lg:col-span-7 space-y-6 z-10">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white">
              <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              <span>Verified Local Business Directory</span>
            </div>

            {/* Giant Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
              Find & Discover <br />
              Top Local Businesses <br />
              in <span className="text-[#a855f7] relative inline-block">
                Your Area
                <svg className="absolute -bottom-2 left-0 w-full text-purple-500" viewBox="0 0 200 12" fill="none">
                  <path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
              Explore trusted shops, clinics, restaurants, services and more — with real ratings, contact details, and quick support.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("search-anchor");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] hover:opacity-95 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Search size={14} />
                <span>Explore Businesses</span>
                <ArrowRight size={14} />
              </button>

              <Link
                to="/add-business"
                className="px-7 py-3.5 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wide transition-all"
              >
                List Your Business
              </Link>
            </div>

            {/* Horizontal Stats Row */}
            <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Store size={18} />
                </div>
                <div>
                  <p className="text-xl font-black text-white leading-none">10K+</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">Listed Businesses</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Star size={18} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xl font-black text-white leading-none">4.8/5</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">Average Rating</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xl font-black text-white leading-none">25K+</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">Happy Users</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): The Signature Slanted 4-Card Collage */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            
            {/* 4 Tilted Slanted Image Cards */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 -skew-x-[6deg] sm:-skew-x-[8deg] transition-transform">
              
              {/* Card 1: Restaurant/Dining with warm pendant lamps */}
              <div className="w-24 sm:w-32 md:w-36 h-64 sm:h-80 md:h-[380px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative shrink-0 group">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
                  alt="Restaurant Dining"
                  className="w-full h-full object-cover scale-110 group-hover:scale-120 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Card 2: Modern Fitness Gym with weights & gym machines */}
              <div className="w-24 sm:w-32 md:w-36 h-72 sm:h-88 md:h-[410px] rounded-3xl overflow-hidden border border-white/25 shadow-2xl relative shrink-0 -translate-y-4 group">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
                  alt="Gym & Fitness"
                  className="w-full h-full object-cover scale-110 group-hover:scale-120 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Card 3: Boutique Fashion Clothing Racks */}
              <div className="w-24 sm:w-32 md:w-36 h-72 sm:h-88 md:h-[410px] rounded-3xl overflow-hidden border border-white/25 shadow-2xl relative shrink-0 -translate-y-2 group">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                  alt="Fashion Boutique"
                  className="w-full h-full object-cover scale-110 group-hover:scale-120 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Card 4: Luxury Salon Styling Chair & Mirrors */}
              <div className="w-24 sm:w-32 md:w-36 h-64 sm:h-80 md:h-[380px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative shrink-0 translate-y-3 group hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"
                  alt="Salon & Spa"
                  className="w-full h-full object-cover scale-110 group-hover:scale-120 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

            </div>

            {/* Floating Verified Businesses Pill badge over bottom of cards */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 z-20 bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl shadow-purple-900/40 px-5 py-3 rounded-full flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Verified Businesses
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Real ratings • Updated information
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ============================================================
          2. FLOATING COMMAND SEARCH BAR (BETWEEN DARK HERO & WHITE BODY)
          ============================================================ */}
      <div id="search-anchor" className="relative z-30 -mt-8 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-2xl shadow-indigo-950/15 border border-slate-100 flex flex-col md:flex-row items-center gap-2 sm:gap-3 text-slate-800">
          
          {/* Left: Search input */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search for shops, services, or businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Vertical divider */}
          <div className="hidden md:block w-[1px] h-8 bg-slate-200"></div>

          {/* Middle: Locality dropdown & GPS */}
          <div className="flex items-center gap-2 px-3 py-1.5 w-full md:w-auto shrink-0 justify-between md:justify-start">
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-indigo-600 shrink-0" />
              <select
                value={selectedLocality}
                onChange={(e) => changeLocality(e.target.value)}
                className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer text-xs pr-1"
              >
                {Object.keys(LOCALITIES).map((loc) => (
                  <option key={loc} value={loc} className="text-slate-800">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* GPS detect quick button */}
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                isGpsActive 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200"
              }`}
              title="Detect live GPS location"
            >
              <Crosshair size={12} className={isDetecting ? "animate-spin text-purple-600" : isGpsActive ? "text-emerald-500" : "text-slate-400"} />
              <span>{isGpsActive ? "GPS Active" : "GPS"}</span>
            </button>
          </div>

          {/* Right: Purple Search Button */}
          <button
            onClick={() => {
              if (onShowToast) onShowToast(`Searching: ${searchQuery || selectedCategory}`);
            }}
            className="w-full md:w-auto px-8 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs tracking-wide rounded-2xl shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-all active:scale-95"
          >
            <Search size={15} />
            <span>Search</span>
          </button>

        </div>
      </div>


      {/* ============================================================
          3. BROWSE BY CATEGORY (EXACT CARDS ROW FROM SCREENSHOT)
          ============================================================ */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Browse by <span className="text-[#7C3AED]">Category</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Discover businesses from various categories
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory("All");
              setShowOnlySaved(false);
            }}
            className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* 10 Category Cards Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setShowOnlySaved(false);
                }}
                className={`h-32 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-gradient-to-b from-[#6366F1] to-[#8B5CF6] text-white border-transparent shadow-lg shadow-indigo-500/25 scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-200/90 hover:border-indigo-400 hover:shadow-md"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                  isSelected 
                    ? "text-white" 
                    : "bg-purple-50 text-[#7C3AED]"
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-[11px] font-bold leading-snug whitespace-pre-line ${
                  isSelected ? "text-white" : "text-slate-800"
                }`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

      </section>


      {/* ============================================================
          4. FEATURED SPOTLIGHT ESTABLISHMENTS IN SURAT
          ============================================================ */}
      {!showOnlySaved && selectedCategory === "All" && !searchQuery && spotlightBusinesses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award size={18} className="text-amber-500" />
                Featured in Surat
              </h2>
              <p className="text-xs text-slate-500">
                Top rated local spots with verified customer visits
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {spotlightBusinesses.map((spot) => {
              const coords = spot.coordinates || { lat: 21.1702, lng: 72.8311 };
              const distStr = formatDistance(calculateDistanceTo(coords.lat, coords.lng));

              return (
                <div
                  key={spot.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 flex gap-4 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                >
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-100"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        {spot.category}
                      </span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Star size={11} fill="currentColor" /> {spot.rating}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                      {spot.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{spot.location}</p>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-indigo-600 text-[11px] font-bold flex items-center gap-1">
                        <Navigation size={11} className="text-indigo-500" />
                        {distStr}
                      </span>
                      <Link
                        to={`/business/${spot.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs flex items-center gap-0.5"
                      >
                        Visit <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}


      {/* ============================================================
          5. DIRECTORY LISTINGS WITH DISTANCE FILTER & MAP RADAR
          ============================================================ */}
      <section id="directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
          
          {/* Left: Heading & Count */}
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">
              {showOnlySaved ? "Saved Places" : `${selectedCategory === "All" ? "All Verified Places" : selectedCategory} in Surat`}
            </h3>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
              {filteredBusinesses.length} spots
            </span>
          </div>

          {/* Center: Distance Radius Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Radius:</span>
            {[
              { label: "All Surat", val: "all" },
              { label: "< 2 km", val: "2" },
              { label: "< 5 km", val: "5" },
              { label: "< 10 km", val: "10" }
            ].map((r) => (
              <button
                key={r.val}
                onClick={() => setMaxDistanceRadius(r.val)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  maxDistanceRadius === r.val
                    ? "bg-[#7C3AED] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Right: Sort & Layout Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 outline-none cursor-pointer"
              >
                <option value="distance">📍 Distance (Nearest First)</option>
                <option value="highest-rated">★ Highest Rated</option>
                <option value="most-reviewed">👥 Most Reviewed</option>
                <option value="smart-score">🛡️ Community Score</option>
              </select>
            </div>

            {/* Layout Toggle: Grid, List, Map View */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#7C3AED] text-white shadow-2xs" : "text-slate-500 hover:text-slate-900"}`}
                title="Grid View"
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-[#7C3AED] text-white shadow-2xs" : "text-slate-500 hover:text-slate-900"}`}
                title="List View"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs px-2 font-semibold cursor-pointer ${
                  viewMode === "map" ? "bg-[#7C3AED] text-white shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Interactive Map Radar"
              >
                <Map size={13} />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>

        </div>

        {/* Listings Content */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <RefreshCw size={28} className="text-[#7C3AED] animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading neighborhood places...</p>
          </div>
        ) : filteredBusinesses.length > 0 ? (
          viewMode === "map" ? (
            /* INTERACTIVE NEIGHBORHOOD MAP RADAR */
            <MapView businesses={filteredBusinesses} />
          ) : (
            <div className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}>
              {filteredBusinesses.slice(0, visibleCount).map((shop) => (
                <BusinessCard
                  key={shop.id}
                  business={shop}
                  onShowToast={onShowToast}
                />
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="py-20 text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
            <MapPin size={32} className="text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Places Found in this Radius</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto mb-5">
              {maxDistanceRadius !== "all"
                ? `No businesses found within ${maxDistanceRadius} km of ${selectedLocality}. Try increasing the radius to 'All Surat' or choosing another area.`
                : "Try searching for a different keyword or category."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setMaxDistanceRadius("all");
                setShowOnlySaved(false);
              }}
              className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {viewMode !== "map" && filteredBusinesses.length > visibleCount && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Load More Places</span>
              <ChevronRight size={13} />
            </button>
          </div>
        )}

      </section>

    </div>
  );
};

export default Home;
