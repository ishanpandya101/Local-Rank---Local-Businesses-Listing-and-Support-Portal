import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#080c14] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-sans pt-14 pb-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                <MapPin size={18} className="text-white fill-white/20" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Local<span className="text-indigo-600 dark:text-indigo-400">Rank</span>
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Surat's verified neighborhood business directory. Real kilometer distance, authentic customer reviews, and direct WhatsApp contact with local store owners.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold pt-1">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
                <ShieldCheck size={14} /> 100% Verified Merchants
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Top Sectors</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li><Link to="/?category=Food" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Food & Gujarati Dining</Link></li>
              <li><Link to="/?category=Cafe" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Work-Friendly Cafes</Link></li>
              <li><Link to="/?category=Medical" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Medical & 24/7 Clinics</Link></li>
              <li><Link to="/?category=Gym" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Fitness & Gyms</Link></li>
              <li><Link to="/?category=Electronics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Gadgets & Tech Stores</Link></li>
              <li><Link to="/?category=Salon" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Salons & Spas</Link></li>
            </ul>
          </div>

          {/* Surat Neighborhoods */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Surat Localities</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Adajan & Pal</Link></li>
              <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Vesu & VIP Road</Link></li>
              <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Piplod & Dumas Road</Link></li>
              <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Varachha & Katargam</Link></li>
              <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Ghod Dod Road & Citylight</Link></li>
            </ul>
          </div>

          {/* Partner & Platform */}
          <div className="text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">For Businesses</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/add-business" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1 transition-colors">
                  List Your Business <ArrowUpRight size={14}/>
                </Link>
              </li>
              <li><Link to="/owner" className="hover:text-slate-900 dark:hover:text-white transition-colors">Partner Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-slate-900 dark:hover:text-white transition-colors">Admin Console</Link></li>
              <li><Link to="/compare" className="hover:text-slate-900 dark:hover:text-white transition-colors">Side-by-Side Comparison</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} LocalRank Surat. Verified neighborhood commerce platform.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Verification Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
