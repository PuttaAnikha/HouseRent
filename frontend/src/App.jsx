import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

// Shared Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Modular Components
import Home from './modules/common/Home.jsx';
import Login from './modules/common/Login.jsx';
import Register from './modules/common/Register.jsx';
import Properties from './modules/user/renter/AllProperties.jsx';
import PropertyDetails from './pages/PropertyDetails.jsx';
import Favorites from './pages/Favorites.jsx';
import Profile from './pages/Profile.jsx';
import OwnerDashboard from './modules/user/owner/OwnerHome.jsx';
import AdminDashboard from './modules/admin/AdminHome.jsx';
import MarketInsights from './pages/MarketInsights.jsx';
import Bookings from './modules/user/renter/RenterHome.jsx';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-bgLight">
          
          {/* Global Sticky Header */}
          <Navbar />

          {/* Main Layout Container */}
          <main className="flex-grow">
            <Routes>
              
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:propertyId" element={<PropertyDetails />} />
              <Route path="/insights" element={<MarketInsights />} />

              {/* Protected General Routes */}
              <Route
                path="/favourites"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Dashboard Routes - RBAC (Role-Based Access Control) */}
              <Route
                path="/dashboard/owner"
                element={
                  <ProtectedRoute allowedRoles={['owner', 'admin']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all Route: Redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
