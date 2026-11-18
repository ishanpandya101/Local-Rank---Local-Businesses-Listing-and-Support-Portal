import mongoose from "mongoose";
import Business from "../models/Business.js";
import User from "../models/User.js";
import { initialBusinesses } from "../data/seedData.js";

// In-memory fallback dataset in case MongoDB Atlas is unreachable or slow
let memoryBusinesses = JSON.parse(JSON.stringify(initialBusinesses));

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const getAllBusinesses = async (filter = {}) => {
  if (isDbConnected()) {
    try {
      return await Business.find(filter).sort({ smartScore: -1, avgRating: -1 });
    } catch (e) {
      console.warn("DB Query failed, using memory store:", e.message);
    }
  }

  // Memory fallback filtering
  return memoryBusinesses.filter(b => {
    if (filter.status && b.status !== filter.status) return false;
    if (filter.category && filter.category !== 'All' && b.category.toLowerCase() !== filter.category.toLowerCase()) return false;
    return true;
  });
};

export const getBusinessById = async (id) => {
  if (isDbConnected()) {
    try {
      const b = await Business.findById(id).populate('ownerId', 'name email');
      if (b) {
        b.views = (b.views || 0) + 1;
        await b.save().catch(() => {});
        return b;
      }
    } catch (e) {
      console.warn("DB findById failed, checking memory store:", e.message);
    }
  }

  const found = memoryBusinesses.find(b => String(b._id) === String(id) || String(b.id) === String(id));
  if (found) {
    found.views = (found.views || 0) + 1;
  }
  return found;
};

export const createBusiness = async (data) => {
  if (isDbConnected()) {
    try {
      const newB = new Business(data);
      const saved = await newB.save();
      // Keep memory in sync
      memoryBusinesses.unshift(saved.toJSON());
      return saved;
    } catch (e) {
      console.warn("DB create failed, saving to memory store:", e.message);
    }
  }

  const fallbackItem = {
    ...data,
    _id: "65a0000000000000" + Math.floor(10000000 + Math.random() * 90000000),
    avgRating: 0,
    ratingCount: 0,
    smartScore: 8.0,
    sentimentScore: 85,
    views: 1,
    ratings: [],
    inquiries: [],
    status: data.status || "pending",
    createdAt: new Date()
  };
  memoryBusinesses.unshift(fallbackItem);
  return fallbackItem;
};

export const updateBusinessStatus = async (id, status) => {
  if (isDbConnected()) {
    try {
      const updated = await Business.findByIdAndUpdate(id, { status, verified: status === 'approved' }, { new: true });
      if (updated) {
        const idx = memoryBusinesses.findIndex(b => String(b._id) === String(id) || String(b.id) === String(id));
        if (idx !== -1) memoryBusinesses[idx].status = status;
        return updated;
      }
    } catch (e) {
      console.warn("DB update status failed:", e.message);
    }
  }

  const item = memoryBusinesses.find(b => String(b._id) === String(id) || String(b.id) === String(id));
  if (item) {
    item.status = status;
    item.verified = status === 'approved';
    return item;
  }
  return null;
};

export const addReviewToBusiness = async (id, reviewData) => {
  const newReview = {
    _id: "rev_" + Date.now(),
    userName: reviewData.userName || "Verified Customer",
    userAvatar: reviewData.userAvatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(reviewData.userName || 'user')}`,
    rating: Number(reviewData.rating) || 5,
    text: reviewData.text || "",
    likes: 0,
    createdAt: new Date()
  };

  if (isDbConnected()) {
    try {
      const b = await Business.findById(id);
      if (b) {
        b.ratings.unshift(newReview);
        const total = b.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        b.avgRating = Number((total / b.ratings.length).toFixed(1));
        b.ratingCount = b.ratings.length;
        b.smartScore = Number(Math.min(9.9, Math.max(7.0, b.avgRating * 1.9 + (b.ratingCount > 5 ? 0.5 : 0))).toFixed(1));
        await b.save();
        return b;
      }
    } catch (e) {
      console.warn("DB addReview failed, using memory store:", e.message);
    }
  }

  const b = memoryBusinesses.find(item => String(item._id) === String(id) || String(item.id) === String(id));
  if (b) {
    if (!b.ratings) b.ratings = [];
    b.ratings.unshift(newReview);
    const total = b.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    b.avgRating = Number((total / b.ratings.length).toFixed(1));
    b.ratingCount = b.ratings.length;
    b.smartScore = Number(Math.min(9.9, Math.max(7.0, b.avgRating * 1.9 + (b.ratingCount > 5 ? 0.5 : 0))).toFixed(1));
    return b;
  }
  return null;
};

export const addInquiryToBusiness = async (id, inquiryData) => {
  const newInquiry = {
    _id: "inq_" + Date.now(),
    name: inquiryData.name,
    phone: inquiryData.phone,
    email: inquiryData.email || "",
    message: inquiryData.message,
    status: "New",
    date: new Date()
  };

  if (isDbConnected()) {
    try {
      const b = await Business.findById(id);
      if (b) {
        b.inquiries.unshift(newInquiry);
        await b.save();
        return newInquiry;
      }
    } catch (e) {
      console.warn("DB addInquiry failed, using memory store:", e.message);
    }
  }

  const b = memoryBusinesses.find(item => String(item._id) === String(id) || String(item.id) === String(id));
  if (b) {
    if (!b.inquiries) b.inquiries = [];
    b.inquiries.unshift(newInquiry);
    return newInquiry;
  }
  return newInquiry;
};
