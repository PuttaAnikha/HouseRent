import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const token = localStorage.getItem('token');
      if (token) {
        const auth = JSON.parse(atob(token.split('.')[1]));
        if (auth.role === 'admin') {
          navigate('/dashboard/admin');
        } else if (auth.role === 'owner') {
          navigate('/dashboard/owner');
        } else {
          navigate('/profile');
        }
      } else {
        navigate('/');
      }
    } else {
      setErrorMsg(result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-bgLight">
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
          <h2 className="text-2xl font-extrabold text-dark-800">Welcome Back</h2>
          <p className="text-sm font-semibold text-dark-400 mt-1">Please enter your credentials to log in.</p>
        </div>

        {/* Error alert banner */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold"
          >
            {errorMsg}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                <FiMail />
              </div>
              <input
                type="email"
                required
                placeholder="owner@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-50/50 text-dark-800 text-sm pl-11 pr-4 py-3.5 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-semibold"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary-500 hover:text-primary-650 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                <FiLock />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••"
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
              'Log In'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-8 pt-6 border-t border-dark-100">
          <p className="text-sm font-semibold text-dark-500">
            New to Nestora?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-600">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
