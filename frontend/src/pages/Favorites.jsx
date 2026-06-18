import React, { useState, useEffect, useContext } from 'react';
import { propertyAPI } from '../services/api.js';
import PropertyCard from '../components/PropertyCard.jsx';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadFavorites = async () => {
    if (!user?._id) {
      setFavoriteProperties([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const key = `favourites_${user._id}`;
      const savedIds = JSON.parse(localStorage.getItem(key) || '[]');
      if (savedIds.length === 0) {
        setFavoriteProperties([]);
        return;
      }

      // Fetch all listings to filter by favorites IDs
      const allPropsData = await propertyAPI.getAll();
      const allProps = allPropsData.payload || allPropsData.properties || [];
      const filtered = allProps.filter((p) => savedIds.includes(p._id));
      setFavoriteProperties(filtered);
    } catch (err) {
      console.error('Failed to load favourites listings:', err);
      setErrorMsg('Failed to retrieve your saved listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const handleFavoriteToggle = (id, isFav) => {
    if (!isFav) {
      // If untoggled, immediately filter out from the grid view for immediate feedback
      setFavoriteProperties((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-bgLight py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-dark-800 tracking-tight sm:text-4xl">
            My Favourites
          </h1>
          <p className="mt-2 text-dark-400 font-semibold text-sm">
            Quickly access and manage property listings you have bookmarked.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Listings Display */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : favoriteProperties.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {favoriteProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-16 text-center border border-dark-100 shadow-sm max-w-xl mx-auto flex flex-col items-center space-y-4"
          >
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-3xl">
              <FiHeart className="fill-red-500" />
            </div>
            <h3 className="text-xl font-bold text-dark-800">No Saved Properties</h3>
            <p className="text-dark-400 text-sm leading-relaxed max-w-md font-medium">
              You haven't bookmarked any listings yet. Browse our properties marketplace and click the heart icon on any listing to save them here.
            </p>
            <Link
              to="/properties"
              className="px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all shadow-md hover:shadow-primary-600/20"
            >
              Browse Properties
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
