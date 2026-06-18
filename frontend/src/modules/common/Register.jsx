import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Register = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') || 'user';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole === 'admin' ? 'user' : initialRole); // Preselected role (no admin allowed)
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email || !phone || !password || !role) {
      setErrorMsg('Please fill out all fields.');
      return;
    }

    // Email structure validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Phone validation: +91 followed by exactly 10 digits starting with 6-9
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian phone number (starting with 6, 7, 8, or 9).');
      return;
    }

    if (role === 'admin') {
      setErrorMsg('Registration of administrator accounts is restricted.');
      return;
    }

    if (password.length < 5) {
      setErrorMsg('Password should be at least 5 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password, phone, role);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setErrorMsg(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-bgLight">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-dark-100 p-8 sm:p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 justify-center mb-4">
            <svg className="w-10 h-10 text-primary-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 80 V35 L50 15 L80 35 V80 H60 V55 H40 V80 Z" fill="currentColor" />
              <path d="M50 15 L85 38 L80 44 L50 24 L20 44 L15 38 Z" fill="#f59e0b" />
            </svg>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Nestora
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-dark-800">Create Account</h2>
          <p className="text-sm font-semibold text-dark-400 mt-1">Join Nestora and find your dream home today.</p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold"
          >
            {errorMsg}
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-xl text-green-700 text-sm font-semibold animate-pulse"
          >
            {successMsg}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* Role Tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">I want to register as a</label>
            <div className="grid grid-cols-2 gap-2 bg-dark-50 p-1.5 rounded-2xl border border-dark-100">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  role === 'user'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-dark-500 hover:text-dark-700'
                }`}
              >
                Tenant
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  role === 'owner'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-dark-500 hover:text-dark-700'
                }`}
              >
                Landlord
              </button>
            </div>
          </div>

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
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-50/50 text-dark-800 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                <FiMail />
              </div>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-50/50 text-dark-800 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          {/* Phone Number */}
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
                className="w-full bg-dark-50/50 text-dark-800 text-sm pl-20 pr-4 py-3.5 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                <FiLock />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 5 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-50/50 text-dark-800 text-sm pl-11 pr-12 py-3.5 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-dark-400 hover:text-dark-600 focus:outline-none"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/25 active:scale-98 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center mt-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-8 pt-6 border-t border-dark-100">
          <p className="text-sm font-semibold text-dark-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
