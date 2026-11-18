import axios from "axios";
import { defaultBusinesses } from "../data/businessData";

// Backend API Base URL
export const API_BASE_URL = "http://localhost:5001";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000
});

// Inject token on each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["auth-token"] = token;
  }
  return config;
});

// Helper API functions with graceful fallback
export const fetchAllBusinesses = async (params = {}) => {
  try {
    const res = await API.get("/api/business/all", { params });
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map(formatBusiness);
    }
  } catch (err) {
    console.warn("API all businesses failed, using offline fallback:", err.message);
  }

  // Filter fallback data client-side
  let list = [...defaultBusinesses];
  if (params.category && params.category !== "All") {
    list = list.filter(b => b.category.toLowerCase() === params.category.toLowerCase());
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(b => 
      b.name.toLowerCase().includes(q) || 
      b.category.toLowerCase().includes(q) || 
      b.location.toLowerCase().includes(q) ||
      (b.desc && b.desc.toLowerCase().includes(q))
    );
  }
  return list.map(formatBusiness);
};

export const fetchBusinessById = async (id) => {
  try {
    const res = await API.get(`/api/business/${id}`);
    if (res.data) {
      return formatBusiness(res.data);
    }
  } catch (err) {
    console.warn(`API business ${id} failed, using offline fallback:`, err.message);
  }

  const found = defaultBusinesses.find(b => String(b.id) === String(id) || String(b._id) === String(id));
  return found ? formatBusiness(found) : null;
};

export const addBusinessApi = async (businessData) => {
  try {
    const res = await API.post("/api/business/add", businessData);
    return res.data;
  } catch (err) {
    console.warn("API add business failed, simulated response:", err.message);
    return {
      ...businessData,
      id: "local_" + Date.now(),
      status: "pending"
    };
  }
};

export const submitReviewApi = async (businessId, reviewData) => {
  try {
    const res = await API.post(`/api/business/${businessId}/review`, reviewData);
    return res.data;
  } catch (err) {
    console.warn("API submit review failed, simulated locally:", err.message);
    return { success: true, review: reviewData };
  }
};

export const submitInquiryApi = async (businessId, inquiryData) => {
  try {
    const res = await API.post(`/api/business/${businessId}/inquiry`, inquiryData);
    return res.data;
  } catch (err) {
    console.warn("API submit inquiry failed, simulated locally:", err.message);
    return { success: true, inquiry: inquiryData };
  }
};

// Normalize fields between backend schema and UI component props
function formatBusiness(item) {
  const id = item._id || item.id || String(Date.now());
  const rating = Number(item.avgRating || item.rating || 0);

  return {
    id,
    _id: id,
    name: item.name || "Local Business",
    category: item.category || "General",
    tagline: item.tagline || "Local verified business",
    location: item.location || "Surat, Gujarat",
    city: item.city || "Surat",
    address: item.address || item.location || "City Center",
    desc: item.desc || item.description || "Welcome to our establishment.",
    phone: item.phone || "+91 9876543210",
    whatsapp: item.whatsapp || item.phone || "+91 9876543210",
    website: item.website || "",
    email: item.email || "",
    timing: item.timing || "09:00 AM - 09:00 PM",
    priceRange: item.priceRange || "₹₹",
    image: item.fileUrl || item.image || "https://images.unsplash.com/photo-1528698827591-e19ccd7c8b04?w=800",
    gallery: Array.isArray(item.gallery) && item.gallery.length > 0 
      ? item.gallery 
      : [item.fileUrl || item.image || "https://images.unsplash.com/photo-1528698827591-e19ccd7c8b04?w=800"],
    rating,
    avgRating: rating,
    ratingCount: item.ratingCount || (item.ratings?.length || (item.reviews?.length || 10)),
    smartScore: Number(item.smartScore || (rating ? (rating * 1.9 + 0.4).toFixed(1) : 8.8)),
    sentimentScore: item.sentimentScore || 94,
    verified: item.verified !== undefined ? item.verified : true,
    featured: Boolean(item.featured),
    badge: item.badge || (rating >= 4.8 ? "Top Rated" : "Verified Pro"),
    tags: Array.isArray(item.tags) && item.tags.length > 0 
      ? item.tags 
      : ["Card Payment", "Parking Available", "Air Conditioned", "UPI Accepted"],
    products: Array.isArray(item.products) ? item.products : [],
    reviews: Array.isArray(item.ratings) 
      ? item.ratings.map(r => ({
          user: r.userName || "Verified Customer",
          userName: r.userName || "Verified Customer",
          userAvatar: r.userAvatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(r.userName || 'user')}`,
          rating: r.rating || 5,
          text: r.text || "",
          likes: r.likes || 0,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently"
        }))
      : (Array.isArray(item.reviews) ? item.reviews : []),
    inquiries: Array.isArray(item.inquiries) ? item.inquiries : [],
    status: item.status || "approved",
    views: item.views || 100
  };
}

export default API;
