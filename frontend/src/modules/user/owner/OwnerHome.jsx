import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { propertyAPI, inquiryAPI } from '../../../services/api.js';
import { FiHome, FiMessageSquare, FiPlus, FiActivity } from 'react-icons/fi';
import { AuthContext } from '../../../context/AuthContext.jsx';
import AllProperties from './AllProperties.jsx';
import AddProperty from './AddProperty.jsx';
import AllBookings from './AllBookings.jsx';

const OwnerHome = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'add', 'inquiries'
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing state
  const [editingProperty, setEditingProperty] = useState(null);

  // Handle setting active tab from router state
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Fetch all properties
      const allPropsData = await propertyAPI.getAll();
      const allProps = allPropsData.payload || allPropsData.properties || [];
      
      // Filter only properties owned by current user
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const myProps = allProps.filter((p) => {
          const ownerId = p.ownerId?._id || p.ownerId;
          return ownerId === decoded.id;
        });
        setProperties(myProps);
      }

      // Fetch received inquiries/bookings
      const inqsData = await inquiryAPI.getReceived();
      setInquiries(inqsData.payload || inqsData.bookings || []);

    } catch (err) {
      console.error('Error fetching owner stats:', err);
      setErrorMsg('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFormSubmit = async (processedData) => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingProperty) {
        await propertyAPI.update(editingProperty._id, processedData);
        setSuccessMsg('Property listing updated successfully!');
      } else {
        await propertyAPI.create(processedData);
        setSuccessMsg('New property listed successfully!');
      }

      setEditingProperty(null);
      setActiveTab('listings');
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to submit listing form:', err);
      setErrorMsg(err.response?.data?.message || err.response?.data?.error || 'Failed to submit property form.');
    }
  };

  const handleEditClick = (prop) => {
    setEditingProperty(prop);
    setActiveTab('add'); // Switch to form tab
  };

  const handleDeleteClick = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This will also delete related bookings/inquiries.')) {
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await propertyAPI.delete(propertyId);
      setSuccessMsg('Property listing deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      console.error('Deletion failed:', err);
      setErrorMsg('Failed to delete property listing.');
    }
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
    setActiveTab('listings');
  };

  const handleUpdateStatus = async (bookingId, status) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await inquiryAPI.updateStatus(bookingId, status);
      setSuccessMsg(`Booking status updated to "${status}" successfully.`);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setErrorMsg('Failed to update booking status.');
    }
  };

  if (user && !user.isApproved) {
    return (
      <div className="min-h-screen bg-bgLight py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-dark-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mx-auto">
            ⏳
          </div>
          <h3 className="text-xl font-bold text-dark-800">Approval Pending</h3>
          <p className="text-dark-500 text-sm leading-relaxed font-medium">
            Your owner account is currently pending administrator verification. You will be able to add, edit, and manage property listings once approved.
          </p>
          <div className="pt-2 text-xs text-dark-400 font-semibold bg-dark-50 p-3 rounded-xl">
            Please check back later or contact support@nestora.com
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgLight py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Add Button */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-dark-800 tracking-tight sm:text-4xl">
              Landlord Dashboard
            </h1>
            <p className="mt-2 text-dark-400 font-semibold text-sm">
              Manage your listed properties and client inquiries.
            </p>
          </div>
          <button
            onClick={() => { setActiveTab('add'); setEditingProperty(null); }}
            className="self-center md:self-auto inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all shadow-md shadow-primary-500/20 hover:shadow-primary-500/30"
          >
            <FiPlus className="text-lg" />
            <span>List a New Property</span>
          </button>
        </div>

        {/* Banner Alert states */}
        {successMsg && (
          <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-xl text-green-700 text-sm font-semibold">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* 1. STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-500 flex items-center justify-center text-2xl">
              <FiHome />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Total Properties</span>
              <span className="text-2xl font-extrabold text-dark-800">{properties.length}</span>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-500 flex items-center justify-center text-2xl">
              <FiActivity />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Active Listings</span>
              <span className="text-2xl font-extrabold text-dark-800">
                {properties.filter((p) => p.status === 'available').length}
              </span>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-accent-100 text-accent-600 flex items-center justify-center text-2xl">
              <FiMessageSquare />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Inquiries Received</span>
              <span className="text-2xl font-extrabold text-dark-800">{inquiries.length}</span>
            </div>
          </div>
        </div>

        {/* 2. TABS */}
        <div className="flex space-x-4 border-b border-dark-100 mb-8">
          <button
            onClick={() => { setActiveTab('listings'); setEditingProperty(null); }}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'listings' ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-400 hover:text-dark-600'
            }`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'add' ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-400 hover:text-dark-600'
            }`}
          >
            {editingProperty ? 'Edit Property' : 'List New Property'}
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'inquiries' ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-400 hover:text-dark-600'
            }`}
          >
            Received Inquiries
          </button>
        </div>

        {/* 3. CONDITIONAL TAB CONTENTS */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'listings' && (
              <AllProperties
                properties={properties}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            )}

            {activeTab === 'add' && (
              <AddProperty
                initialData={editingProperty}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelEdit}
              />
            )}

            {activeTab === 'inquiries' && (
              <AllBookings
                bookings={inquiries}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerHome;
