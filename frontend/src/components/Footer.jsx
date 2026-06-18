import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';

const Footer = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const showFavorites = !isAuthenticated || user?.role === 'user';
  const showInsights = !isAuthenticated || user?.role !== 'user';
  const isManagement = isAuthenticated && (user?.role === 'owner' || user?.role === 'admin');

  if (isManagement) {
    return (
      <footer className="bg-dark-800 text-white pt-16 pb-12 border-t border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Logo & Tagline */}
            <div className="flex flex-col items-center space-y-3">
              <Link to="/" className="flex items-center space-x-2 group">
                <svg className="w-9 h-9 text-primary-400 transition-transform group-hover:rotate-12 duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 80 V35 L50 15 L80 35 V80 H60 V55 H40 V80 Z" fill="currentColor" />
                  <path d="M50 15 L85 38 L80 44 L50 24 L20 44 L15 38 Z" fill="#f59e0b" />
                </svg>
                <span className="text-2xl font-bold tracking-tight text-white">
                  Nestora
                </span>
              </Link>
              <p className="text-dark-300 text-sm max-w-lg leading-relaxed font-medium">
                Find Your Perfect Place to Call Home. Nestora is a premium property marketplace simplifying property searches for renters, and listing management for owners.
              </p>
            </div>

            {/* Navigation links in horizontal list */}
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold text-dark-300">
              <Link to="/" className="hover:text-primary-400 transition-colors">Home Page</Link>
              <Link to="/properties" className="hover:text-primary-400 transition-colors">Search Properties</Link>
              <Link to="/insights" className="hover:text-primary-400 transition-colors">Market Insights</Link>
              <Link
                to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/owner'}
                className="hover:text-primary-400 transition-colors"
              >
                {user.role === 'admin' ? 'Admin Panel' : 'Owner Dashboard'}
              </Link>
              <Link to="/profile" className="hover:text-primary-400 transition-colors">Account Profile</Link>
            </nav>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 rounded-full bg-dark-700 hover:bg-primary-500 flex items-center justify-center text-white transition-colors">
                <FiTwitter />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dark-700 hover:bg-primary-500 flex items-center justify-center text-white transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dark-700 hover:bg-primary-500 flex items-center justify-center text-white transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dark-700 hover:bg-primary-500 flex items-center justify-center text-white transition-colors">
                <FiLinkedin />
              </a>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-dark-700 pt-6"></div>

            {/* Footer Bottom metadata */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center text-sm text-dark-400 gap-4">
              <p>&copy; {new Date().getFullYear()} Nestora Inc. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary-400 transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-dark-800 text-white pt-16 pb-8 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <svg className="w-9 h-9 text-primary-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 80 V35 L50 15 L80 35 V80 H60 V55 H40 V80 Z" fill="currentColor" />
                <path d="M50 15 L85 38 L80 44 L50 24 L20 44 L15 38 Z" fill="#f59e0b" />
              </svg>
              <span className="text-2xl font-bold tracking-tight text-white">
                Nestora
              </span>
            </Link>
            <p className="text-dark-300 text-sm leading-relaxed">
              Find Your Perfect Place to Call Home. Nestora is a premium property marketplace simplifying property searches for renters, and listing management for owners.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-dark-700 hover:bg-primary-500 flex items-center justify-center text-white transition-colors">
                <FiTwitter />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dark-700 hover:bg-primary-500 flex items-center justify-center text-white transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dark-700 hover:bg-primary-500 flex items-center justify-center text-white transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-dark-700 hover:bg-primary-500 flex items-center justify-center text-white transition-colors">
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-base font-bold text-white mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3.5 text-sm text-dark-300">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-primary-400 transition-colors">Search Properties</Link>
              </li>
              {showInsights && (
                <li>
                  <Link to="/insights" className="hover:text-primary-400 transition-colors">Market Insights</Link>
                </li>
              )}
              {showFavorites && (
                <li>
                  <Link to="/favourites" className="hover:text-primary-400 transition-colors">Saved Listings</Link>
                </li>
              )}
              <li>
                <Link to="/profile" className="hover:text-primary-400 transition-colors">Account Profile</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-base font-bold text-white mb-6 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm text-dark-300">
              <li className="flex items-start space-x-3">
                <FiMapPin className="text-primary-400 text-lg mt-0.5" />
                <span>100 Austin Tower, Downtown Tech Square, Austin, TX 78701</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="text-primary-400 text-lg" />
                <span>+1 (512) 555-0199</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="text-primary-400 text-lg" />
                <span>support@nestora.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-base font-bold text-white mb-6 uppercase tracking-wider">Newsletter</h4>
            <p className="text-dark-300 text-sm mb-4 leading-relaxed">
              Subscribe to stay updated with fresh listings and market insights.
            </p>
            <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-dark-700 text-white text-sm px-4 py-3 rounded-xl border border-dark-600 focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white transition-all shadow-md hover:shadow-primary-600/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-dark-400">
          <p>&copy; {new Date().getFullYear()} Nestora Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
