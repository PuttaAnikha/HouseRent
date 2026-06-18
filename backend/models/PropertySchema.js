import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      trim: true
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms cannot be negative']
    },
    area: {
      type: Number,
      required: [true, 'Area (sq ft) is required'],
      min: [0, 'Area cannot be negative']
    },
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    videoUrl: {
      type: String,
      trim: true,
      default: ''
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID reference is required']
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'rented', 'sold'],
        message: '{VALUE} is not a valid property status'
      },
      default: 'available'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('Property', PropertySchema);
