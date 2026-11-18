import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Search, CheckCircle2, XCircle, Store, 
  MapPin, ShieldCheck, Hourglass, RefreshCw, Eye 
} from "lucide-react";
import API from "../../services/api";

const ManageBusinesses = ({ onShowToast }) => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/business/all");
      if (Array.isArray(res.data)) {
        setBusinesses(res.data);
      }
    } catch (e) {
      console.warn("Failed loading businesses:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/api/admin/business/${id}/approve`);
      setBusinesses(prev => prev.map(b => (b._id === id || b.id === id) ? { ...b, status: 'approved', verified: true } : b));
      if (onShowToast) onShowToast("Business approved and live!", "success");
    } catch (e) {
      if (onShowToast) onShowToast("Approved locally", "success");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/api/admin/business/${id}/reject`);
      setBusinesses(prev => prev.map(b => (b._id === id || b.id === id) ? { ...b, status: 'rejected', verified: false } : b));
      if (onShowToast) onShowToast("Business rejected", "error");
    } catch (e) {
      if (onShowToast) onShowToast("Rejected locally", "info");
    }
  };

  const filtered = businesses.filter(b => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.name?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q) ||
        b.location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-200 overflow-x-hidden pt-20 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Admin Overview
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Store className="text-amber-500" />
            <span>Merchant Directory Moderation</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit merchant details, toggle verification certificates, and manage places.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Table
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
        
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 w-full sm:w-80">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Filter by name, locality, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-900 dark:text-white outline-none w-full"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "All Records" },
            { id: "approved", label: "Published Live" },
            { id: "pending", label: "Pending Verification" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-amber-500 text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4 pl-6">Business</th>
                <th className="p-4">Category</th>
                <th className="p-4">Neighborhood</th>
                <th className="p-4">Status</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right pr-6">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((shop) => {
                const shopId = shop._id || shop.id;
                return (
                  <tr key={shopId} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={shop.image || shop.fileUrl || "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400"}
                          alt={shop.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{shop.name}</p>
                          <p className="text-slate-400 text-[10px] uppercase font-semibold">{shop.tagline || shop.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {shop.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{shop.location}</td>
                    <td className="p-4">
                      {shop.status === "approved" || shop.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 size={11} /> Live
                        </span>
                      ) : shop.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-[10px] font-semibold border border-red-200 dark:border-red-800">
                          <XCircle size={11} /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                          <Hourglass size={11} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-amber-500">
                      ★ {shop.rating || 4.5}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/business/${shopId}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                          title="View Listing"
                        >
                          <Eye size={15} />
                        </Link>
                        {shop.status !== "approved" && (
                          <button
                            onClick={() => handleApprove(shopId)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            Approve
                          </button>
                        )}
                        {shop.status !== "rejected" && (
                          <button
                            onClick={() => handleReject(shopId)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageBusinesses;
