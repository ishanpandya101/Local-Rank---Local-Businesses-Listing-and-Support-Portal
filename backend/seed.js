import mongoose from "mongoose";
import dotenv from "dotenv";
import Business from "./models/Business.js";

dotenv.config();

const oid = () => new mongoose.Types.ObjectId();

const data = [

  // OLD STYLE
  {
    ownerId: oid(),
    name: "Shree Medical",
    category: "Medical Store",
    location: "Surat",
    description: "24x7 medicines",
    phone: "9876500001",
    timing: "Always Open",
    fileUrl: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d",
    status: "approved",
    ratings: [{ userId: oid(), rating: 5, text: "Best medical" }]
  },

  {
    ownerId: oid(),
    name: "Fitness Pro Gym",
    category: "Gym",
    location: "Ahmedabad",
    description: "Modern fitness",
    phone: "9876500002",
    timing: "5AM-11PM",
    fileUrl: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
    status: "approved",
    ratings: [{ userId: oid(), rating: 4, text: "Good gym" }]
  },

  {
    ownerId: oid(),
    name: "Royal Cafe",
    category: "Cafe",
    location: "Vadodara",
    description: "Coffee hub",
    phone: "9876500003",
    timing: "10AM-12PM",
    fileUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
    status: "approved",
    ratings: [{ userId: oid(), rating: 5, text: "Nice place" }]
  },

  // NEW STYLE

  {
    ownerId: oid(),
    name: "Smart Tuition",
    category: "Education",
    location: "Navsari",
    description: "Maths & Science coaching",
    phone: "9876500004",
    timing: "4PM-9PM",
    fileUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    status: "approved",
    ratings: [{ userId: oid(), rating: 5, text: "Best teacher" }]
  },

  {
    ownerId: oid(),
    name: "City Electronics",
    category: "Electronics",
    location: "Rajkot",
    description: "Mobile & laptop repair",
    phone: "9876500005",
    timing: "10AM-9PM",
    fileUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    status: "approved",
    ratings: [{ userId: oid(), rating: 4, text: "Good service" }]
  },

  {
    ownerId: oid(),
    name: "Green Fresh Mart",
    category: "Grocery",
    location: "Surat",
    description: "Fresh vegetables",
    phone: "9876500006",
    timing: "7AM-10PM",
    fileUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e",
    status: "approved",
    ratings: [{ userId: oid(), rating: 5, text: "Fresh items" }]
  },

  {
    ownerId: oid(),
    name: "Style Studio Salon",
    category: "Salon",
    location: "Junagadh",
    description: "Hair & beauty care",
    phone: "9876500007",
    timing: "9AM-8PM",
    fileUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
    status: "approved",
    ratings: [{ userId: oid(), rating: 5, text: "Nice service" }]
  },

  {
    ownerId: oid(),
    name: "Taste of Gujarat",
    category: "Restaurant",
    location: "Bhavnagar",
    description: "Gujarati thali",
    phone: "9876500008",
    timing: "11AM-11PM",
    fileUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    status: "approved",
    ratings: [{ userId: oid(), rating: 4, text: "Tasty food" }]
  },

  {
    ownerId: oid(),
    name: "QuickFix Mobile",
    category: "Repair",
    location: "Surat",
    description: "Mobile repairing",
    phone: "9876500009",
    timing: "10AM-8PM",
    fileUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    status: "approved",
    ratings: [{ userId: oid(), rating: 5, text: "Fast repair" }]
  }

];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ DB Connected");

    await Business.deleteMany();

    await Business.insertMany(data);

    console.log("🔥 Mixed Dummy Data Inserted!");

    process.exit();

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

seedDB();
