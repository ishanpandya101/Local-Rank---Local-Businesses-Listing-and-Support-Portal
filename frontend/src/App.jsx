import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CompareProvider } from "./context/CompareContext";
import { LocationProvider } from "./context/LocationContext";
import { ThemeProvider } from "./context/ThemeContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CompareBar from "./components/CompareBar";
import Toast from "./components/Toast";

// Pages
import Home from "./pages/Home";
import BusinessDetails from "./pages/BusinessDetails";
import Compare from "./pages/Compare";
import AddBusiness from "./pages/AddBusiness";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin & Partner Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBusinesses from "./pages/admin/ManageBusinesses";
import OwnerDashboard from "./pages/owner/OwnerDashboard";

function App() {
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3200);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <FavoritesProvider>
            <CompareProvider>
              <Router>
                <div className="bg-white dark:bg-[#0b0f19] min-h-screen text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors duration-200 selection:bg-indigo-500/20">
                
                {/* Toast Notification */}
                <Toast
                  show={toast.show}
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast({ show: false, message: "", type: "success" })}
                />

                {/* Fixed Glass Navbar */}
                <Navbar />

                {/* Content Router */}
                <div className="flex-1">
                  <Routes>
                    {/* Public Discovery Routes */}
                    <Route path="/" element={<Home onShowToast={showToast} />} />
                    <Route path="/business/:id" element={<BusinessDetails onShowToast={showToast} />} />
                    <Route path="/compare" element={<Compare onShowToast={showToast} />} />
                    <Route path="/add-business" element={<AddBusiness onShowToast={showToast} />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login onShowToast={showToast} />} />
                    <Route path="/register" element={<Register onShowToast={showToast} />} />

                    {/* Admin Console Routes */}
                    <Route path="/admin" element={<AdminDashboard onShowToast={showToast} />} />
                    <Route path="/admin/businesses" element={<ManageBusinesses onShowToast={showToast} />} />

                    {/* Business Partner Dashboard */}
                    <Route path="/owner" element={<OwnerDashboard onShowToast={showToast} />} />
                  </Routes>
                </div>

                {/* Sticky Comparison Tray */}
                <CompareBar />

                {/* Refined Footer */}
                <Footer />

              </div>
            </Router>
          </CompareProvider>
        </FavoritesProvider>
      </LocationProvider>
    </AuthProvider>
  </ThemeProvider>
);
}

export default App;
