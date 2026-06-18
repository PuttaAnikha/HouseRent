import User from '../models/UserSchema.js';
import Property from '../models/PropertySchema.js';
import Booking from '../models/BookingSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { hash, compare } = bcrypt;
const { sign } = jwt;

// Register user (Public signup)
export const registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  let allowedRoles = ["user", "owner"];

  // Block admin signup
  if (role === 'admin') {
    return res.status(400).json({ 
      message: "registration failed", 
      error: "Registration of administrator accounts is restricted." 
    });
  }

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ 
      message: "registration failed", 
      error: "invalid user role" 
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await hash(password, 12);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    role,
    isApproved: role !== 'owner' // owners need admin approval, renters auto-approved
  });

  await newUser.save();
  res.status(201).json({ message: "user created" });
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "login failed", error: "incorrect email or password" });
  }

  const isMatched = await compare(password, user.password);
  if (!isMatched) {
    return res.status(401).json({ message: "login failed", error: "incorrect email or password" });
  }

  const token = sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({ message: "login successful", token, payload: userObj });
};

// Get profile
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: "profile not found", error: "User not found" });
  }
  res.status(200).json({ message: "profile retrieved", payload: user });
};

// Update profile
export const updateUserProfile = async (req, res) => {
  const { name, phone, password } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "update failed", error: "User not found" });
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (password) {
    user.password = await hash(password, 12);
  }

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({ message: "profile updated successfully", payload: userObj });
};

// Logout user
export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  });
  res.status(200).json({ message: "logout success" });
};

// Get all properties (Public)
export const getPublicProperties = async (req, res) => {
  const properties = await Property.find().populate('ownerId', 'name email phone');
  res.status(200).json({
    message: "Properties retrieved",
    payload: properties
  });
};

// Get single property by ID (Public)
export const getPublicPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.propertyId).populate('ownerId', 'name email phone');
  if (!property) {
    return res.status(404).json({ message: 'Property listing not found' });
  }
  res.status(200).json({
    message: "Property retrieved",
    payload: property
  });
};

// Search properties with dynamic filters (Public)
export const searchProperties = async (req, res) => {
  const { city, minPrice, maxPrice, bedrooms, propertyType, amenities, minArea, maxArea } = req.query;
  const searchQuery = {};

  if (city) {
    searchQuery.city = { $regex: city, $options: 'i' };
  }
  if (propertyType) {
    searchQuery.propertyType = { $regex: propertyType, $options: 'i' };
  }
  if (bedrooms) {
    searchQuery.bedrooms = parseInt(bedrooms, 10);
  }
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
    if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
  }
  if (minArea || maxArea) {
    searchQuery.area = {};
    if (minArea) searchQuery.area.$gte = parseFloat(minArea);
    if (maxArea) searchQuery.area.$lte = parseFloat(maxArea);
  }
  if (amenities) {
    const amenitiesList = typeof amenities === 'string' 
      ? amenities.split(',').map(a => a.trim()).filter(Boolean) 
      : amenities;
    if (amenitiesList && amenitiesList.length > 0) {
      searchQuery.amenities = { 
        $all: amenitiesList.map(a => new RegExp('^' + a.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')) 
      };
    }
  }

  const properties = await Property.find(searchQuery).populate('ownerId', 'name email phone');
  res.status(200).json({
    message: "Search results retrieved",
    payload: properties
  });
};

// Create a booking request (Renter/Authenticated)
export const createBooking = async (req, res) => {
  const { propertyId, message, interestType } = req.body;

  if (!propertyId || !message) {
    return res.status(400).json({ message: 'Please provide propertyId and message' });
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }

  if (property.ownerId.toString() === req.user.id) {
    return res.status(400).json({ message: 'You cannot send an inquiry for your own property' });
  }

  const newBooking = new Booking({
    propertyId,
    senderId: req.user.id,
    ownerId: property.ownerId,
    message,
    interestType: interestType || 'rent'
  });

  await newBooking.save();
  res.status(201).json({
    message: 'Inquiry sent successfully',
    payload: newBooking
  });
};

// Get current renter's bookings (Sent bookings)
export const getRenterBookings = async (req, res) => {
  const bookings = await Booking.find({ senderId: req.user.id })
    .populate('propertyId', 'title address city state price status')
    .populate('senderId', 'name email phone')
    .populate('ownerId', 'name email phone');

  res.status(200).json({
    message: 'Inquiries retrieved',
    payload: bookings
  });
};
