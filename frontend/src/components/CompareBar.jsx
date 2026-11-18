import React from "react";
import { Link } from "react-router-dom";
import { Layers, X, ArrowRight } from "lucide-react";
import { useCompare } from "../context/CompareContext";

const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompare, compareCount } = useCompare();

  if (compareCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-white/95 dark:bg-[#121927]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 shrink-0">
            <Layers size={16} />
            <span className="hidden sm:inline">Compare</span>
            <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {compareCount}/3
            </span>
          </div>

          <div className="flex items-center gap-2">
            {compareList.map((item) => (
              <div 
                key={item.id}
                className="relative group shrink-0 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 pr-2.5 rounded-xl"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-white max-w-[90px] truncate hidden md:inline">
                  {item.name}
                </span>
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 transition-colors hidden sm:block cursor-pointer"
          >
            Clear
          </button>

          <Link
            to="/compare"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Compare Now</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CompareBar;
