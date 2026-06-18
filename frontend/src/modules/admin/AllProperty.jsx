import React from 'react';
import { FiTrash2, FiMapPin } from 'react-icons/fi';

const AllProperty = ({ properties, onDeleteProperty }) => {
  return (
    <div className="bg-white rounded-3xl border border-dark-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-dark-50 text-dark-500 font-bold uppercase text-[10px] tracking-wider border-b border-dark-100">
              <th className="py-4 px-6">Property Details</th>
              <th className="py-4 px-6">Landlord</th>
              <th className="py-4 px-6">Location</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-50 font-medium text-dark-700">
            {properties.map((prop) => (
              <tr key={prop._id} className="hover:bg-dark-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <span className="font-bold text-dark-800 block leading-tight">{prop.title}</span>
                      <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wide">{prop.propertyType}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="block font-bold text-dark-800 leading-tight">{prop.ownerId?.name || 'Owner'}</span>
                  <span className="text-xs text-dark-400 block">{prop.ownerId?.email || 'N/A'}</span>
                </td>
                <td className="py-4 px-6 text-dark-500">
                  <div className="flex items-center space-x-1">
                    <FiMapPin className="text-dark-400 flex-shrink-0" />
                    <span>{prop.city}, {prop.state}</span>
                  </div>
                </td>
                <td className="py-4 px-6 font-bold text-primary-500">
                  ${prop.price?.toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    prop.status === 'available' ? 'bg-green-50 text-green-700 border border-green-200' : prop.status === 'rented' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {prop.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => onDeleteProperty(prop._id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors inline-block cursor-pointer"
                    title="Delete listing"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProperty;
