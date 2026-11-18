import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ show, message, type = "success", onClose }) => {
  if (!show) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
    error: <AlertCircle size={18} className="text-red-500 shrink-0" />,
    info: <Info size={18} className="text-indigo-500 shrink-0" />
  };

  const styleColors = {
    success: "bg-white dark:bg-[#121927] border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100",
    error: "bg-white dark:bg-[#121927] border-red-200 dark:border-red-800 text-slate-800 dark:text-slate-100",
    info: "bg-white dark:bg-[#121927] border-indigo-200 dark:border-indigo-800 text-slate-800 dark:text-slate-100"
  };

  return (
    <div className="fixed top-20 right-6 z-[100] max-w-sm animate-in slide-in-from-right-8 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl ${styleColors[type] || styleColors.success}`}>
        {icons[type] || icons.success}
        <p className="text-xs font-semibold leading-snug flex-1">{message}</p>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
