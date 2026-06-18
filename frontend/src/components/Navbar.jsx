import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { FiMenu, FiX, FiUser, FiHeart, FiLogOut, FiLayout, FiHome, FiCompass, FiTrendingUp, FiCalendar, FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Condition to check if favorites should be shown (guest users and role 'user' tenants)
  const showFavorites = !isAuthenticated || user?.role === 'user';

  // Condition to check if insights should be shown (guest users and owners/admins)
  const showInsights = !isAuthenticated || user?.role !== 'user';

  return (
    <nav className="sticky top-0 z-50 glassmorphism shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={closeMenus} className="flex items-center space-x-2 group">
              <svg className="w-9 h-9 text-primary-500 transition-transform group-hover:rotate-12 duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 80 V35 L50 15 L80 35 V80 H60 V55 H40 V80 Z" fill="currentColor" />
                <path d="M50 15 L85 38 L80 44 L50 24 L20 44 L15 38 Z" fill="#f59e0b" />
              </svg>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Nestora
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-1 font-medium text-sm transition-colors hover:text-primary-500 ${
                  isActive ? 'text-primary-500' : 'text-dark-600'
                }`
              }
            >
              <FiHome className="text-lg" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/properties"
              className={({ isActive }) =>
                `flex items-center space-x-1 font-medium text-sm transition-colors hover:text-primary-500 ${
                  isActive ? 'text-primary-500' : 'text-dark-600'
                }`
              }
            >
              <FiCompass className="text-lg" />
              <span>Properties</span>
            </NavLink>

            {showInsights && (
              <NavLink
                to="/insights"
                className={({ isActive }) =>
                  `flex items-center space-x-1 font-medium text-sm transition-colors hover:text-primary-500 ${
                    isActive ? 'text-primary-500' : 'text-dark-600'
                  }`
                }
              >
                <FiTrendingUp className="text-lg" />
                <span>Insights</span>
              </NavLink>
            )}

            {showFavorites && (
              <NavLink
                to="/favourites"
                className={({ isActive }) =>
                  `flex items-center space-x-1 font-medium text-sm transition-colors hover:text-primary-500 ${
                    isActive ? 'text-primary-500' : 'text-dark-600'
                  }`
                }
              >
                <FiHeart className="text-lg" />
                <span>Favourites</span>
              </NavLink>
            )}

            {isAuthenticated && user?.role === 'user' && (
              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  `flex items-center space-x-1 font-medium text-sm transition-colors hover:text-primary-500 ${
                    isActive ? 'text-primary-500' : 'text-dark-600'
                  }`
                }
              >
                <FiCalendar className="text-lg" />
                <span>My Bookings</span>
              </NavLink>
            )}

            {/* Dashboard shortcut links based on user roles */}
            {isAuthenticated && (user?.role === 'owner' || user?.role === 'admin') && (
              <NavLink
                to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/owner'}
                className={({ isActive }) =>
                  `flex items-center space-x-1 font-medium text-sm transition-colors hover:text-primary-500 ${
                    isActive ? 'text-primary-500' : 'text-dark-600'
                  }`
                }
              >
                <FiLayout className="text-lg" />
                <span>Dashboard</span>
              </NavLink>
            )}
          </div>

          {/* Desktop Authentication State */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-600 dark:text-dark-300 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <FiSun className="text-lg text-amber-500" /> : <FiMoon className="text-lg text-primary-500" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-dark-100 transition-colors focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-400 text-white flex items-center justify-center font-bold text-base shadow-sm uppercase">
                    {user?.name?.charAt(0)}
                  </div>
                  <span className="font-semibold text-sm text-dark-700 hidden lg:inline-block max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown Card */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 border border-dark-100 focus:outline-none"
                    >
                      <div className="px-4 py-2 border-b border-dark-100 mb-1">
                        <p className="text-xs text-dark-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-dark-800 truncate">{user?.email}</p>
                        <p className="text-[10px] uppercase font-extrabold tracking-wider text-accent-600 mt-0.5">
                          {user?.role}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={closeMenus}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-dark-600 hover:bg-dark-50 hover:text-primary-500 font-medium transition-colors"
                      >
                        <FiUser />
                        <span>My Profile</span>
                      </Link>

                      {user?.role === 'owner' && (
                        <Link
                          to="/dashboard/owner"
                          onClick={closeMenus}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-dark-600 hover:bg-dark-50 hover:text-primary-500 font-medium transition-colors"
                        >
                          <FiLayout />
                          <span>Owner Dashboard</span>
                        </Link>
                      )}

                      {user?.role === 'admin' && (
                        <Link
                          to="/dashboard/admin"
                          onClick={closeMenus}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-dark-600 hover:bg-dark-50 hover:text-primary-500 font-medium transition-colors"
                        >
                          <FiLayout />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      {showFavorites && (
                        <Link
                          to="/favourites"
                          onClick={closeMenus}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-dark-600 hover:bg-dark-50 hover:text-primary-500 font-medium transition-colors"
                        >
                          <FiHeart />
                          <span>Favourites</span>
                        </Link>
                      )}

                      {user?.role === 'user' && (
                        <Link
                          to="/bookings"
                          onClick={closeMenus}
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-dark-600 hover:bg-dark-50 hover:text-primary-500 font-medium transition-colors"
                        >
                          <FiCalendar />
                          <span>My Bookings</span>
                        </Link>
                      )}

                      <div className="border-t border-dark-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-primary-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-dark-700 hover:text-primary-500 p-2 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-dark-100 shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              <Link
                to="/"
                onClick={closeMenus}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
              >
                <FiHome className="text-lg" />
                <span>Home</span>
              </Link>

              <Link
                to="/properties"
                onClick={closeMenus}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
              >
                <FiCompass className="text-lg" />
                <span>Properties</span>
              </Link>

              {showInsights && (
                <Link
                  to="/insights"
                  onClick={closeMenus}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
                >
                  <FiTrendingUp className="text-lg" />
                  <span>Insights</span>
                </Link>
              )}

              {showFavorites && (
                <Link
                  to="/favourites"
                  onClick={closeMenus}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
                >
                  <FiHeart className="text-lg" />
                  <span>Favourites</span>
                </Link>
              )}

              {isAuthenticated && user?.role === 'user' && (
                <Link
                  to="/bookings"
                  onClick={closeMenus}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
                >
                  <FiCalendar className="text-lg" />
                  <span>My Bookings</span>
                </Link>
              )}

              {isAuthenticated && (user?.role === 'owner' || user?.role === 'admin') && (
                <Link
                  to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/owner'}
                  onClick={closeMenus}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-semibold transition-all"
                >
                  <FiLayout className="text-lg" />
                  <span>Dashboard</span>
                </Link>
              )}

              {/* Mobile Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-dark-700 hover:bg-dark-50 font-semibold transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  {isDark ? <FiSun className="text-lg text-amber-500" /> : <FiMoon className="text-lg text-primary-500" />}
                  <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
                <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">
                  {isDark ? 'ON' : 'OFF'}
                </span>
              </button>

              <div className="border-t border-dark-100 my-2"></div>

              {isAuthenticated ? (
                <div className="space-y-2 pt-2">
                  <div className="px-3 py-2 rounded-xl bg-dark-50">
                    <p className="text-xs text-dark-400 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-dark-800 truncate">{user?.email}</p>
                    <p className="text-[10px] uppercase font-extrabold tracking-wider text-accent-600 mt-0.5">{user?.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-dark-700 hover:bg-dark-100 font-semibold transition-all"
                  >
                    <FiUser className="text-lg" />
                    <span>My Profile</span>
                  </Link>

                  {user?.role === 'user' && (
                    <Link
                      to="/bookings"
                      onClick={closeMenus}
                      className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-dark-700 hover:bg-dark-100 font-semibold transition-all"
                    >
                      <FiCalendar className="text-lg" />
                      <span>My Bookings</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-bold transition-all text-left"
                  >
                    <FiLogOut className="text-lg" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link
                    to="/login"
                    onClick={closeMenus}
                    className="w-full text-center py-2.5 rounded-xl font-bold text-primary-600 border border-primary-100 hover:bg-primary-50 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenus}
                    className="w-full text-center py-2.5 rounded-xl font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-md transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
