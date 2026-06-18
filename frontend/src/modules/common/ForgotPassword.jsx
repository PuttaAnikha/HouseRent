import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    // Simulate password reset email send
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-bgLight">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-dark-100 p-8 sm:p-10"
      >
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
          <h2 className="text-2xl font-extrabold text-dark-800">Reset Password</h2>
          <p className="text-sm font-semibold text-dark-400 mt-1">We will send you a secure link to reset your password.</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm">
              <FiCheckCircle />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-dark-850">Check Your Inbox</h3>
              <p className="text-sm font-medium text-dark-500 leading-relaxed">
                If an account exists for <span className="font-semibold text-dark-800">{email}</span>, we have sent instructions to reset your password.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center space-x-2 w-full py-4 rounded-2xl font-bold bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-500/20 transition-all"
            >
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold">
                {errorMsg}
              </div>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/25 active:scale-98 transition-all flex justify-center items-center disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Send Recovery Email'
              )}
            </button>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center text-sm font-bold text-primary-500 hover:text-primary-600 space-x-1.5">
                <FiArrowLeft />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
