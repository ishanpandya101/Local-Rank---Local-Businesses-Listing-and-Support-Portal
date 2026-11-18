import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Star, Heart, Share2, MapPin, Phone, 
  Clock, Globe, Mail, ShieldCheck, CheckCircle2, 
  Send, Layers, MessageCircle, Navigation, ExternalLink, 
  Check, X, Camera, Plus, ThumbsUp 
} from "lucide-react";
import { fetchBusinessById, submitReviewApi, submitInquiryApi } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import { useCompare } from "../context/CompareContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, formatDistance } from "../context/LocationContext";

const BusinessDetails = ({ onShowToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { calculateDistanceTo, selectedLocality } = useLocation();
  const { user } = useAuth();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Modals
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Inquiry Form
  const [inquiryData, setInquiryData] = useState({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    message: ""
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Review Form
  const [newReview, setNewReview] = useState({
    userName: user?.name || "",
    rating: 5,
    text: ""
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load business data
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const load = async () => {
      setLoading(true);
      const data = await fetchBusinessById(id);
      setBusiness(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white flex items-center justify-center pt-20">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading business profile...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white flex flex-col items-center justify-center pt-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Business Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-5 text-xs">
          The place you're looking for might have been moved or removed from our directory.
        </p>
        <Link to="/" className="px-5 py-2.5 bg-indigo-600 rounded-xl text-xs font-semibold text-white">
          Back to Directory
        </Link>
      </div>
    );
  }

  const isFav = isFavorite(business.id);
  const inComp = isInCompare(business.id);

  // Distance computation
  const coords = business.coordinates || { lat: 21.1702, lng: 72.8311 };
  const distanceKm = calculateDistanceTo(coords.lat, coords.lng);
  const formattedDistance = formatDistance(distanceKm);

  // Share link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      if (onShowToast) onShowToast("Profile link copied to clipboard!");
    }
  };

  // Submit Inquiry
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.phone || !inquiryData.message) {
      if (onShowToast) onShowToast("Please fill all required fields", "error");
      return;
    }

    setSubmittingInquiry(true);
    await submitInquiryApi(business.id, inquiryData);
    setSubmittingInquiry(false);
    setShowInquiryModal(false);
    setInquiryData({ name: user?.name || "", phone: "", email: user?.email || "", message: "" });
    if (onShowToast) onShowToast("Inquiry sent directly to store owner!", "success");
  };

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.text) {
      if (onShowToast) onShowToast("Please enter your review text", "error");
      return;
    }

    setSubmittingReview(true);
    await submitReviewApi(business.id, newReview);
    setSubmittingReview(false);
    setShowReviewModal(false);

    // Update locally
    const addedRev = {
      user: newReview.userName || "Verified Customer",
      userName: newReview.userName || "Verified Customer",
      userAvatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(newReview.userName || "user")}`,
      rating: newReview.rating,
      text: newReview.text,
      likes: 0,
      date: "Just now"
    };

    setBusiness(prev => ({
      ...prev,
      reviews: [addedRev, ...(prev.reviews || [])],
      ratingCount: (prev.ratingCount || 0) + 1,
      rating: Number(((prev.rating * prev.ratingCount + newReview.rating) / (prev.ratingCount + 1)).toFixed(1))
    }));

    setNewReview({ userName: user?.name || "", rating: 5, text: "" });
    if (onShowToast) onShowToast("Review posted successfully! Thank you for helping the neighborhood.", "success");
  };

  const handleWhatsApp = () => {
    const cleanNumber = (business.whatsapp || business.phone || "").replace(/\D/g, "");
    const url = `https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(business.name)},%20I%20found%20your%20listing%20on%20LocalRank.`;
    window.open(url, "_blank");
  };

  const handleDirections = () => {
    const query = encodeURIComponent(`${business.name}, ${business.address || business.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans text-left transition-colors duration-200 overflow-x-hidden pt-16 pb-20">
      
      {/* PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[85vh] w-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 p-2 cursor-pointer"
            >
              <X size={24} />
            </button>
            <img
              src={selectedPhoto}
              alt="Preview"
              className="w-full h-full max-h-[80vh] object-contain rounded-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* INQUIRY MODAL */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 relative">
            <button
              onClick={() => setShowInquiryModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="mb-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Direct Merchant Inquiry
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact {business.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The manager will reply to your inquiry via WhatsApp or phone.
              </p>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Your Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={inquiryData.name}
                  onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Message / Requirements *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ask about availability, medicine stock, prices, timings..."
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingInquiry}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send size={14} />
                <span>{submittingInquiry ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="mb-5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Community Feedback
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Review {business.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help other locals in Surat discover quality neighborhood places.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                  Your Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Star
                        size={22}
                        className={star <= newReview.rating ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-slate-700"}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                    {newReview.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Patel"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your experience, quality, staff, prices..."
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Star size={14} fill="currentColor" />
                <span>{submittingReview ? "Submitting..." : "Post Review"}</span>
              </button>
            </form>
          </div>
        </div>
      )}


      {/* MAIN HERO BANNER */}
      <div className="relative h-[42vh] min-h-[340px] w-full overflow-hidden bg-slate-900">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30"></div>

        {/* Top Back & Share Navigation */}
        <div className="absolute top-5 left-0 right-0 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (inComp) removeFromCompare(business.id);
                else addToCompare(business);
              }}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                inComp ? "bg-indigo-600 text-white" : "bg-black/60 text-white border border-white/20"
              }`}
              title="Compare"
            >
              <Layers size={16} />
            </button>

            <button
              onClick={() => toggleFavorite(business.id)}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                isFav ? "bg-pink-600 text-white" : "bg-black/60 text-white border border-white/20"
              }`}
              title="Save"
            >
              <Heart size={16} className={isFav ? "fill-white" : ""} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-8 max-w-7xl mx-auto z-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
                  {business.category}
                </span>

                {business.verified && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck size={13} /> Verified Merchant
                  </span>
                )}

                {formattedDistance && (
                  <span className="bg-slate-900/80 backdrop-blur-md text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
                    <Navigation size={11} className="text-indigo-400" />
                    {formattedDistance} from {selectedLocality}
                  </span>
                )}

                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Open Now
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                {business.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-medium flex items-center gap-1.5">
                <MapPin size={15} className="text-indigo-400 shrink-0" />
                <span>{business.address || business.location}</span>
              </p>
            </div>

            {/* Rating pill */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-2xl flex items-center gap-3.5 shrink-0 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400 leading-none">
                  {business.rating}
                </div>
                <div className="flex text-amber-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      fill={i < Math.floor(business.rating) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>

              <div className="h-8 w-[1px] bg-slate-700"></div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Community Trust
                </div>
                <div className="text-lg font-bold text-white">
                  {business.smartScore || 9.4} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* QUICK ACTION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-5">
        <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${business.phone}`}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Phone size={14} /> Call Store
            </a>

            <button
              onClick={handleWhatsApp}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageCircle size={14} /> WhatsApp
            </button>

            <button
              onClick={handleDirections}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold text-xs tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation size={14} /> Directions
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Send size={14} /> Send Inquiry
            </button>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-semibold text-xs tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Star size={13} fill="currentColor" /> Write Review
            </button>
          </div>

        </div>
      </div>


      {/* MAIN BODY: TABS & SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Tabs Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl overflow-x-auto no-scrollbar shadow-sm">
              {[
                { id: "overview", label: "Overview & Features" },
                { id: "products", label: `Catalog (${business.products?.length || 0})` },
                { id: "reviews", label: `Reviews (${business.reviews?.length || 0})` },
                { id: "photos", label: `Photos (${business.gallery?.length || 1})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    About {business.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal text-sm">
                    {business.desc}
                  </p>
                </div>

                <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Amenities & Services
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {(business.tags || [
                      "Card Payment", "Parking Available", "Air Conditioned", 
                      "UPI Accepted", "High Speed Wi-Fi", "Wheelchair Accessible"
                    ]).map((tag, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Previews */}
                <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Store Photos
                    </h3>
                    <button
                      onClick={() => setActiveTab("photos")}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      View All Photos
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(business.gallery || [business.image]).slice(0, 3).map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedPhoto(img)}
                        className="h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer group relative"
                      >
                        <img
                          src={img}
                          alt="preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera size={18} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS */}
            {activeTab === "products" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Available Products & Services
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Direct Store Pricing</span>
                </div>

                {business.products && business.products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {business.products.map((prod, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 p-4 rounded-2xl space-y-2 transition-colors flex flex-col justify-between shadow-sm"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                              {prod.name}
                            </h4>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-md">
                              {prod.price}
                            </span>
                          </div>
                          {prod.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                              {prod.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Available
                          </span>
                          <button
                            onClick={() => {
                              setInquiryData(prev => ({
                                ...prev,
                                message: `Hi, I would like to inquire about "${prod.name}" (${prod.price}).`
                              }));
                              setShowInquiryModal(true);
                            }}
                            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            Inquire Item →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white dark:bg-[#121927] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-400">No items listed in the digital catalog yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REVIEWS */}
            {activeTab === "reviews" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="text-center">
                      <div className="text-4xl font-extrabold text-amber-500 dark:text-amber-400 leading-none">
                        {business.rating}
                      </div>
                      <div className="flex text-amber-500 dark:text-amber-400 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < Math.floor(business.rating) ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 block">
                        {business.reviews?.length || 0} reviews
                      </span>
                    </div>

                    <div className="h-12 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                        Neighborhood Trust
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-normal">
                        Based on verified customer visits and active invoices in Surat.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    Write Review
                  </button>
                </div>

                <div className="space-y-3">
                  {business.reviews && business.reviews.length > 0 ? (
                    business.reviews.map((rev, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.userAvatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(rev.user || "customer")}`}
                              alt={rev.user}
                              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                                {rev.user || rev.userName || "Verified Customer"}
                              </h4>
                              <div className="flex text-amber-500 gap-0.5">
                                {[...Array(5)].map((_, s) => (
                                  <Star
                                    key={s}
                                    size={10}
                                    fill={s < rev.rating ? "currentColor" : "none"}
                                    className={s >= rev.rating ? "text-slate-300 dark:text-slate-700" : ""}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] text-slate-400 font-medium">
                            {rev.date || "Recently"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          "{rev.text}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-white dark:bg-[#121927] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <p className="text-xs text-slate-500 dark:text-slate-400">No customer reviews yet. Be the first!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: PHOTOS */}
            {activeTab === "photos" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(business.gallery || [business.image]).map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPhoto(img)}
                      className="h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer group relative shadow-sm"
                    >
                      <img
                        src={img}
                        alt={`gallery ${i}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera size={20} className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sidebar Widgets */}
          <div className="space-y-5">
            
            {/* Quick Contact Form */}
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-soft">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Send Direct Inquiry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Message the store manager directly on WhatsApp or call.
              </p>

              <form onSubmit={handleInquirySubmit} className="space-y-2.5 pt-1">
                <input
                  required
                  placeholder="Your Full Name"
                  value={inquiryData.name}
                  onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
                <input
                  required
                  placeholder="Phone / WhatsApp"
                  value={inquiryData.phone}
                  onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Your message / requirement..."
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send size={13} />
                  <span>{submittingInquiry ? "Sending..." : "Submit Inquiry"}</span>
                </button>
              </form>
            </div>

            {/* Store Information Card */}
            <div className="bg-white dark:bg-[#121927] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3.5 text-xs font-normal text-slate-700 dark:text-slate-300 shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Store Details
              </h3>

              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <MapPin size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Location</span>
                    <span className="text-slate-500 dark:text-slate-400">{business.address || business.location}</span>
                  </div>
                </div>

                {formattedDistance && (
                  <div className="flex gap-2.5">
                    <Navigation size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">Distance</span>
                      <span className="text-indigo-600 dark:text-indigo-300 font-semibold">{formattedDistance} from {selectedLocality}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2.5">
                  <Clock size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Hours</span>
                    <span className="text-slate-500 dark:text-slate-400">{business.timing}</span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <Phone size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Phone</span>
                    <a href={`tel:${business.phone}`} className="text-indigo-600 dark:text-indigo-300 hover:underline">
                      {business.phone}
                    </a>
                  </div>
                </div>

                {business.website && (
                  <div className="flex gap-2.5">
                    <Globe size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">Website</span>
                      <a href={business.website} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-300 hover:underline truncate block max-w-[180px]">
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default BusinessDetails;
