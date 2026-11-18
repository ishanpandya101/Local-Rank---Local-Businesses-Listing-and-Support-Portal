import mongoose from "mongoose";

// ⭐ Single Rating / Review Subschema
const ratingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, default: "Local Customer" },
    userAvatar: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

// 📬 Customer Inquiry Subschema
const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["New", "Contacted", "Closed"], default: "New" }
  },
  { _id: true }
);

// 🛍 Product / Service item Subschema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    isPopular: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true }
  },
  { _id: true }
);

const BusinessSchema = new mongoose.Schema(
  {
    // 🔐 Business owner
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ownerName: { type: String, default: "" },

    // 🏢 Business Core Info
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    tagline: { type: String, default: "" },
    location: { type: String, required: true, index: true },
    city: { type: String, default: "Surat", index: true },
    address: { type: String, default: "" },
    coordinates: {
      lat: { type: Number, default: 21.1702 },
      lng: { type: Number, default: 72.8311 }
    },
    description: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    website: { type: String, default: "" },
    email: { type: String, default: "" },
    timing: { type: String, default: "09:00 AM - 09:00 PM" },
    priceRange: { type: String, enum: ["₹", "₹₹", "₹₹₹", "₹₹₹₹"], default: "₹₹" },

    // 📎 Media
    fileUrl: { type: String, default: "" }, // Main / Cover Image
    logoUrl: { type: String, default: "" },
    gallery: [{ type: String }],

    // ⭐ Ratings & LocalRank Smart Score (Out of 10)
    ratings: { type: [ratingSchema], default: [] },
    avgRating: { type: Number, default: 4.5 },
    ratingCount: { type: Number, default: 12 },
    smartScore: { type: Number, default: 8.8 }, // AI Trust Score: 1.0 - 10.0
    sentimentScore: { type: Number, default: 92 }, // 0 - 100% positive

    // 🔥 Badges & Attributes
    verified: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    badge: { type: String, default: "Top Rated" }, // "Top Rated", "Trending", "24/7 Open", "Verified Pro"
    tags: [{ type: String }], // ["Card Payment", "Parking", "Wi-Fi", "AC", "Home Delivery"]

    // 🛍 Products & Services
    products: { type: [productSchema], default: [] },

    // 📬 Direct Inquiries
    inquiries: { type: [inquirySchema], default: [] },

    // 🔥 Admin approval status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true
    },

    // 📈 Stats
    views: { type: Number, default: 120 }
  },
  { timestamps: true }
);

// Virtual for ID mapping
BusinessSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
BusinessSchema.set('toJSON', { virtuals: true });

export default mongoose.model("Business", BusinessSchema);
