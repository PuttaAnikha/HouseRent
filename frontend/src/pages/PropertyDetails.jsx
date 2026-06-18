import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyAPI, inquiryAPI } from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { FiMapPin, FiMaximize, FiCalendar, FiSend, FiUser, FiInfo, FiCheckCircle, FiVideo } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyDetails = () => {
  const { propertyId } = useParams();

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.startsWith('+91') && cleaned.length === 13) {
      return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
    }
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };
  const { isAuthenticated, user } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Inquiry form states
  const [interestType, setInterestType] = useState('rent');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    return null;
  };
  const [inquiryMsg, setInquiryMsg] = useState('Hello, I am interested in renting this property. Please contact me back with more details.');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  const navigate = useNavigate();

  const handleInterestChange = (type) => {
    setInterestType(type);
    if (type === 'rent') {
      setInquiryMsg('Hello, I am interested in renting this property. Please contact me back with more details.');
    } else {
      setInquiryMsg('Hello, I am interested in buying this property. Please contact me back with more details.');
    }
  };

  // Load property on mount
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const data = await propertyAPI.getById(propertyId);
        setProperty(data.payload || data.property);
      } catch (err) {
        console.error('Error fetching property detail:', err);
        setErrorMsg('We could not retrieve details for this property listing.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setInquiryError('');
    setInquirySuccess(false);

    if (!inquiryMsg.trim()) {
      setInquiryError('Please write a message to submit.');
      return;
    }

    setInquirySubmitting(true);
    try {
      await inquiryAPI.send(propertyId, inquiryMsg, interestType);
      setInquirySuccess(true);
      // Reset message based on current interest type
      if (interestType === 'rent') {
        setInquiryMsg('Hello, I am interested in renting this property. Please contact me back with more details.');
      } else {
        setInquiryMsg('Hello, I am interested in buying this property. Please contact me back with more details.');
      }
    } catch (err) {
      console.error('Inquiry sending failed:', err);
      setInquiryError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit inquiry.');
    } finally {
      setInquirySubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-bgLight">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (errorMsg || !property) {
    return (
      <div className="min-h-screen bg-bgLight py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-dark-100 shadow-sm text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-dark-800">Resource Not Found</h3>
          <p className="text-dark-400 text-sm mt-2 font-medium">{errorMsg || 'Listing could not be found.'}</p>
          <Link to="/properties" className="mt-6 inline-block px-6 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-colors">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  // Safe image fallback
  const propertyImage = property.images && property.images.length > 0 && property.images[0]
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';

  const isOwner = user?._id === (property.ownerId?._id || property.ownerId);
  const showInquiryBox = !isAuthenticated || user?.role === 'user';

  return (
    <div className="bg-bgLight min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="text-sm font-semibold text-dark-400 mb-6 flex space-x-2">
          <Link to="/" className="hover:text-primary-500">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-primary-500">Properties</Link>
          <span>/</span>
          <span className="text-dark-500 truncate max-w-[200px]">{property.title}</span>
        </div>

        {/* Large Property Banner Card */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border border-dark-100 bg-dark-100 aspect-[21/9] mb-12">
          <img
            src={propertyImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-8 left-8 text-white flex flex-col md:flex-row md:items-end justify-between right-8 gap-4">
            <div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-primary-600 shadow-sm backdrop-blur-sm uppercase tracking-wide inline-block mb-3">
                {property.propertyType}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{property.title}</h1>
            </div>
            
            <div className="flex-shrink-0 flex items-center space-x-2 bg-white/95 text-dark-800 py-3 px-6 rounded-2xl shadow-lg backdrop-blur-sm">
              <span className="text-3xl font-extrabold text-primary-500">${property.price.toLocaleString()}</span>
              <span className="text-dark-400 text-xs font-bold uppercase tracking-wider">/ month</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Columns - Property Details Info */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Core Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-dark-100 shadow-sm space-y-6">
              
              {/* Specs Icons */}
              <div className="grid grid-cols-3 gap-4 border-b border-dark-100 pb-6 text-dark-500 font-bold text-sm">
                <div className="flex flex-col sm:flex-row items-center justify-center p-4 rounded-2xl bg-dark-50/50 space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
                  <FaBed className="text-primary-500 text-2xl" />
                  <div>
                    <span className="block text-dark-800 text-base font-extrabold">{property.bedrooms}</span>
                    <span className="text-[10px] text-dark-400 uppercase tracking-wide">Bedrooms</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center p-4 rounded-2xl bg-dark-50/50 space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
                  <FaBath className="text-primary-500 text-2xl" />
                  <div>
                    <span className="block text-dark-800 text-base font-extrabold">{property.bathrooms}</span>
                    <span className="text-[10px] text-dark-400 uppercase tracking-wide">Bathrooms</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center p-4 rounded-2xl bg-dark-50/50 space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
                  <FiMaximize className="text-primary-500 text-2xl" />
                  <div>
                    <span className="block text-dark-800 text-base font-extrabold">{property.area}</span>
                    <span className="text-[10px] text-dark-400 uppercase tracking-wide">Area (Sq Ft)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-dark-800 flex items-center space-x-2">
                  <FiInfo className="text-primary-500" />
                  <span>About Property</span>
                </h2>
                <p className="text-dark-500 text-sm leading-relaxed font-medium whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Location Details */}
              <div className="space-y-3 pt-4 border-t border-dark-100">
                <h2 className="text-xl font-bold text-dark-800 flex items-center space-x-2">
                  <FiMapPin className="text-primary-500" />
                  <span>Location Address</span>
                </h2>
                <p className="text-dark-500 text-sm font-semibold flex items-center">
                  {property.address}, {property.city}, {property.state} - {property.pincode}
                </p>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-dark-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-dark-800">Amenities &amp; Features</h2>
              {property.amenities && property.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-dark-50 border border-dark-100 text-dark-600 font-bold text-xs rounded-xl shadow-sm uppercase tracking-wide"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-dark-400 text-sm font-medium">No amenities specified for this listing.</p>
              )}
            </div>

            {/* Virtual Video Tour Section */}
            {property.videoUrl && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-dark-100 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-dark-800 flex items-center space-x-2">
                  <FiVideo className="text-primary-500" />
                  <span>Virtual Video Tour</span>
                </h2>
                <div 
                  onClick={() => setIsVideoOpen(true)}
                  className="relative rounded-2xl overflow-hidden aspect-video bg-dark-900 border border-dark-100 shadow-md cursor-pointer group"
                >
                  <img
                    src={propertyImage}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-dark-900/60 transition-colors group-hover:bg-dark-900/50 flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-primary-500/30 transform transition-transform group-hover:scale-110 active:scale-95 duration-300 relative">
                      <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-25"></div>
                      <span className="ml-1">▶</span>
                    </div>
                    <span className="text-white text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                      Click to start virtual walkthrough
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Columns - Owner Contact & Inquiry Box */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Owner Details Card */}
            <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-dark-800 uppercase tracking-wider">Property Owner</h3>
              
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                  {property.ownerId?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-dark-800">{property.ownerId?.name || 'Trusted Landlord'}</h4>
                  <span className="text-xs text-dark-400 font-medium">Listed on Nestora</span>
                </div>
              </div>

              {/* Contact Data list */}
              {isAuthenticated ? (
                <div className="space-y-2 pt-2 text-xs font-semibold text-dark-500">
                  <div className="flex justify-between py-1 border-b border-dark-50">
                    <span>Email:</span>
                    <span className="text-dark-700 font-bold">{property.ownerId?.email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Phone:</span>
                    <span className="text-dark-700 font-bold">{formatPhoneNumber(property.ownerId?.phone)}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-dark-50 rounded-2xl text-[11px] text-dark-400 font-semibold text-center mt-2">
                  🔒 Log in to view owner contact numbers.
                </div>
              )}
            </div>

            {/* Inquiry Box */}
            {showInquiryBox && (
              <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-dark-800 uppercase tracking-wider">Send Inquiry</h3>

                {isOwner ? (
                  <div className="p-4 bg-primary-50 rounded-2xl text-xs text-primary-700 font-bold text-center leading-relaxed">
                    👋 You are the owner of this property listing.
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {inquiryError && (
                      <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl">
                        {inquiryError}
                      </div>
                    )}

                    <AnimatePresence>
                      {inquirySuccess && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 bg-green-50 rounded-2xl flex items-center space-x-2 text-green-700 text-xs font-semibold"
                        >
                          <FiCheckCircle className="text-lg flex-shrink-0" />
                          <span>Inquiry sent successfully to landlord!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Rent vs Buy Selector */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-dark-400 uppercase tracking-wider">I am interested to</label>
                      <div className="grid grid-cols-2 gap-2 bg-dark-50 p-1.5 rounded-2xl border border-dark-100">
                        <button
                          type="button"
                          onClick={() => handleInterestChange('rent')}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            interestType === 'rent'
                              ? 'bg-white text-primary-600 shadow-sm'
                              : 'text-dark-500 hover:text-dark-700'
                          }`}
                        >
                          Rent Property
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInterestChange('buy')}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            interestType === 'buy'
                              ? 'bg-white text-primary-600 shadow-sm'
                              : 'text-dark-500 hover:text-dark-700'
                          }`}
                        >
                          Buy Property
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-dark-400 uppercase tracking-wider">Your Message</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="Write your questions..."
                        value={inquiryMsg}
                        onChange={(e) => setInquiryMsg(e.target.value)}
                        className="w-full bg-dark-50/50 text-dark-800 text-sm p-3.5 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-medium resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={inquirySubmitting}
                      className="w-full py-4 rounded-2xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/20 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {inquirySubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FiSend />
                          <span>{isAuthenticated ? 'Send Inquiry' : 'Log in to Send'}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Tour Modal Overlay */}
      <AnimatePresence>
        {isVideoOpen && property.videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-dark-800 rounded-3xl overflow-hidden shadow-2xl border border-dark-200 w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-dark-900/60 hover:bg-dark-900/80 text-white flex items-center justify-center text-lg transition-colors focus:outline-none cursor-pointer"
              >
                ✕
              </button>

              {/* Video Player / iframe Embed */}
              {getEmbedUrl(property.videoUrl) ? (
                <iframe
                  src={`${getEmbedUrl(property.videoUrl)}?autoplay=1&mute=0`}
                  title="Property Tour"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={property.videoUrl}
                  autoPlay
                  controls
                  className="w-full h-full object-cover bg-black"
                ></video>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetails;
