import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LogIn, MapPin, Star, ShieldCheck, Store, User, 
  ArrowRight, Sparkles, AlertCircle 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = ({ onShowToast }) => {
  const { login, quickLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const res = await login(form.email, form.password);
      if (res.success) {
        if (onShowToast) onShowToast(`Welcome back, ${res.user.name}!`, "success");
        if (res.user.role === "admin") navigate("/admin");
        else if (res.user.role === "owner") navigate("/owner");
        else navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    }
  };

  const handleQuickDemo = (role) => {
    const user = quickLogin(role);
    if (onShowToast) onShowToast(`Logged in as ${user.name} (${role})`, "success");
    if (role === "admin") navigate("/admin");
    else if (role === "owner") navigate("/owner");
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans flex items-center justify-center px-4 py-20 relative overflow-hidden transition-colors duration-200">
      
      <div className="w-full max-w-md bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-soft relative z-10 text-left">
        
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl shadow-md shadow-indigo-500/20 mb-1">
            <MapPin size={24} className="text-white fill-white/20" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your LocalRank account, reviews, or partner console.
          </p>
        </div>

        {/* 1-Click Fast Demo Buttons */}
        <div className="mb-6 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" /> Fast 1-Tap Demo Switch:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              className="py-2 px-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-xl text-[11px] font-bold tracking-wider transition-all cursor-pointer"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("owner")}
              className="py-2 px-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-xl text-[11px] font-bold tracking-wider transition-all cursor-pointer"
            >
              Partner
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("user")}
              className="py-2 px-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 rounded-xl text-[11px] font-bold tracking-wider transition-all cursor-pointer"
            >
              Customer
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. rahul@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LogIn size={15} />
            <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
