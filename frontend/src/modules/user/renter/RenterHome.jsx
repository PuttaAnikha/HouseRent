import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inquiryAPI } from '../../../services/api.js';
import { FiCalendar, FiMapPin, FiMail, FiPhone, FiUser, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RenterHome = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await inquiryAPI.getMy();
      setBookings(data.payload || data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setErrorMsg('Failed to fetch your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusStyle = (status) => {
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
    <div className="min-h-screen bg-bgLight py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-dark-800 tracking-tight sm:text-4xl">
            My Bookings
          </h1>
          <p className="mt-2 text-dark-400 font-semibold text-sm">
            Track the status of your inquiries and property booking requests.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-12 border border-dark-100 shadow-sm text-center max-w-lg mx-auto space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center text-4xl mx-auto">
              <FiCalendar />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-dark-800">No Bookings Found</h3>
              <p className="text-dark-500 text-sm font-medium leading-relaxed">
                You haven't submitted any inquiries or booking requests yet. Browse our premium rental listings to find your next home.
              </p>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all shadow-md shadow-primary-500/20"
            >
              <FiHome />
              <span>Explore Properties</span>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => {
              const prop = booking.propertyId || {};
              const owner = booking.ownerId || {};
              const formattedDate = new Date(booking.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={booking._id}
                  className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  {/* Left Column: Property Summary */}
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-primary-50 text-primary-600">
                          Booking ID: #{booking._id?.substring(0, 8)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                          booking.interestType === 'buy'
                            ? 'bg-amber-105 bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-105 bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {booking.interestType || 'rent'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-dark-800 leading-snug">
                        {prop.title || 'Property Listing'}
                      </h3>
                      <div className="flex items-center text-dark-400 text-xs mt-1.5 font-semibold">
                        <FiMapPin className="mr-1 flex-shrink-0" />
                        <span>{prop.address ? `${prop.address}, ` : ''}{prop.city || 'N/A'}, {prop.state || ''}</span>
                      </div>
                    </div>

                    <div className="border-t border-dark-50 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block">Monthly Rent</span>
                        <span className="text-lg font-extrabold text-primary-500">
                          ${prop.price?.toLocaleString() || 'N/A'}<span className="text-xs text-dark-400 font-medium">/mo</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block text-right">Inquiry Date</span>
                        <span className="text-xs font-bold text-dark-750 flex items-center justify-end">
                          <FiCalendar className="mr-1" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Owner Details */}
                  <div className="lg:col-span-4 lg:border-l lg:border-r lg:border-dark-100 lg:px-6 space-y-4">
                    <div>
                      <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block mb-2">Owner Information</span>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm font-semibold text-dark-750">
                          <FiUser className="mr-2 text-dark-400 text-base" />
                          <span>{owner.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-dark-500">
                          <FiMail className="mr-2 text-dark-400 text-base" />
                          <a href={`mailto:${owner.email}`} className="hover:text-primary-500 transition-colors truncate">{owner.email || 'N/A'}</a>
                        </div>
                        <div className="flex items-center text-sm font-medium text-dark-500">
                          <FiPhone className="mr-2 text-dark-400 text-base" />
                          <a href={`tel:${owner.phone}`} className="hover:text-primary-500 transition-colors">{owner.phone || 'N/A'}</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Message & Status */}
                  <div className="lg:col-span-3 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block">My Message</span>
                      <div className="bg-dark-50/50 p-3 rounded-xl border border-dark-100 text-xs font-medium text-dark-600 italic leading-relaxed max-h-24 overflow-y-auto">
                        "{booking.message}"
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end lg:space-x-3">
                      <span className="lg:hidden text-xs font-bold text-dark-500">Status:</span>
                      <span className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                        {booking.status || 'pending'}
                      </span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default RenterHome;
