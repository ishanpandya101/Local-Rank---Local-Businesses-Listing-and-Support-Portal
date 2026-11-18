import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Layers, ArrowLeft, Star, MapPin, Clock, Phone, 
  MessageCircle, ShieldCheck, Check, X, ArrowUpRight, 
  Sparkles, PlusCircle, Trash2 
} from "lucide-react";
import { useCompare } from "../context/CompareContext";
import { defaultBusinesses } from "../data/businessData";

const Compare = ({ onShowToast }) => {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const navigate = useNavigate();

  // If empty, allow user to preload top 2 businesses to test
  const loadDemoComparison = () => {
    clearCompare();
    addToCompare(defaultBusinesses[0]);
    addToCompare(defaultBusinesses[1]);
    if (onShowToast) onShowToast("Loaded demo businesses for comparison!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-200 overflow-x-hidden pt-20 pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Directory
            </button>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Layers className="text-indigo-600 dark:text-indigo-400" />
              <span>Side-by-Side Comparison</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluate ratings, Community TrustScore, price levels, operating timings, and amenities head-to-head.
            </p>
          </div>

          {compareList.length > 0 && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={clearCompare}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} /> Clear All
              </button>
              <Link
                to="/"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold tracking-wide shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={14} /> Add Another
              </Link>
            </div>
          )}
        </div>

        {/* Empty State */}
        {compareList.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-10 max-w-xl mx-auto space-y-4 shadow-soft">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 rounded-full flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
              <Layers size={30} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Businesses in Compare Tray
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-md mx-auto">
              Select businesses from the directory using the compare icon on each card, or load two demo places right now!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={loadDemoComparison}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={14} />
                Load Demo (Balaji Medical vs Radhe Dhokla)
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Browse Directory
              </Link>
            </div>
          </div>
        ) : (
          /* Comparison Table */
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <th className="p-5 w-44 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Criteria
                    </th>
                    {compareList.map((shop) => (
                      <th key={shop.id} className="p-5 min-w-[260px] align-top">
                        <div className="space-y-3 relative group">
                          <button
                            onClick={() => removeFromCompare(shop.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X size={13} />
                          </button>

                          <div className="h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                            <img
                              src={shop.image}
                              alt={shop.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              {shop.category}
                            </span>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                              {shop.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {shop.location}
                            </p>
                          </div>

                          <Link
                            to={`/business/${shop.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Full Profile <ArrowUpRight size={13} />
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  
                  {/* Community TrustScore */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-5 font-semibold text-slate-500 dark:text-slate-400">
                      Community Trust
                    </td>
                    {compareList.map((shop) => (
                      <td key={shop.id} className="p-5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            {shop.smartScore || 9.2}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">/ 10 TrustScore</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Rating & Reviews */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-5 font-semibold text-slate-500 dark:text-slate-400">
                      Customer Rating
                    </td>
                    {compareList.map((shop) => (
                      <td key={shop.id} className="p-5">
                        <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                          <Star size={14} fill="currentColor" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{shop.rating}</span>
                          <span className="text-slate-400 font-normal text-xs">
                            ({shop.ratingCount || 10} reviews)
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Verification Status */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-5 font-semibold text-slate-500 dark:text-slate-400">
                      Merchant Status
                    </td>
                    {compareList.map((shop) => (
                      <td key={shop.id} className="p-5">
                        {shop.verified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                            <ShieldCheck size={13} /> Verified Merchant
                          </span>
                        ) : (
                          <span className="text-slate-400">Unverified</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Price Level */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-5 font-semibold text-slate-500 dark:text-slate-400">
                      Price Range
                    </td>
                    {compareList.map((shop) => (
                      <td key={shop.id} className="p-5">
                        <span className="text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md">
                          {shop.priceRange || "₹₹"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Operating Hours */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-5 font-semibold text-slate-500 dark:text-slate-400">
                      Timings
                    </td>
                    {compareList.map((shop) => (
                      <td key={shop.id} className="p-5">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Clock size={13} className="text-slate-400 shrink-0" />
                          <span>{shop.timing}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Amenities / Tags */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-5 font-semibold text-slate-500 dark:text-slate-400">
                      Amenities
                    </td>
                    {compareList.map((shop) => (
                      <td key={shop.id} className="p-5">
                        <div className="flex flex-wrap gap-1.5">
                          {(shop.tags || ["Card Payment", "UPI Accepted"]).map((t, i) => (
                            <span key={i} className="text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Direct Contact Actions */}
                  <tr className="bg-slate-50/40 dark:bg-slate-900/30">
                    <td className="p-5 font-semibold text-slate-500 dark:text-slate-400">
                      Direct Contact
                    </td>
                    {compareList.map((shop) => (
                      <td key={shop.id} className="p-5">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${shop.phone}`}
                            className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-center font-semibold text-white text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Phone size={13} /> Call
                          </a>
                          <button
                            onClick={() => {
                              const cleanNumber = (shop.whatsapp || shop.phone || "").replace(/\D/g, "");
                              window.open(`https://wa.me/${cleanNumber}`, "_blank");
                            }}
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white transition-all shadow-2xs cursor-pointer"
                            title="WhatsApp Chat"
                          >
                            <MessageCircle size={15} />
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Compare;
