import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { propertyAPI, inquiryAPI } from '../services/api.js';
import PropertyCard from '../components/PropertyCard.jsx';
import { Link } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiEdit, 
  FiInfo, 
  FiHeart, 
  FiGrid, 
  FiCalendar, 
  FiCheckCircle, 
  FiClock, 
  FiMapPin,
  FiChevronRight
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('overview'); // overview, favorites, settings

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Renter specific states
  const [bookings, setBookings] = useState([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [stats, setStats] = useState({
    totalInquiries: 0,
    approvedInquiries: 0,
    pendingInquiries: 0,
    favoritedCount: 0
  });

  const isRenter = user?.role === 'user';

  const fetchDashboardData = async () => {
    if (!isRenter) return;
    setLoadingBookings(true);
    try {
      const data = await inquiryAPI.getMy();
      const bookingsList = data.payload || data.bookings || [];
      setBookings(bookingsList);

      const approved = bookingsList.filter(b => b.status === 'approved').length;
      const pending = bookingsList.filter(b => b.status === 'pending').length;
      const key = user?._id ? `favourites_${user._id}` : 'favourites';
      const savedIds = JSON.parse(localStorage.getItem(key) || '[]');
      
      setStats(prev => ({
        ...prev,
        totalInquiries: bookingsList.length,
        approvedInquiries: approved,
        pendingInquiries: pending,
        favoritedCount: savedIds.length
      }));
    } catch (err) {
      console.error('Error fetching dashboard bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadFavorites = async () => {
    if (!isRenter) return;
    setLoadingFavorites(true);
    try {
      const key = user?._id ? `favourites_${user._id}` : 'favourites';
      const savedIds = JSON.parse(localStorage.getItem(key) || '[]');
      if (savedIds.length === 0) {
        setFavoriteProperties([]);
        setStats(prev => ({ ...prev, favoritedCount: 0 }));
        return;
      }
      
      const allPropsData = await propertyAPI.getAll();
      const allProps = allPropsData.payload || allPropsData.properties || [];
      const filtered = allProps.filter((p) => savedIds.includes(p._id));
      setFavoriteProperties(filtered);
      setStats(prev => ({ ...prev, favoritedCount: savedIds.length }));
    } catch (err) {
      console.error('Error loading favorites:', err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
    if (isRenter) {
      fetchDashboardData();
      loadFavorites();
    }
  }, [user]);

  const handleFavoriteToggle = (id, isFav) => {
    if (!isFav) {
      setFavoriteProperties((prev) => prev.filter((p) => p._id !== id));
      setStats((prev) => {
        const newCount = Math.max(0, prev.favoritedCount - 1);
        return {
          ...prev,
          favoritedCount: newCount
        };
      });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !phone) {
      setErrorMsg('Name and phone numbers are required.');
      return;
    }

    // Phone validation: +91 followed by exactly 10 digits starting with 6-9
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian phone number (starting with 6, 7, 8, or 9).');
      return;
    }

    setIsSubmitting(true);
    const result = await updateProfile(name, phone, password || null);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Profile updated successfully!');
      setPassword(''); // Reset password field
    } else {
      setErrorMsg(result.error || 'Failed to update profile.');
    }
  };

  const renderOverviewTab = () => {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-extrabold text-dark-900">Tenant Dashboard</h3>
          <p className="text-dark-400 text-sm font-semibold mt-1">
            Welcome back, {user?.name}! Here's a summary of your recent activities and home search.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50/50 border border-blue-100/70 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
              <FiMail />
            </div>
            <div>
              <span className="text-xs font-bold text-dark-400 uppercase tracking-wide block">Total Sent</span>
              <span className="text-2xl font-extrabold text-dark-800">{stats.totalInquiries}</span>
            </div>
          </div>

          <div className="bg-green-50/50 border border-green-100/70 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-lg">
              <FiCheckCircle />
            </div>
            <div>
              <span className="text-xs font-bold text-dark-400 uppercase tracking-wide block">Approved</span>
              <span className="text-2xl font-extrabold text-dark-800">{stats.approvedInquiries}</span>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100/70 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg">
              <FiClock />
            </div>
            <div>
              <span className="text-xs font-bold text-dark-400 uppercase tracking-wide block">Pending</span>
              <span className="text-2xl font-extrabold text-dark-800">{stats.pendingInquiries}</span>
            </div>
          </div>

          <div className="bg-rose-50/50 border border-rose-100/70 rounded-2xl p-5 flex flex-col justify-between space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-red-500 flex items-center justify-center text-lg">
              <FiHeart className="fill-red-400 text-red-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-dark-400 uppercase tracking-wide block">Favourites</span>
              <span className="text-2xl font-extrabold text-dark-800">{stats.favoritedCount}</span>
            </div>
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-bold text-dark-800">Recent Inquiries</h4>
            <Link 
              to="/bookings" 
              className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center space-x-1"
            >
              <span>View All</span>
              <FiChevronRight />
            </Link>
          </div>

          {loadingBookings ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-dark-50 rounded-2xl p-8 text-center border border-dark-100">
              <p className="text-dark-400 text-sm font-semibold">You haven't submitted any inquiries yet.</p>
              <Link to="/properties" className="text-xs font-bold text-primary-500 hover:underline mt-2 inline-block">
                Start browsing properties
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 3).map((booking) => {
                const prop = booking.propertyId || {};
                const getStatusPill = (status) => {
                  switch (status) {
                    case 'approved':
                      return 'bg-green-50 text-green-700 border-green-200';
                    case 'rejected':
                      return 'bg-red-50 text-red-700 border-red-200';
                    default:
                      return 'bg-amber-50 text-amber-700 border-amber-200';
                  }
                };

                return (
                  <div key={booking._id} className="border border-dark-100 hover:border-dark-200 bg-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-bold text-sm text-dark-800 truncate max-w-xs">
                          {prop.title || 'Property Listing'}
                        </h5>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                          booking.interestType === 'buy'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.interestType || 'rent'}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-dark-400 font-semibold">
                        <FiMapPin className="mr-1 flex-shrink-0" />
                        <span className="truncate">{prop.city ? `${prop.city}, ${prop.state || ''}` : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block">Price</span>
                        <span className="text-sm font-extrabold text-primary-500">
                          ${prop.price?.toLocaleString() || 'N/A'}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block">Status</span>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusPill(booking.status)}`}>
                          {booking.status || 'pending'}
                        </span>
                      </div>

                      <Link 
                        to={prop._id ? `/property/${prop._id}` : '#'}
                        className="p-2 rounded-xl bg-dark-50 text-dark-500 hover:bg-primary-50 hover:text-primary-500 transition-colors hidden sm:block"
                      >
                        <FiChevronRight className="text-lg" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFavoritesTab = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-extrabold text-dark-900">Saved Properties</h3>
          <p className="text-dark-400 text-sm font-semibold mt-1">
            Browse and manage your bookmarked property listings.
          </p>
        </div>

        {loadingFavorites ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dark-100 shadow-sm max-w-md mx-auto flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-2xl">
              <FiHeart className="fill-red-500" />
            </div>
            <h4 className="text-lg font-bold text-dark-800">No Saved Properties</h4>
            <p className="text-dark-400 text-xs leading-relaxed max-w-sm font-medium">
              Browse our listings marketplace and click the heart icon on any listing to save them here.
            </p>
            <Link
              to="/properties"
              className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold transition-all shadow-md hover:shadow-primary-600/20"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-dark-800 flex items-center space-x-2 border-b border-dark-100 pb-3">
          <FiEdit className="text-primary-500" />
          <span>Edit Account Information</span>
        </h3>

        {/* Notifications */}
        {successMsg && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-xl text-green-700 text-sm font-semibold">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                <FiUser />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-50/50 text-dark-800 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
              />
            </div>
          </div>

          {/* Phone number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Phone Number</label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                <FiPhone />
              </div>
              <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-dark-800 font-bold text-sm">
                +91
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="98765 43210"
                value={phone.replace(/^\+91/, '')}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPhone(val ? `+91${val}` : '');
                }}
                className="w-full bg-dark-50/50 text-dark-800 text-sm pl-20 pr-4 py-3.5 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
              />
            </div>
          </div>

          {/* Password update */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">New Password</label>
              <span className="text-[10px] font-bold text-dark-400 uppercase tracking-wide">Leave blank to keep current</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                <FiLock />
              </div>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-50/50 text-dark-800 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/25 active:scale-98 transition-all flex justify-center items-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Save Profile Details'
            )}
          </button>
        </form>
      </div>
    );
  };

  if (isRenter) {
    return (
      <div className="min-h-[85vh] bg-bgLight py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Panel: Sidebar Profile Info & Navigation */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex flex-col space-y-6">
              
              {/* Profile Header card info */}
              <div className="flex flex-col items-center text-center space-y-4 pt-4">
                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-primary-500 to-secondary-400 text-white flex items-center justify-center font-extrabold text-3xl shadow-md uppercase">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-dark-800">{user?.name}</h2>
                  <span className="text-xs text-dark-400 font-semibold">{user?.email}</span>
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-extrabold text-accent-700 bg-accent-50 border border-accent-100 uppercase tracking-wide">
                  Renter / Tenant
                </span>
              </div>

              {/* Horizontal Divider */}
              <div className="border-t border-dark-100"></div>

              {/* Tab Navigation Menu */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-dark-600 hover:bg-dark-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FiGrid className="text-lg" />
                    <span>Overview & Activity</span>
                  </div>
                  <FiChevronRight className={`transition-transform duration-200 ${activeTab === 'overview' ? 'rotate-90 text-primary-500' : 'text-dark-300'}`} />
                </button>

                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === 'favorites'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-dark-600 hover:bg-dark-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FiHeart className="text-lg" />
                    <span>Saved Favourites</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stats.favoritedCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-105 bg-red-100 text-red-650 text-red-600 text-xs font-extrabold">
                        {stats.favoritedCount}
                      </span>
                    )}
                    <FiChevronRight className={`transition-transform duration-200 ${activeTab === 'favorites' ? 'rotate-90 text-primary-500' : 'text-dark-300'}`} />
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === 'settings'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-dark-600 hover:bg-dark-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FiEdit className="text-lg" />
                    <span>Account Settings</span>
                  </div>
                  <FiChevronRight className={`transition-transform duration-200 ${activeTab === 'settings' ? 'rotate-90 text-primary-500' : 'text-dark-300'}`} />
                </button>
              </div>

              {/* Account Quick Stats */}
              <div className="border-t border-dark-100 pt-4 space-y-3 text-xs font-semibold text-dark-500">
                <div className="flex justify-between">
                  <span>Phone Contact:</span>
                  <span className="text-dark-800 font-bold">{user?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since:</span>
                  <span className="text-dark-800 font-bold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Panel: Tab Content Area */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-dark-100 shadow-sm min-h-[500px]">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'favorites' && renderFavoritesTab()}
              {activeTab === 'settings' && renderSettingsTab()}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-bgLight py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Profile Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex flex-col items-center text-center space-y-4">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary-500 to-secondary-400 text-white flex items-center justify-center font-extrabold text-3xl shadow-md uppercase">
              {user?.name?.charAt(0)}
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-dark-800">{user?.name}</h2>
              <span className="text-xs text-dark-400 font-semibold">{user?.email}</span>
            </div>

            {/* Role Badge */}
            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold text-accent-700 bg-accent-50 border border-accent-100 uppercase tracking-wide">
              {user?.role === 'admin'
                ? 'Platform Administrator'
                : user?.role === 'owner'
                ? 'Landlord / Property Owner'
                : 'Renter / Tenant'}
            </span>

            {/* Horizontal Divider */}
            <div className="w-full border-t border-dark-100 my-2"></div>

            {/* Quick stats / metadata */}
            <div className="w-full text-left space-y-3.5 text-xs font-semibold text-dark-500">
              <div className="flex justify-between">
                <span>Account Role:</span>
                <span className="text-dark-800 uppercase font-bold">{user?.role}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone Contact:</span>
                <span className="text-dark-800 font-bold">{user?.phone}</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Edit Profile Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-dark-100 shadow-sm space-y-6">
            {renderSettingsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
