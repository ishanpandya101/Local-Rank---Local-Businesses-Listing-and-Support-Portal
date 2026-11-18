import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  MapPin, Bell, User, ChevronDown, Check, ShieldCheck, 
  Store, Menu, X, Sparkles, Navigation 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation as useGeoLocation, LOCALITIES } from "../context/LocationContext";
import { useFavorites } from "../context/FavoritesContext";

const Navbar = () => {
  const { user, role, logout, quickLogin } = useAuth();
  const { selectedLocality, changeLocality } = useGeoLocation();
  const { favorites } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();

  const [localityOpen, setLocalityOpen] = useState(false);
  const [businessesOpen, setBusinessesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d1b]/90 backdrop-blur-xl border-b border-white/10 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 select-none group">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <MapPin size={18} className="text-white fill-white/20" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Local<span className="text-indigo-400">Rank</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-300">
            <Link
              to="/"
              className={`hover:text-white transition-colors ${isActive("/") ? "text-white font-bold" : ""}`}
            >
              Explore
            </Link>

            {/* Businesses Dropdown */}
            <div className="relative">
              <button
                onClick={() => setBusinessesOpen(!businessesOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                <span>Businesses</span>
                <ChevronDown size={13} className={`transition-transform ${businessesOpen ? "rotate-180" : ""}`} />
              </button>

              {businessesOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-[#12162a] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    to="/?category=Food"
                    onClick={() => setBusinessesOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Restaurants & Cafes
                  </Link>
                  <Link
                    to="/?category=Medical"
                    onClick={() => setBusinessesOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Hospitals & Clinics
                  </Link>
                  <Link
                    to="/?category=Gym"
                    onClick={() => setBusinessesOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Gyms & Fitness
                  </Link>
                  <Link
                    to="/compare"
                    onClick={() => setBusinessesOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs text-indigo-400 hover:bg-white/5 font-semibold transition-colors border-t border-white/5 mt-1 pt-2"
                  >
                    Compare Places
                  </Link>
                </div>
              )}
            </div>

            <a href="#categories" className="hover:text-white transition-colors">
              Categories
            </a>

            <Link to="/?category=Medical" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>

        {/* Right: Area Selector, List Button, Notifications, Avatar */}
        <div className="flex items-center gap-3">
          
          {/* Locality Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setLocalityOpen(!localityOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-colors cursor-pointer"
            >
              <MapPin size={13} className="text-indigo-400" />
              <span>{selectedLocality}</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>

            {localityOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#12162a] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5">
                  Surat Neighborhoods
                </p>
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {Object.keys(LOCALITIES).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        changeLocality(loc);
                        setLocalityOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedLocality === loc
                          ? "bg-indigo-600/30 text-indigo-300 font-bold"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{loc}</span>
                      {selectedLocality === loc && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* List Your Business Button (Gradient Pill) */}
          <Link
            to="/add-business"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#EC4899] hover:opacity-90 text-white font-semibold text-xs tracking-wide shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            <span>List Your Business</span>
          </Link>

          {/* Notification Bell */}
          <Link
            to="/?favorites=true"
            className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Saved places"
          >
            <Bell size={16} />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#0a0d1b]"></span>
            )}
          </Link>

          {/* User Avatar & Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="User Account & Roles"
            >
              <User size={16} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#12162a] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-white">{user?.name || "Guest Visitor"}</p>
                  <p className="text-[10px] text-gray-400">Role: <span className="capitalize font-semibold text-indigo-400">{role}</span></p>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 py-1">
                  Quick Demo Login
                </p>
                <button
                  onClick={() => {
                    quickLogin("user");
                    setProfileOpen(false);
                    navigate("/");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Customer View
                </button>
                <button
                  onClick={() => {
                    quickLogin("owner");
                    setProfileOpen(false);
                    navigate("/owner");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-blue-400 hover:bg-white/5 transition-colors"
                >
                  Partner Dashboard
                </button>
                <button
                  onClick={() => {
                    quickLogin("admin");
                    setProfileOpen(false);
                    navigate("/admin");
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-amber-400 hover:bg-white/5 transition-colors"
                >
                  Admin Console
                </button>

                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 mt-1 border-t border-white/5 text-xs text-red-400 hover:bg-white/5 transition-colors"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d1022] border-b border-white/10 px-5 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold uppercase text-white py-1"
          >
            Explore Directory
          </Link>
          <Link
            to="/add-business"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold uppercase text-pink-400 py-1"
          >
            List Your Business
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold uppercase text-gray-300 py-1"
          >
            Compare Places
          </Link>
          <Link
            to="/owner"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold uppercase text-blue-400 py-1"
          >
            Partner Hub
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-semibold uppercase text-amber-400 py-1"
          >
            Admin Panel
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
