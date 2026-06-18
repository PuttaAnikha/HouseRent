import express from 'express';
import { 
  getAllUsers, 
  getAllProperties, 
  deleteUser, 
  deleteProperty, 
  approveOwner, 
  addAdmin 
} from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Secure all routes in this router to administrators only
router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.delete('/user/:userId', deleteUser);
router.delete('/property/:propertyId', deleteProperty);
router.put('/approve-owner/:userId', approveOwner);
router.post('/add-admin', addAdmin);

export default router;
