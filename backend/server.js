import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import businessRoutes from './routes/business.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory first, then root fallback
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
}));

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/admin', adminRoutes);

// Root & Health Status
app.get('/', (req, res) => {
  res.json({
    app: 'LocalRank API',
    status: 'Running',
    version: '2.0.0',
    dbConnected: mongoose.connection.readyState === 1
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date(),
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Offline (In-Memory Active)'
  });
});

// Database Connection with non-blocking graceful fallback
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  console.log("🔌 Attempting MongoDB connection...");
  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 4000 // Fast failover to memory store
  })
  .then(() => console.log("✅ MongoDB Connected Successfully to Atlas"))
  .catch((err) => {
    console.warn("⚠️  MongoDB Atlas not reachable. LocalRank In-Memory Store Active (zero crash fallback). Error:", err.message);
  });
} else {
  console.log("ℹ️  No MONGO_URI specified, using bulletproof LocalRank In-Memory Store.");
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 LocalRank Server running on http://localhost:${PORT}`);
});
