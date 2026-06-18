import React, { useState, useEffect } from 'react';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const AddProperty = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    price: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: '',
    images: '',
    videoUrl: '',
    status: 'available'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        propertyType: initialData.propertyType || 'Apartment',
        price: initialData.price || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pincode: initialData.pincode || '',
        bedrooms: initialData.bedrooms || '',
        bathrooms: initialData.bathrooms || '',
        area: initialData.area || '',
        amenities: initialData.amenities ? initialData.amenities.join(', ') : '',
        images: initialData.images ? initialData.images.join(', ') : '',
        videoUrl: initialData.videoUrl || '',
        status: initialData.status || 'available'
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Preprocess comma separated values
    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: parseInt(formData.bedrooms, 10),
      bathrooms: parseInt(formData.bathrooms, 10),
      area: parseFloat(formData.area),
      amenities: formData.amenities ? formData.amenities.split(',').map((item) => item.trim()).filter(Boolean) : [],
      images: formData.images ? formData.images.split(',').map((item) => item.trim()).filter(Boolean) : []
    };

    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-dark-100 shadow-sm space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-dark-100 pb-4">
        <h3 className="text-lg font-bold text-dark-800 flex items-center space-x-2">
          <FiHome className="text-primary-500" />
          <span>{initialData ? 'Edit Property Details' : 'List Property Information'}</span>
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-dark-400 hover:text-red-500 transition-colors flex items-center space-x-1"
        >
          <FiArrowLeft />
          <span>Cancel & Go Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Property Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. Modern Villa with Pool"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Property Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Property Type</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all cursor-pointer"
          >
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
          </select>
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Rent / Sale Price ($ / Month or Total)</label>
          <input
            type="number"
            name="price"
            required
            placeholder="e.g. 2500"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Availability Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all cursor-pointer"
          >
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {/* Address */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Street Address</label>
          <input
            type="text"
            name="address"
            required
            placeholder="e.g. 123 Main St"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">City</label>
          <input
            type="text"
            name="city"
            required
            placeholder="e.g. Austin"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* State */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">State</label>
          <input
            type="text"
            name="state"
            required
            placeholder="e.g. Texas"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Pincode */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Pincode</label>
          <input
            type="text"
            name="pincode"
            required
            placeholder="e.g. 78701"
            value={formData.pincode}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Area */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Area (Sq Ft)</label>
          <input
            type="number"
            name="area"
            required
            placeholder="e.g. 1500"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Bedrooms */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            required
            placeholder="e.g. 3"
            value={formData.bedrooms}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Bathrooms */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            required
            placeholder="e.g. 2"
            value={formData.bathrooms}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Amenities */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Amenities (comma separated)</label>
          <input
            type="text"
            name="amenities"
            placeholder="e.g. Swimming Pool, Gym, Garage, Balcony"
            value={formData.amenities}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Images */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Image URLs (comma separated)</label>
          <input
            type="text"
            name="images"
            placeholder="e.g. https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
            value={formData.images}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Video Tour URL */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Virtual Tour Video URL (MP4 link or YouTube URL - optional)</label>
          <input
            type="text"
            name="videoUrl"
            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://example.com/video.mp4"
            value={formData.videoUrl}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Description</label>
          <textarea
            name="description"
            required
            rows="4"
            placeholder="Describe your property..."
            value={formData.description}
            onChange={handleInputChange}
            className="w-full bg-dark-50/50 text-dark-800 text-sm p-4 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all resize-none"
          ></textarea>
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-3 border-t border-dark-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-2xl font-bold text-dark-600 bg-dark-50 hover:bg-dark-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-3.5 rounded-2xl font-bold text-white bg-primary-500 hover:bg-primary-600 transition-all shadow-md shadow-primary-500/20"
        >
          {initialData ? 'Save Changes' : 'Publish Property'}
        </button>
      </div>
    </form>
  );
};

export default AddProperty;
