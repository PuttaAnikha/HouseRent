import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ show, message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getTheme = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200 text-red-800',
          icon: <FiXCircle className="text-red-500 text-lg" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          icon: <FiAlertCircle className="text-amber-500 text-lg" />
        };
      default:
        return {
          bg: 'bg-green-50 border-green-200 text-green-800',
          icon: <FiCheckCircle className="text-green-500 text-lg" />
        };
    }
  };

  const theme = getTheme();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-5 right-5 z-[9999] max-w-sm w-full p-4 rounded-2xl border shadow-lg flex items-center space-x-3 backdrop-blur-sm ${theme.bg}`}
        >
          <div className="flex-shrink-0">{theme.icon}</div>
          <div className="flex-grow text-xs font-semibold leading-relaxed">{message}</div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors focus:outline-none"
          >
            <FiX className="text-sm" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
