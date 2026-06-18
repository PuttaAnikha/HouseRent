import React, { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiHome, FiDollarSign, FiLayers, FiMaximize, FiSliders } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_FILTERS = {};

const SearchBar = ({ onSearch, initialFilters = EMPTY_FILTERS }) => {
  const [city, setCity] = useState(initialFilters.city || '');
  const [propertyType, setPropertyType] = useState(initialFilters.propertyType || '');
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms || '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '');
  const [minArea, setMinArea] = useState(initialFilters.minArea || '');
  const [maxArea, setMaxArea] = useState(initialFilters.maxArea || '');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    city: filterCity,
    propertyType: filterType,
    bedrooms: filterBedrooms,
    minPrice: filterMinPrice,
    maxPrice: filterMaxPrice,
    minArea: filterMinArea,
    maxArea: filterMaxArea,
    amenities: filterAmenities,
  } = initialFilters || {};

  // Sync state with initialFilters when page mounts or updates (e.g. from Saved Searches)
  useEffect(() => {
    setCity(filterCity || '');
    setPropertyType(filterType || '');
    setBedrooms(filterBedrooms || '');
    setMinPrice(filterMinPrice || '');
    setMaxPrice(filterMaxPrice || '');
    setMinArea(filterMinArea || '');
    setMaxArea(filterMaxArea || '');
    setSelectedAmenities(
      filterAmenities
        ? (typeof filterAmenities === 'string' ? filterAmenities.split(',') : filterAmenities)
        : []
    );
  }, [
    filterCity,
    filterType,
    filterBedrooms,
    filterMinPrice,
    filterMaxPrice,
    filterMinArea,
    filterMaxArea,
    filterAmenities
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      city,
      propertyType,
      bedrooms,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      amenities: selectedAmenities.join(','),
    });
  };

  const handleClear = () => {
    setCity('');
    setPropertyType('');
    setBedrooms('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setSelectedAmenities([]);
    onSearch({
      city: '',
      propertyType: '',
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      amenities: '',
    });
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-[2.5rem] shadow-xl border border-dark-100 p-6 md:p-8 flex flex-col space-y-4"
    >
      {/* Main Search Row */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
        {/* City Filter */}
        <div className="flex-1 flex items-center space-x-3 px-3 py-2 border-b md:border-b-0 md:border-r border-dark-100">
          <FiMapPin className="text-primary-500 text-xl flex-shrink-0" />
          <div className="flex-grow">
            <label className="block text-[10px] font-bold text-dark-400 uppercase tracking-wider">Location</label>
            <input
              type="text"
              placeholder="Where are you looking?"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-dark-700 placeholder-dark-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Property Type Filter */}
        <div className="flex-1 flex items-center space-x-3 px-3 py-2 border-b md:border-b-0 md:border-r border-dark-100">
          <FiHome className="text-primary-500 text-xl flex-shrink-0" />
          <div className="flex-grow">
            <label className="block text-[10px] font-bold text-dark-400 uppercase tracking-wider">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-dark-700 focus:outline-none cursor-pointer"
            >
              <option value="">Any Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
            </select>
          </div>
        </div>

        {/* Bedrooms Filter */}
        <div className="flex-1 flex items-center space-x-3 px-3 py-2 border-b md:border-b-0 md:border-r border-dark-100">
          <FiLayers className="text-primary-500 text-xl flex-shrink-0" />
          <div className="flex-grow">
            <label className="block text-[10px] font-bold text-dark-400 uppercase tracking-wider">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-dark-700 focus:outline-none cursor-pointer"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>
        </div>

        {/* Price Filters */}
        <div className="flex-1 flex items-center space-x-3 px-3 py-2 border-b md:border-b-0 border-dark-100">
          <FiDollarSign className="text-primary-500 text-xl flex-shrink-0" />
          <div className="flex-grow grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-dark-400 uppercase tracking-wider">Min Price</label>
              <input
                type="number"
                placeholder="Min ($)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-dark-700 placeholder-dark-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-dark-400 uppercase tracking-wider">Max Price</label>
              <input
                type="number"
                placeholder="Max ($)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-dark-700 placeholder-dark-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 md:pl-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-3 text-sm font-bold rounded-2xl transition-all flex items-center justify-center space-x-1.5 border ${
              showAdvanced
                ? 'bg-primary-50 border-primary-200 text-primary-600'
                : 'bg-white border-dark-150 text-dark-500 hover:text-dark-700 hover:bg-dark-50'
            }`}
          >
            <FiSliders />
            <span className="hidden lg:inline">Filters</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-3 text-sm font-semibold text-dark-500 hover:text-dark-700 hover:bg-dark-50 rounded-2xl transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all duration-300 transform active:scale-95"
          >
            <FiSearch className="text-lg" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-dark-100 pt-6 mt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Size Range Filter */}
              <div className="md:col-span-4 space-y-3">
                <span className="text-xs font-bold text-dark-500 uppercase tracking-wider flex items-center space-x-1.5">
                  <FiMaximize className="text-primary-500" />
                  <span>Property Size (Sq Ft)</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark-50/50 px-4 py-2.5 rounded-2xl border border-dark-100 flex flex-col justify-center">
                    <label className="text-[9px] font-bold text-dark-400 uppercase tracking-wider">Min Size</label>
                    <input
                      type="number"
                      placeholder="Min SqFt"
                      value={minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-dark-700 placeholder-dark-400 focus:outline-none"
                    />
                  </div>
                  <div className="bg-dark-50/50 px-4 py-2.5 rounded-2xl border border-dark-100 flex flex-col justify-center">
                    <label className="text-[9px] font-bold text-dark-400 uppercase tracking-wider">Max Size</label>
                    <input
                      type="number"
                      placeholder="Max SqFt"
                      value={maxArea}
                      onChange={(e) => setMaxArea(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-dark-700 placeholder-dark-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-bold text-dark-500 uppercase tracking-wider">Specific Amenities</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['Swimming Pool', 'Gym', 'Garage', 'Balcony', 'Pet Friendly', 'Wifi'].map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`px-3 py-2.5 rounded-2xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                          isChecked
                            ? 'bg-primary-50 border-primary-300 text-primary-600 shadow-sm'
                            : 'bg-dark-50/30 border-dark-100 text-dark-600 hover:border-dark-200'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default SearchBar;
