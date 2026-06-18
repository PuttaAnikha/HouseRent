import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiShield, FiSliders, FiPlus, FiMessageSquare, FiLayout, FiUsers, FiLayers, FiActivity } from 'react-icons/fi';
import SearchBar from '../../components/SearchBar.jsx';
import { propertyAPI } from '../../services/api.js';
import { AuthContext } from '../../context/AuthContext.jsx';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load properties on mount
  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const data = await propertyAPI.getAll();
        const listings = data.payload || data.properties || [];
        setProperties(listings);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProperties();
  }, []);

  const handleSearchSubmit = (filters) => {
    const query = new URLSearchParams(filters).toString();
    navigate(`/properties?${query}`);
  };

  const popularCities = [
    { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1626125345510-4603468eedfb?auto=format&fit=crop&w=400&q=80' },
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Bengaluru', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
  ];

  const isOwner = isAuthenticated && user?.role === 'owner';
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <div className="bg-bgLight overflow-hidden min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center bg-gradient-to-b from-primary-50/70 via-bgLight to-bgLight py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {isOwner && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100/60 rounded-full text-primary-600 font-bold text-xs uppercase tracking-wider"
                  >
                    <FiActivity className="text-sm" />
                    <span>Nestora Landlord Hub</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-900 tracking-tight leading-[1.1]"
                  >
                    Welcome Back, <br />
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                      {user?.name}
                    </span>
                  </motion.h1>

                  <p className="text-dark-500 text-lg max-w-xl mx-auto lg:mx-0 font-medium">
                    Manage inquiries, list properties, and coordinate rental details on your properties with Nestora's landlord administration portal.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                    <Link
                      to="/dashboard/owner"
                      className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all text-center flex items-center justify-center space-x-2"
                    >
                      <FiLayout />
                      <span>Open Owner Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="px-8 py-4 bg-white hover:bg-dark-50 text-dark-700 font-bold rounded-2xl border border-dark-200 transition-all text-center"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </>
              )}

              {isAdmin && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 rounded-full text-red-600 font-bold text-xs uppercase tracking-wider"
                  >
                    <FiShield className="text-sm" />
                    <span>System Administration</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-900 tracking-tight leading-[1.1]"
                  >
                    System Control, <br />
                    <span className="bg-gradient-to-r from-red-600 to-primary-500 bg-clip-text text-transparent">
                      Administrator
                    </span>
                  </motion.h1>

                  <p className="text-dark-500 text-lg max-w-xl mx-auto lg:mx-0 font-medium">
                    Inspect system listings, coordinate registered tenants/owners, and check visual statistics of types and roles.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                    <Link
                      to="/dashboard/admin"
                      className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all text-center flex items-center justify-center space-x-2"
                    >
                      <FiLayout />
                      <span>Open Admin Panel</span>
                    </Link>
                    <Link
                      to="/properties"
                      className="px-8 py-4 bg-white hover:bg-dark-50 text-dark-700 font-bold rounded-2xl border border-dark-200 transition-all text-center"
                    >
                      Browse Listings
                    </Link>
                  </div>
                </>
              )}

              {!isOwner && !isAdmin && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100/60 rounded-full text-primary-600 font-bold text-xs uppercase tracking-wider"
                  >
                    <FiHome className="text-sm" />
                    <span>The Modern Way to Rent</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-900 tracking-tight leading-[1.1]"
                  >
                    Find Your Perfect <br />
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                      Place to Call Home
                    </span>
                  </motion.h1>

                  <p className="text-dark-500 text-lg max-w-xl mx-auto lg:mx-0 font-medium">
                    Nestora simplifies your rental search with verified properties, advanced filtration options, and direct landlord booking inquiries.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
                    <Link
                      to="/properties"
                      className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/25 transition-all text-center"
                    >
                      Search Properties
                    </Link>
                    {!isAuthenticated && (
                      <Link
                        to="/register"
                        className="px-8 py-4 bg-white hover:bg-dark-50 text-dark-700 font-bold rounded-2xl border border-dark-200 transition-all text-center"
                      >
                        Create Account
                      </Link>
                    )}
                  </div>
                </>
              )}

            </div>

            {/* Right Column Illustration */}
            <div className="lg:col-span-5 hidden lg:block relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative border-4 border-white"
              >
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  alt="Nestora Premium Living"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 via-transparent to-transparent"></div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating search bar section */}
      {!isOwner && !isAdmin && (
        <section className="relative z-10 -mt-16 max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-dark-100"
          >
            <SearchBar onSearch={handleSearchSubmit} />
          </motion.div>
        </section>
      )}

      {/* Popular Cities Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-extrabold text-dark-800 tracking-tight">Explore Popular Metros</h2>
          <p className="mt-2 text-dark-400 font-semibold text-sm">Discover verified properties listed in top residential zones.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularCities.map((city, idx) => {
            const count = properties.filter((p) => p.city?.toLowerCase() === city.name.toLowerCase()).length;
            return (
              <motion.div
                whileHover={{ y: -8 }}
                key={city.name}
                className="relative rounded-3xl overflow-hidden aspect-[3/4] group cursor-pointer shadow-sm hover:shadow-lg border border-dark-100 transition-all duration-300"
                onClick={() => navigate(`/properties?city=${city.name}`)}
              >
                <img src={city.image} alt={city.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-dark-900/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="text-lg font-bold">{city.name}</h3>
                  <span className="text-xs font-semibold text-dark-250 block mt-0.5">
                    {count} {count === 1 ? 'Listing' : 'Listings'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Services Grid (Value props) */}
      <section className="py-20 bg-white border-t border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-dark-800 tracking-tight">How Nestora Simplifies Renting</h2>
            <p className="text-dark-400 font-semibold text-sm">We provide an intuitive real-estate management system tailored for all roles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Box 1 */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 bg-primary-100 text-primary-500 rounded-2xl flex items-center justify-center text-2xl mx-auto sm:mx-0">
                <FiSliders />
              </div>
              <h3 className="text-lg font-bold text-dark-800">Advanced Filters</h3>
              <p className="text-sm font-medium text-dark-500 leading-relaxed">
                Filter properties dynamically by city, type, pricing boundaries, sizing, number of rooms, and detailed amenities options.
              </p>
            </div>
            {/* Box 2 */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 bg-primary-100 text-primary-500 rounded-2xl flex items-center justify-center text-2xl mx-auto sm:mx-0">
                <FiPlus />
              </div>
              <h3 className="text-lg font-bold text-dark-800">Landlord CRUD Dashboard</h3>
              <p className="text-sm font-medium text-dark-500 leading-relaxed">
                Approved landowners can seamlessly create, edit, delete, and monitor properties listings in real-time.
              </p>
            </div>
            {/* Box 3 */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 bg-primary-100 text-primary-500 rounded-2xl flex items-center justify-center text-2xl mx-auto sm:mx-0">
                <FiShield />
              </div>
              <h3 className="text-lg font-bold text-dark-800">Admin Approvals Portal</h3>
              <p className="text-sm font-medium text-dark-500 leading-relaxed">
                Platform admins verify owners, monitor property listing distributions, and review platform metrics dynamically.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
