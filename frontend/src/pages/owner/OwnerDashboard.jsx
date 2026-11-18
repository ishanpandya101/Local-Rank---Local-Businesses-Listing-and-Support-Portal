import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Store, Package, Star, MessageSquare, 
  Settings, LogOut, TrendingUp, Users, PlusCircle, Trash2, 
  Edit, CheckCircle2, MapPin, Phone, Mail, ArrowUpRight, 
  Share2, ShieldCheck, Clock, MessageCircle, AlertCircle 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { defaultBusinesses } from "../../data/businessData";
import API from "../../services/api";

const OwnerDashboard = ({ onShowToast }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [business, setBusiness] = useState(defaultBusinesses[0]);
  const [products, setProducts] = useState(defaultBusinesses[0].products || []);
  const [inquiries, setInquiries] = useState(defaultBusinesses[0].inquiries || []);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    name: defaultBusinesses[0].name,
    phone: defaultBusinesses[0].phone,
    timing: defaultBusinesses[0].timing,
    location: defaultBusinesses[0].location
  });

  useEffect(() => {
    // Try loading owner's business from API
    const load = async () => {
      try {
        const res = await API.get("/api/business/owner/my-businesses");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBusiness(res.data[0]);
          setProducts(res.data[0].products || []);
          setInquiries(res.data[0].inquiries || []);
          setSettingsForm({
            name: res.data[0].name || "",
            phone: res.data[0].phone || "",
            timing: res.data[0].timing || "",
            location: res.data[0].location || ""
          });
        }
      } catch (e) {
        console.warn("Using default owner data fallback");
      }
    };
    load();
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      if (onShowToast) onShowToast("Please enter product name and price", "error");
      return;
    }

    const item = {
      name: newProduct.name,
      price: newProduct.price.startsWith("₹") ? newProduct.price : `₹${newProduct.price}`,
      description: newProduct.description || "Fresh in stock",
      isPopular: false,
      inStock: true
    };

    setProducts([item, ...products]);
    setNewProduct({ name: "", price: "", description: "" });
    setShowAddProductModal(false);
    if (onShowToast) onShowToast("New product added to catalog!", "success");
  };

  const handleDeleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
    if (onShowToast) onShowToast("Product removed from catalog", "info");
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setBusiness(prev => ({ ...prev, ...settingsForm }));
    if (onShowToast) onShowToast("Business details updated successfully!", "success");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans flex text-left pt-16 transition-colors duration-200">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-20 md:w-64 bg-white dark:bg-[#0e1320] border-r border-slate-200 dark:border-slate-800 flex flex-col fixed top-16 bottom-0 z-30 transition-all duration-300">
        
        {/* Partner Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold">
            <Store size={18} />
          </div>
          <div className="hidden md:block">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-none">Partner Hub</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Merchant Portal</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto no-scrollbar">
          {[
            { id: "dashboard", icon: <LayoutDashboard size={17} />, label: "Overview" },
            { id: "inquiries", icon: <MessageSquare size={17} />, label: `Inquiries (${inquiries.length})` },
            { id: "products", icon: <Package size={17} />, label: `Catalog (${products.length})` },
            { id: "reviews", icon: <Star size={17} />, label: "Customer Reviews" },
            { id: "settings", icon: <Settings size={17} />, label: "Store Settings" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className={activeTab === item.id ? "text-white" : "text-slate-500"}>
                {item.icon}
              </div>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all text-xs font-semibold cursor-pointer"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>

      </div>


      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-20 md:ml-64 p-6 sm:p-8 min-h-[calc(100vh-64px)] overflow-y-auto">
        
        {/* Top greeting banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
              Verified Merchant
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
              {business.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Welcome to your LocalRank Partner Management Hub.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to={`/business/${business.id}`}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowUpRight size={14} /> View Live Listing
            </Link>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle size={14} /> Add Item
            </button>
          </div>
        </div>

        {/* MODAL: ADD PRODUCT */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Add New Product / Menu Item
              </h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Item Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Surti Locho with Butter"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Price (₹) *
                  </label>
                  <input
                    required
                    placeholder="e.g. ₹90 or ₹450"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief details about this offering..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-semibold text-white shadow-sm cursor-pointer"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-soft">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Listing Views
                </span>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{business.views || 1420}</div>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <TrendingUp size={13} /> +18% this month
                </span>
              </div>

              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-soft">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Average Rating
                </span>
                <div className="text-3xl font-extrabold text-amber-500 flex items-center gap-2">
                  {business.rating || 4.8} <Star size={20} fill="currentColor" />
                </div>
                <span className="text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  Top 5% in category
                </span>
              </div>

              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-soft">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Customer Inquiries
                </span>
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {inquiries.length || 3}
                </div>
                <span className="text-blue-600 dark:text-blue-300 text-xs font-semibold">
                  Direct WhatsApp & Web leads
                </span>
              </div>

              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-soft">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Community Trust
                </span>
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {business.smartScore || 9.4} / 10
                </div>
                <span className="text-indigo-600 dark:text-indigo-300 text-xs font-semibold">
                  Verified Local Merchant
                </span>
              </div>
            </div>

            {/* Live Profile Card & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-5 shadow-soft">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full md:w-52 h-40 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                      {business.category}
                    </span>
                    <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Active & Live
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{business.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {business.tagline || business.desc}
                  </p>

                  <div className="pt-1 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="flex items-center gap-1.5"><MapPin size={13} className="text-indigo-600 dark:text-indigo-400"/> {business.location}</p>
                    <p className="flex items-center gap-1.5"><Clock size={13} className="text-indigo-600 dark:text-indigo-400"/> {business.timing}</p>
                    <p className="flex items-center gap-1.5"><Phone size={13} className="text-indigo-600 dark:text-indigo-400"/> {business.phone}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-soft">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick Actions
                </h3>
                <button
                  onClick={() => setActiveTab("products")}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-white transition-all text-left cursor-pointer border border-slate-200 dark:border-slate-800"
                >
                  <Package size={15} className="text-blue-500" />
                  <span>Update Catalog & Prices</span>
                </button>
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-white transition-all text-left cursor-pointer border border-slate-200 dark:border-slate-800"
                >
                  <MessageSquare size={15} className="text-indigo-500" />
                  <span>View Customer Inquiries</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-white transition-all text-left cursor-pointer border border-slate-200 dark:border-slate-800"
                >
                  <Settings size={15} className="text-slate-500" />
                  <span>Edit Contact & Timings</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES INBOX */}
        {activeTab === "inquiries" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Customer Inquiries Inbox
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Direct customer leads received via LocalRank
              </span>
            </div>

            {inquiries.length > 0 ? (
              <div className="space-y-3">
                {inquiries.map((inq, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-soft"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{inq.name}</h4>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1"><Phone size={13}/> {inq.phone}</span>
                          {inq.email && <span className="flex items-center gap-1"><Mail size={13}/> {inq.email}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${inq.phone}`}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                        >
                          <Phone size={13} /> Call
                        </a>
                        <button
                          onClick={() => {
                            const clean = inq.phone.replace(/\D/g, "");
                            window.open(`https://wa.me/${clean}?text=Hi%20${encodeURIComponent(inq.name)},%20replying%20to%20your%20inquiry%20from%20LocalRank.`, "_blank");
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                        >
                          <MessageCircle size={13} /> WhatsApp
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      "{inq.message}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-[#121927] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft">
                <MessageSquare size={36} className="text-slate-400 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">No Inquiries Yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  When customers visit your listing and click "Send Inquiry", their message and phone number will appear right here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS CATALOG */}
        {activeTab === "products" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Catalog & Price List
              </h3>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle size={14} /> Add Product
              </button>
            </div>

            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-soft">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="p-4 pl-6">Item Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 pl-6">
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</p>
                          {p.description && <p className="text-slate-500 text-xs mt-0.5">{p.description}</p>}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        {p.price}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold">
                          In Stock
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => handleDeleteProduct(i)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all cursor-pointer"
                          title="Delete item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Customer Feedback & Reviews
            </h3>

            {business.reviews && business.reviews.length > 0 ? (
              <div className="space-y-3">
                {business.reviews.map((rev, i) => (
                  <div key={i} className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2.5 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.userAvatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(rev.user || "customer")}`}
                          alt={rev.user}
                          className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rev.user || rev.userName}</h4>
                          <div className="flex text-amber-500 gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, s) => (
                              <Star key={s} size={11} fill={s < rev.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{rev.date || "2 days ago"}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-[#121927] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft">
                <Star size={36} className="text-slate-400 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">No Reviews Yet</h4>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STORE SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-300 shadow-soft">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Business Contact Details
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Store Display Name
                </label>
                <input
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Contact Phone
                </label>
                <input
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Operating Hours
                </label>
                <input
                  value={settingsForm.timing}
                  onChange={(e) => setSettingsForm({ ...settingsForm, timing: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Location Area
                </label>
                <input
                  value={settingsForm.location}
                  onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};

export default OwnerDashboard;
