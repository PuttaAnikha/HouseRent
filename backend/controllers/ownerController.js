import Property from '../models/PropertySchema.js';
import Booking from '../models/BookingSchema.js';

// Create a new property listing (Owner/Admin)
export const createProperty = async (req, res) => {
  const {
    title,
    description,
    propertyType,
    price,
    address,
    city,
    state,
    pincode,
    bedrooms,
    bathrooms,
    area,
    amenities,
    images,
    status
  } = req.body;

  const newProperty = new Property({
    title,
    description,
    propertyType,
    price,
    address,
    city,
    state,
    pincode,
    bedrooms,
    bathrooms,
    area,
    amenities: amenities || [],
    images: images || [],
    ownerId: req.user.id,
    status: status || 'available'
  });

  await newProperty.save();
  res.status(201).json({
    message: 'Property listed successfully',
    payload: newProperty
  });
};

// Update property listing (Owner/Admin)
export const updateProperty = async (req, res) => {
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ message: 'Property listing not found' });
  }

  // Ensure owner is modifying their own listing or admin is doing it
  if (property.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: You do not have permission to update this listing' });
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate('ownerId', 'name email phone');

  res.status(200).json({
    message: 'Property listing updated successfully',
    payload: updatedProperty
  });
};

// Delete property listing (Owner/Admin)
export const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ message: 'Property listing not found' });
  }

  if (property.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this listing' });
  }

  // Delete property and cascade delete bookings referencing it
  await Property.findByIdAndDelete(propertyId);
  await Booking.deleteMany({ propertyId });

  res.status(200).json({
    message: 'Property listing deleted successfully'
  });
};

// Get received bookings (Owner/Admin)
export const getReceivedBookings = async (req, res) => {
  let query = {};
  if (req.user.role === 'admin') {
    query = {};
  } else {
    query = { ownerId: req.user.id };
  }

  const bookings = await Booking.find(query)
    .populate('propertyId', 'title address city state price status')
    .populate('senderId', 'name email phone')
    .populate('ownerId', 'name email phone');

  res.status(200).json({
    message: 'Inquiries retrieved',
    payload: bookings
  });
};

// Update booking status and property availability (Owner/Admin)
export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body; // 'approved', 'rejected', 'pending'

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Inquiry not found' });
  }

  if (booking.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }

  const originalStatus = booking.status;
  booking.status = status;
  await booking.save();

  // Update property status
  if (status === 'approved') {
    const property = await Property.findById(booking.propertyId);
    if (property) {
      const isSale = /sale|buy|sell|purchase/i.test((property.title || '') + ' ' + (property.description || ''));
      property.status = isSale ? 'sold' : 'rented';
      await property.save();
    }
  } else if (originalStatus === 'approved' && (status === 'rejected' || status === 'pending')) {
    const property = await Property.findById(booking.propertyId);
    if (property) {
      property.status = 'available';
      await property.save();
    }
  }

  res.status(200).json({
    message: `Inquiry status updated to ${status}`,
    payload: booking
  });
};
