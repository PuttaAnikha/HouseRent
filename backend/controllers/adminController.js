import User from '../models/UserSchema.js';
import Property from '../models/PropertySchema.js';
import Booking from '../models/BookingSchema.js';
import bcrypt from 'bcryptjs';

const { hash } = bcrypt;

// Retrieve all users (Excludes passwords)
export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({
    message: 'Users retrieved',
    payload: users
  });
};

// Retrieve all properties
export const getAllProperties = async (req, res) => {
  const properties = await Property.find().populate('ownerId', 'name email phone');
  res.status(200).json({
    message: 'Properties retrieved',
    payload: properties
  });
};

// Delete user and cascade delete properties/bookings
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user._id.toString() === req.user.id) {
    return res.status(400).json({ message: 'Admins cannot delete their own accounts' });
  }

  await User.findByIdAndDelete(userId);
  await Property.deleteMany({ ownerId: userId });
  await Booking.deleteMany({
    $or: [{ senderId: userId }, { ownerId: userId }]
  });

  res.status(200).json({
    message: 'User and all their properties/bookings deleted successfully'
  });
};

// Delete property listing and cascade delete bookings
export const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }

  await Property.findByIdAndDelete(propertyId);
  await Booking.deleteMany({ propertyId });

  res.status(200).json({
    message: 'Property and its related bookings deleted successfully by Admin'
  });
};

// Approve Owner account
export const approveOwner = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.role !== 'owner') {
    return res.status(400).json({ message: 'User is not an owner' });
  }

  user.isApproved = true;
  await user.save();

  res.status(200).json({
    message: 'Owner approved successfully',
    payload: user
  });
};

// Add new administrator account (Accessible to logged-in admins only)
export const addAdmin = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'All registration fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await hash(password, 12);
  const newAdmin = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    role: 'admin',
    isApproved: true // admins are auto-approved
  });

  await newAdmin.save();
  res.status(201).json({
    message: 'New Admin account created successfully',
    payload: {
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role
    }
  });
};
