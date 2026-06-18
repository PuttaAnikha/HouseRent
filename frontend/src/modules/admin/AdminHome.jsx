import React, { useState, useEffect } from 'react';
import { adminAPI, inquiryAPI } from '../../services/api.js';
import { FiUsers, FiHome, FiTrendingUp, FiActivity, FiUserPlus, FiLayers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import AllUsers from './AllUsers.jsx';
import AllProperty from './AllProperty.jsx';
import AllBookings from './AllBookings.jsx';

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'properties', 'bookings', 'charts', 'add-admin'

  // Add Admin form state
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const usersData = await adminAPI.getUsers();
      setUsers(usersData.payload || usersData.users || []);

      const propsData = await adminAPI.getProperties();
      setProperties(propsData.payload || propsData.properties || []);

      const bookingsData = await inquiryAPI.getReceived();
      setBookings(bookingsData.payload || bookingsData.bookings || []);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setErrorMsg('Failed to load administrative records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Deleting this user will cascade and permanently delete all properties they own and all inquiries they sent or received. Proceed?')) {
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await adminAPI.deleteUser(userId);
      setSuccessMsg('User and all associated properties/inquiries deleted successfully.');
      fetchAdminData();
    } catch (err) {
      console.error('Failed to delete user:', err);
      setErrorMsg('Failed to delete user.');
    }
  };

  const handleApproveOwner = async (userId) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await adminAPI.approveOwner(userId);
      setSuccessMsg('Owner account verified and approved successfully.');
      fetchAdminData();
    } catch (err) {
      console.error('Failed to approve owner:', err);
      setErrorMsg('Failed to approve owner account.');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property listing? This deletes all associated inquiries.')) {
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await adminAPI.deleteProperty(propertyId);
      setSuccessMsg('Property listing and inquiries deleted successfully.');
      fetchAdminData();
    } catch (err) {
      console.error('Failed to delete property:', err);
      setErrorMsg('Failed to delete property.');
    }
  };

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');
    
    if (!adminForm.name || !adminForm.email || !adminForm.phone || !adminForm.password) {
      setAdminError('Please fill out all fields.');
      return;
    }

    if (adminForm.password.length < 5) {
      setAdminError('Password should be at least 5 characters long.');
      return;
    }

    setAdminSubmitting(true);
    try {
      await adminAPI.addAdmin(adminForm);
      setAdminSuccess('New administrator account registered successfully!');
      setAdminForm({ name: '', email: '', phone: '', password: '' });
      fetchAdminData(); // Refresh user list to include new admin
    } catch (err) {
      console.error('Admin creation failed:', err);
      setAdminError(err.response?.data?.message || err.response?.data?.error || 'Failed to register new admin.');
    } finally {
      setAdminSubmitting(false);
    }
  };

  // Compile Chart Data
  const roleCounts = users.reduce((acc, curr) => {
    acc[curr.role] = (acc[curr.role] || 0) + 1;
    return acc;
  }, {});
  const roleChartData = Object.keys(roleCounts).map((key) => ({
    name: key.toUpperCase(),
    value: roleCounts[key]
  }));

  const typeCounts = properties.reduce((acc, curr) => {
    acc[curr.propertyType] = (acc[curr.propertyType] || 0) + 1;
    return acc;
  }, {});
  const typeChartData = Object.keys(typeCounts).map((key) => ({
    name: key,
    listings: typeCounts[key]
  }));

  const COLORS = ['#2563EB', '#3B82F6', '#F59E0B', '#10B981'];

  return (
    <div className="min-h-screen bg-bgLight py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-dark-800 tracking-tight sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-dark-400 font-semibold text-sm">
              Overview statistics, user approvals, property management, and admin accounts.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('add-admin')}
            className="self-center md:self-auto inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 cursor-pointer"
          >
            <FiUserPlus className="text-lg" />
            <span>Create New Admin</span>
          </button>
        </div>

        {/* Alert Banners */}
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

        {/* 1. STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Total Users */}
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-500 flex items-center justify-center text-2xl">
              <FiUsers />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Total Users</span>
              <span className="text-2xl font-extrabold text-dark-800">{users.length}</span>
            </div>
          </div>
          {/* Total Properties */}
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center text-2xl">
              <FiHome />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Total Listings</span>
              <span className="text-2xl font-extrabold text-dark-800">{properties.length}</span>
            </div>
          </div>
          {/* Active Landlords */}
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-500 flex items-center justify-center text-2xl">
              <FiActivity />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Active Landlords</span>
              <span className="text-2xl font-extrabold text-dark-800">
                {users.filter((u) => u.role === 'owner').length}
              </span>
            </div>
          </div>
          {/* Total Bookings/Inquiries */}
          <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl bg-accent-100 text-accent-600 flex items-center justify-center text-2xl">
              <FiLayers />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-dark-400 tracking-wider">Total Inquiries</span>
              <span className="text-2xl font-extrabold text-dark-800">{bookings.length}</span>
            </div>
          </div>
        </div>

        {/* 2. TAB CONTROLS */}
        <div className="flex space-x-4 border-b border-dark-100 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'users' ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-400 hover:text-dark-600'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'properties' ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-400 hover:text-dark-600'
            }`}
          >
            Manage Properties
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings' ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-400 hover:text-dark-600'
            }`}
          >
            Inquiries Log
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'charts' ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-400 hover:text-dark-600'
            }`}
          >
            Analytics &amp; Charts
          </button>
          <button
            onClick={() => setActiveTab('add-admin')}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'add-admin' ? 'border-primary-500 text-primary-500' : 'border-transparent text-dark-400 hover:text-dark-600'
            }`}
          >
            Register Admin
          </button>
        </div>

        {/* 3. TABS CONTENTS */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'users' && (
              <AllUsers
                users={users}
                onApproveOwner={handleApproveOwner}
                onDeleteUser={handleDeleteUser}
              />
            )}

            {activeTab === 'properties' && (
              <AllProperty
                properties={properties}
                onDeleteProperty={handleDeleteProperty}
              />
            )}

            {activeTab === 'bookings' && (
              <AllBookings
                bookings={bookings}
              />
            )}

            {activeTab === 'charts' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* 1. Pie Chart - Roles */}
                <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex flex-col items-center">
                  <h4 className="text-base font-bold text-dark-850 mb-6 uppercase tracking-wider">User Roles Distribution</h4>
                  <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roleChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {roleChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Bar Chart - Types */}
                <div className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm flex flex-col items-center">
                  <h4 className="text-base font-bold text-dark-850 mb-6 uppercase tracking-wider">Property Type Volumes</h4>
                  <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={typeChartData}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontStyle="bold" />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="listings" fill="#2563EB" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'add-admin' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-dark-100 shadow-sm max-w-md mx-auto space-y-6">
                <div className="border-b border-dark-100 pb-4">
                  <h3 className="text-lg font-bold text-dark-800 flex items-center space-x-2">
                    <FiUserPlus className="text-primary-500" />
                    <span>Create Admin Account</span>
                  </h3>
                  <p className="text-xs text-dark-400 mt-1 font-semibold">
                    Register a new administrator with complete system privileges.
                  </p>
                </div>

                {adminError && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-700 text-sm font-semibold">
                    {adminError}
                  </div>
                )}
                {adminSuccess && (
                  <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-xl text-green-700 text-sm font-semibold">
                    {adminSuccess}
                  </div>
                )}

                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Admin Name"
                      value={adminForm.name}
                      onChange={handleAdminFormChange}
                      className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="admin2@gmail.com"
                      value={adminForm.email}
                      onChange={handleAdminFormChange}
                      className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      placeholder="10 digit number"
                      value={adminForm.phone}
                      onChange={handleAdminFormChange}
                      className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-dark-500 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      value={adminForm.password}
                      onChange={handleAdminFormChange}
                      className="w-full bg-dark-50/50 text-dark-800 text-sm px-4 py-3 rounded-2xl border border-dark-100 focus:outline-none focus:border-primary-500 focus:bg-white font-semibold transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={adminSubmitting}
                    className="w-full py-4 rounded-2xl font-bold text-white bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/25 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center mt-2 cursor-pointer"
                  >
                    {adminSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Register Administrator'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
