import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../../../components/SearchBar.jsx';
import AllPropertiesCards from '../AllPropertiesCards.jsx';
import { propertyAPI } from '../../../services/api.js';
import { motion } from 'framer-motion';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedSearches, setSavedSearches] = useState([]);
  const location = useLocation();

  const getFiltersFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return {
      city: params.get('city') || '',
      propertyType: params.get('propertyType') || '',
      bedrooms: params.get('bedrooms') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      minArea: params.get('minArea') || '',
      maxArea: params.get('maxArea') || '',
      amenities: params.get('amenities') || '',
    };
  };

  const [currentFilters, setCurrentFilters] = useState(getFiltersFromQuery());

  const fetchProperties = async (filters) => {
    setLoading(true);
    setErrorMsg('');
    try {
      let data;
      const hasActiveFilters = Object.values(filters).some((val) => val !== '');
      if (hasActiveFilters) {
        data = await propertyAPI.search(filters);
      } else {
        data = await propertyAPI.getAll();
      }
      setProperties(data.payload || data.properties || []);
    } catch (err) {
      console.error('Error fetching properties list:', err);
      setErrorMsg('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedSearches') || '[]');
    setSavedSearches(saved);
  }, []);

  useEffect(() => {
    const urlFilters = getFiltersFromQuery();
    setCurrentFilters(urlFilters);
    fetchProperties(urlFilters);
  }, [location.search]);

  const handleSearchSubmit = (newFilters) => {
    setCurrentFilters(newFilters);
    fetchProperties(newFilters);
  };

  const saveCurrentSearch = () => {
    const filterParts = [];
    if (currentFilters.city) filterParts.push(currentFilters.city);
    if (currentFilters.propertyType) filterParts.push(currentFilters.propertyType);
    if (currentFilters.bedrooms) filterParts.push(`${currentFilters.bedrooms} BHK`);
    if (currentFilters.minPrice || currentFilters.maxPrice) {
      filterParts.push(`$${currentFilters.minPrice || 0}-$${currentFilters.maxPrice || '∞'}`);
    }
    if (currentFilters.minArea || currentFilters.maxArea) {
      filterParts.push(`${currentFilters.minArea || 0}-${currentFilters.maxArea || '∞'} SqFt`);
    }
    if (currentFilters.amenities) {
      const count = currentFilters.amenities.split(',').filter(Boolean).length;
      filterParts.push(`${count} Amenities`);
    }

    const title = filterParts.length > 0 ? filterParts.join(', ') : 'All Listings';
    const isAlreadySaved = savedSearches.some((s) => s.title === title);
    
    if (isAlreadySaved) {
      alert('This search query is already saved!');
      return;
    }

    const newSearch = {
      id: Date.now().toString(),
      title,
      filters: { ...currentFilters }
    };

    const updated = [...savedSearches, newSearch];
    localStorage.setItem('savedSearches', JSON.stringify(updated));
    setSavedSearches(updated);
    alert('Search filters saved successfully!');
  };

  const loadSavedSearch = (search) => {
    const query = new URLSearchParams(search.filters).toString();
    window.location.search = `?${query}`;
  };

  const deleteSavedSearch = (id, e) => {
    e.stopPropagation();
    const updated = savedSearches.filter((s) => s.id !== id);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
    setSavedSearches(updated);
  };

  return (
    <div className="min-h-screen bg-bgLight py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-3xl font-extrabold text-dark-800 tracking-tight sm:text-4xl">
            Browse Properties
          </h1>
          <p className="text-dark-400 font-semibold text-sm">
            Find and compare properties in your preferred areas.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-dark-100">
          <SearchBar initialFilters={currentFilters} onSearch={handleSearchSubmit} />
        </div>

        {/* Saved Searches Drawer */}
        {savedSearches.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-dark-800 uppercase tracking-wider">Saved Searches</h3>
            <div className="flex flex-wrap gap-3">
              {savedSearches.map((s) => (
                <div
                  key={s.id}
                  onClick={() => loadSavedSearch(s)}
                  className="group inline-flex items-center space-x-2 px-4 py-2 bg-dark-50 hover:bg-primary-50 border border-dark-100 hover:border-primary-200 text-dark-700 hover:text-primary-600 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  <span>{s.title}</span>
                  <button
                    onClick={(e) => deleteSavedSearch(s.id, e)}
                    className="p-0.5 rounded-lg text-dark-400 hover:text-red-500 hover:bg-red-50 group-hover:opacity-100 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Search Button */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-dark-500 uppercase tracking-wider">
            {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Available
          </span>
          <button
            onClick={saveCurrentSearch}
            className="px-5 py-2.5 bg-white hover:bg-dark-50 border border-dark-200 text-dark-700 text-xs font-bold rounded-2xl transition-all"
          >
            Save Current Search
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : errorMsg ? (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold">
            {errorMsg}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-dark-100 shadow-sm text-center max-w-md mx-auto space-y-4">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-bold text-dark-800">No Listings Match</h3>
            <p className="text-dark-400 text-xs font-medium">Try broadening your filters or location parameters to view more results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property._id}>
                <AllPropertiesCards property={property} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllProperties;
