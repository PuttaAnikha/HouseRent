import express from 'express';
import { 
  createProperty, 
  updateProperty, 
  deleteProperty, 
  getReceivedBookings, 
  updateBookingStatus 
} from '../controllers/ownerController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Secure all routes in this router to authenticated owners or admins
router.use(verifyToken);
router.use(authorizeRoles('owner', 'admin'));

router.post('/property/create', createProperty);
router.put('/property/update/:propertyId', updateProperty);
router.delete('/property/delete/:propertyId', deleteProperty);
router.get('/bookings/received', getReceivedBookings);
router.put('/booking/status/:bookingId', updateBookingStatus);

export default router;
