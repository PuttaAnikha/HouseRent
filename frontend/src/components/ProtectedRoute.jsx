import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * Route guard component to protect private pages.
 * Handles loading spinner, authentication redirect, and role-based authorization.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  const hasToken = !!localStorage.getItem('token');

  // Show a beautiful, modern spinner while loading profile details or propagating auth state
  if (loading || (hasToken && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-bgLight">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 animate-spin"></div>
        </div>
        <p className="mt-4 text-dark-500 font-medium animate-pulse">Loading Nestora...</p>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is allowed to access this route
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.warn(`User role '${user?.role}' is unauthorized for this route.`);
    return <Navigate to="/" replace />;
  }

  // Authenticated and authorized: Render children
  return children;
};

export default ProtectedRoute;
