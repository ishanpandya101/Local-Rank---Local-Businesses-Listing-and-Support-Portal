# 🌟 LocalRank - Modern Hyperlocal Business Discovery & Verified Directory

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**LocalRank** is a modern, responsive hyperlocal business discovery and verified directory web platform. Built with a midnight glassmorphic hero design, live GPS distance calculation (Haversine formula), real customer ratings, interactive map radar, side-by-side comparison, and dedicated merchant/admin management dashboards.

---

## ✨ Features & Highlights

### 1. 🎨 Modern Midnight & White UI
- **Midnight Glass Navbar**: Squircle branding, smooth navigation dropdowns, Surat locality selector pill (`📍 Adajan ⌵`), gradient `List Your Business` action button, saved places notification bell, and one-click role switcher avatar.
- **Hero Section**: Deep midnight navy aesthetic (`#0A0D1B`), cosmic glowing purple arcs, verified directory pill badge, call-to-actions, and live platform statistics (`10K+ Listed Businesses`, `4.8/5 Rating`, `25K+ Users`).
- **Signature 4 Tilted Cards Collage**: Dynamic skewed visual preview showcasing dining, fitness, boutique fashion, and luxury salon with a floating frosted `Verified Businesses` glass pill.
- **Floating Command Search Bar**: Sits seamlessly between the hero and body with instant keyword search, Surat neighborhood selector, live GPS detector, and quick search trigger.
- **Browse by Category Strip**: 10 rounded category cards including Medical, Food & Dining, Cafes, Gym, Salon & Spa, Auto Detailing, Tech & Gadgets, and Home Services with active gradient states.

### 2. 📍 Live Geolocation & Smart Distance Sorting
- **Real-Time GPS Detection**: One-click geolocation detects coordinates and sorts nearby listings from closest to farthest using the Haversine formula (`km` distance chips).
- **Surat Neighborhood Presets**: Adajan, Vesu, Pal, Piplod, Varachha, Katargam, Athwa, Rander, Majura, and City Light.
- **Distance Radius Filter**: Filter businesses within 2 km, 5 km, 10 km, or view all.

### 3. 🔍 Business Discovery & Directory
- **Interactive Map Radar**: Toggle between responsive Grid View, Compact List View, and interactive Map View.
- **Verified Pro Badges**: Real ratings, customer review counts, price tier (`₹` - `₹₹₹`), open/closed status indicator, and instant directions.
- **Favorite / Bookmark System**: Save favorite places with persistence and instant filter access.

### 4. ⚖️ Side-by-Side Business Comparison (`/compare`)
- Select up to 3 businesses into a comparison tray.
- Comprehensive comparison across ratings, distance, pricing, verified amenities (AC, Wi-Fi, Parking, Card Payment), operating hours, and direct contact options.

### 5. 🏢 Full Business Detail Page (`/business/:id`)
- Image lightboxes, address with Google Maps integration, direct click-to-call, and WhatsApp inquiry buttons.
- Product/Menu catalog with pricing in ₹ and availability status.
- Interactive customer review system with star breakdowns and review submission.

### 6. 🏪 Merchant Partner Onboarding & Dashboard (`/add-business` & `/owner`)
- **Multi-Step Onboarding Form**: Basic information, locality & coordinates, facilities/amenities, catalog items, and live card preview.
- **Partner Dashboard**: Track store views, direct customer inquiries, manage product catalogs, and update operating schedules.

### 7. 🛡️ Master Admin Console (`/admin`)
- Overview metrics: Total listings, pending verification requests, active users, and platform activity.
- 1-click verification approval/rejection and listing moderation.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React Icons, React Router 7, Axios
- **Backend**: Node.js, Express, MongoDB with Mongoose (with automated in-memory fallback store if database is offline)
- **Security & Auth**: JWT (JSON Web Tokens), bcryptjs password hashing, role-based route protection
- **Tools**: Concurrently, PostCSS, Autoprefixer

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/ishanpandya101/LocalRank.git
cd LocalRank
```

### 3. Install Dependencies
```bash
# Install root orchestration dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 4. Setup Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/localrank
JWT_SECRET=your_secret_key_here
```

### 5. Start Development Server
Run both frontend and backend concurrently with one command:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 👥 Demo Accounts for Testing

Use the profile icon in the top right navbar to switch roles instantly or log in with:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@localrank.com` | `1234` | Full Admin Console (`/admin`) |
| **Partner / Owner** | `owner@localrank.com` | `1234` | Merchant Dashboard (`/owner`) |
| **Customer** | `user@localrank.com` | `1234` | Public directory & reviews |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
