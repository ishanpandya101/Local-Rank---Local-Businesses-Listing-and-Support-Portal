import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  UserPlus, MapPin, Store, User, ShieldCheck, AlertCircle 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = ({ onShowToast }) => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user" // 'user' or 'owner'
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const res = await register(form);
      if (res.success) {
        if (onShowToast) onShowToast("Account created successfully! Welcome to LocalRank.", "success");
        if (form.role === "owner") navigate("/owner");
        else navigate("/");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
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
            Create Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join LocalRank to review places or manage your business.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "user" })}
            className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              form.role === "user"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <User size={13} /> Customer / User
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "owner" })}
            className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              form.role === "owner"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Store size={13} /> Business Partner
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Full Name *
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Email Address *
            </label>
            <input
              required
              type="email"
              placeholder="priya@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Create Password *
            </label>
            <input
              required
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
            <UserPlus size={15} />
            <span>{loading ? "Creating..." : "Create Account"}</span>
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
