import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  logoutUser, 
  getPublicProperties, 
  getPublicPropertyById, 
  searchProperties, 
  createBooking, 
  getRenterBookings 
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/properties', getPublicProperties);
router.get('/property/:propertyId', getPublicPropertyById);
router.get('/search', searchProperties);

// Protected routes (Logged-in general users)
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.post('/booking/send', verifyToken, createBooking);
router.get('/bookings/my', verifyToken, getRenterBookings);

export default router;
