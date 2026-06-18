import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically scrolls the page to the top whenever the route changes
 * This fixes the issue where navigation appears to not work because content is off-screen
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top smoothly when route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
