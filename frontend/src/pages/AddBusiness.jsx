import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Store, MapPin, Phone, Clock, Upload, ArrowRight, 
  ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Plus, 
  Image as ImageIcon, DollarSign, Tag, Check, Star 
} from "lucide-react";
import { addBusinessApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Medical", "Food", "Cafe", "Gym", "Electronics", 
  "Salon", "Auto", "Grocery", "Bakery", "Education", "Shopping"
];

const PRESET_IMAGES = [
  { label: "Pharmacy / Medical", url: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?w=800" },
  { label: "Food / Restaurant", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800" },
  { label: "Modern Cafe", url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800" },
  { label: "Fitness Gym", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800" },
  { label: "Electronics", url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800" },
  { label: "Salon & Spa", url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800" },
  { label: "Car Detailing", url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800" },
];

const AMENITY_OPTIONS = [
  "Card Payment", "UPI Accepted", "Air Conditioned", "Parking Available",
  "High Speed Wi-Fi", "Home Delivery", "Wheelchair Accessible", "Open 24/7"
];

const AddBusiness = ({ onShowToast }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Medical",
    tagline: "",
    description: "",
    city: "Surat",
    location: "Varachha, Surat",
    address: "",
    phone: "",
    whatsapp: "",
    email: user?.email || "",
    website: "",
    timing: "09:00 AM - 09:00 PM",
    priceRange: "₹₹",
    fileUrl: PRESET_IMAGES[0].url,
    tags: ["Card Payment", "UPI Accepted", "Air Conditioned"],
    products: [
      { name: "Signature Service / Item", price: "₹250" }
    ]
  });

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...formData.products];
    updated[index][field] = value;
    setFormData({ ...formData, products: updated });
  };

  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: "", price: "" }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      if (onShowToast) onShowToast("Please enter business name and phone", "error");
      setStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const res = await addBusinessApi({
        ...formData,
        ownerName: user?.name || "Business Partner",
        status: "pending"
      });
      setCreatedId(res._id || res.id || "1");
      setSubmittedSuccess(true);
      if (onShowToast) onShowToast("Business registration submitted for verification!", "success");
    } catch (err) {
      if (onShowToast) onShowToast("Error submitting business", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-200 overflow-x-hidden pt-20 pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Directory
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Store className="text-indigo-600 dark:text-indigo-400" />
            <span>List Your Business in Surat</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showcase your products, receive verified WhatsApp inquiries, and get ranked in your neighborhood.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="mb-8 max-w-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-soft">
          {[
            { num: 1, title: "Basic Info" },
            { num: 2, title: "Location & Hours" },
            { num: 3, title: "Media & Amenities" },
            { num: 4, title: "Catalog & Submit" },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setStep(s.num)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? "bg-indigo-600 text-white shadow-sm scale-105"
                  : step > s.num
                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}>
                {step > s.num ? <Check size={14} strokeWidth={3} /> : s.num}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${
                step === s.num ? "text-slate-900 dark:text-white" : "text-slate-400 group-hover:text-slate-600"
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Success Modal */}
        {submittedSuccess && (
          <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Registration Received!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{formData.name}</span> has been submitted to the LocalRank verification queue. Admin will inspect and verify your profile.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/business/${createdId}`)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Preview Your Listing
                </button>
                <Link
                  to="/"
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Layout: Form & Live Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Step Forms */}
          <div className="lg:col-span-2 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-soft">
            
            {/* STEP 1: BASICS */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Step 1: Business Identity
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Enter your brand name, category, and direct contact numbers.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Business / Store Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Balaji Medicals & Surgical"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Category Sector *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const cat = e.target.value;
                          const found = PRESET_IMAGES.find(p => p.label.toLowerCase().includes(cat.toLowerCase()));
                          setFormData({ 
                            ...formData, 
                            category: cat,
                            fileUrl: found ? found.url : formData.fileUrl 
                          });
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Price Range *
                      </label>
                      <select
                        value={formData.priceRange}
                        onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="₹">₹ - Budget Friendly</option>
                        <option value="₹₹">₹₹ - Moderate</option>
                        <option value="₹₹₹">₹₹₹ - Premium</option>
                        <option value="₹₹₹₹">₹₹₹₹ - Luxury</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Catchy Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 24x7 Medicines & Emergency Supplies in Surat"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Primary Phone *
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: formData.whatsapp || e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        WhatsApp Number (For Direct Chats)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (!formData.name) {
                        if (onShowToast) onShowToast("Please enter business name", "error");
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    Next: Location & Hours <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION & HOURS */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Step 2: Location & Operating Hours
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Help customers find your store easily and know when you're open.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Surat"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Area / Neighborhood *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Varachha, Adajan, Vesu, Piplod"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Full Address (Landmark, Shop Number, Street) *
                    </label>
                    <input
                      type="text"
                      placeholder="Shop 12-14, Ground Floor, Main Road..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Operating Hours *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 09:00 AM - 10:00 PM or 24 Hours"
                        value={formData.timing}
                        onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Website or Instagram Page
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    Next: Media & Amenities <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: MEDIA & AMENITIES */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Step 3: Cover Photo & Features
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Upload or choose a cover picture and highlight your facilities.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Preset Quick Select */}
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-2">
                      Or pick a professional photo template:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_IMAGES.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({ ...formData, fileUrl: preset.url })}
                          className={`p-2.5 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                            formData.fileUrl === preset.url
                              ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                          }`}
                        >
                          <span className="truncate block">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities / Tags Selector */}
                  <div className="pt-2">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                      Select Available Amenities
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {AMENITY_OPTIONS.map((tag) => {
                        const isSelected = formData.tags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <span>{tag}</span>
                            {isSelected && <Check size={13} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    Next: Catalog & Submit <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CATALOG & SUBMIT */}
            {step === 4 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Step 4: Top Products & Final Review
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Add a few of your best-selling items or services so visitors can explore your offerings.
                  </p>
                </div>

                {/* About place description */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    About Your Establishment *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your quality, heritage, specialty, and services..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Product Rows */}
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                    Product / Menu Highlights
                  </label>

                  {formData.products.map((prod, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <input
                        placeholder="Product / Service Name"
                        value={prod.name}
                        onChange={(e) => handleProductChange(idx, "name", e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                      <input
                        placeholder="Price (e.g. ₹150)"
                        value={prod.price}
                        onChange={(e) => handleProductChange(idx, "price", e.target.value)}
                        className="w-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addProductRow}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Plus size={14} /> Add Another Product
                  </button>
                </div>

                {/* Verification Notice */}
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-start gap-3">
                  <ShieldCheck size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    By submitting, your listing will be cataloged and verified by the LocalRank Admin console. You can track views, inquiries, and customer reviews from your Partner Dashboard.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>{submitting ? "Submitting..." : "Submit Listing"}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right 1 Col: Live Real-Time Card Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Real-Time Preview
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                Directory View
              </span>
            </div>

            {/* Simulated Business Card */}
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-soft relative overflow-hidden">
              <div className="h-48 rounded-xl overflow-hidden mb-3 relative bg-slate-100 dark:bg-slate-900">
                <img
                  src={formData.fileUrl || PRESET_IMAGES[0].url}
                  alt="Live preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                
                <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-800 dark:text-white border border-white/20">
                  {formData.category}
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-900 dark:text-white">
                    <Star size={11} className="text-amber-500 fill-amber-500" />
                    <span>New Listing</span>
                  </div>
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {formData.priceRange || "₹₹"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {formData.name || "Your Business Name"}
                  </h3>
                  <span className="text-emerald-500 shrink-0">
                    <ShieldCheck size={16} />
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {formData.tagline || formData.description || "Your catchy business description will appear right here."}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin size={13} className="text-indigo-500 shrink-0" />
                    <span className="truncate">{formData.location || "Surat"}</span>
                  </span>
                  <span className="text-emerald-600 font-semibold text-[11px]">
                    Open Now
                  </span>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {formData.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium">
              This is how your place appears to customers browsing LocalRank.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AddBusiness;
