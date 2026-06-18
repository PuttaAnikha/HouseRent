import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiHeart, FiMaximize } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext.jsx';

const AllPropertiesCards = ({ property, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const {
    _id,
    title,
    price,
    city,
    state,
    bedrooms,
    bathrooms,
    area,
    propertyType,
    images,
    status
  } = property;

  const { isAuthenticated, user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const showFavoriteBtn = !isAuthenticated || user?.role === 'user';

  // Sync favorites on mount and user change
  useEffect(() => {
    const key = user?._id ? `favourites_${user._id}` : 'favourites';
    const favorites = JSON.parse(localStorage.getItem(key) || '[]');
    setIsFavorite(favorites.some((favId) => favId === _id));
  }, [_id, user]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !user?._id) {
      navigate('/login');
      return;
    }

    const key = `favourites_${user._id}`;
    const favorites = JSON.parse(localStorage.getItem(key) || '[]');
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((favId) => favId !== _id);
    } else {
      updatedFavorites = [...favorites, _id];
    }

    localStorage.setItem(key, JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);

    if (onFavoriteToggle) {
      onFavoriteToggle(_id, !isFavorite);
    }
  };

  const imageUrl = images && images.length > 0 && images[0]
    ? images[0]
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-dark-100 transition-all duration-300 flex flex-col h-full group"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-dark-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 via-transparent to-transparent"></div>

        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-primary-600 shadow-sm backdrop-blur-sm uppercase tracking-wide">
            {propertyType}
          </span>
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-sm uppercase tracking-wide backdrop-blur-sm ${
            status === 'available' ? 'bg-green-500/90' : status === 'rented' ? 'bg-blue-500/90' : 'bg-red-500/90'
          }`}>
            {status}
          </span>
        </div>

        {showFavoriteBtn && (
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-dark-500 hover:text-red-500 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110"
          >
            <FiHeart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-dark-800 line-clamp-1 group-hover:text-primary-500 transition-colors">
            {title}
          </h3>
        </div>

        <div className="mb-4">
          <span className="text-2xl font-extrabold text-primary-500">
            ${price.toLocaleString()}
          </span>
          <span className="text-dark-400 text-sm font-medium"> / month</span>
        </div>

        <div className="flex items-center text-dark-500 text-sm mb-5">
          <FiMapPin className="text-primary-400 flex-shrink-0 mr-1.5" />
          <span className="truncate">{city}, {state}</span>
        </div>

        <div className="border-t border-dark-100 my-4"></div>

        <div className="grid grid-cols-3 gap-2 text-dark-500 text-xs font-semibold mb-6">
          <div className="flex items-center justify-center py-2 px-1 rounded-xl bg-dark-50/50 space-x-1.5">
            <FaBed className="text-primary-400 text-sm" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center justify-center py-2 px-1 rounded-xl bg-dark-50/50 space-x-1.5">
            <FaBath className="text-primary-400 text-sm" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center justify-center py-2 px-1 rounded-xl bg-dark-50/50 space-x-1.5">
            <FiMaximize className="text-primary-400 text-sm" />
            <span>{area} sq ft</span>
          </div>
        </div>

        <Link
          to={`/property/${_id}`}
          className="w-full mt-auto py-3.5 rounded-2xl text-center text-sm font-bold bg-primary-50 hover:bg-primary-500 text-primary-600 hover:text-white transition-all duration-300"
        >
          Get Info
        </Link>
      </div>
    </motion.div>
  );
};

export default AllPropertiesCards;
