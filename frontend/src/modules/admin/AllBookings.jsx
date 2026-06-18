import React from 'react';
import { FiHome, FiUser, FiCalendar } from 'react-icons/fi';

const AllBookings = ({ bookings }) => {
  return (
    <div className="bg-white rounded-3xl border border-dark-100 shadow-sm overflow-hidden">
      {bookings.length === 0 ? (
        <div className="p-12 text-center text-dark-400 font-semibold text-sm">
          No bookings or inquiries found in the system.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-dark-50 text-dark-500 font-bold uppercase text-[10px] tracking-wider border-b border-dark-100">
                <th className="py-4 px-6">Reference Property</th>
                <th className="py-4 px-6">Renter (Sender)</th>
                <th className="py-4 px-6">Owner (Recipient)</th>
                <th className="py-4 px-6">Inquiry Date</th>
                <th className="py-4 px-6">Message</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-50 font-medium text-dark-700">
              {bookings.map((inq) => {
                const prop = inq.propertyId || {};
                const sender = inq.senderId || {};
                const owner = inq.ownerId || {};
                const formattedDate = new Date(inq.createdAt || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <tr key={inq._id} className="hover:bg-dark-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                          <FiHome />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-dark-800 block leading-tight">{prop.title || 'N/A'}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                              inq.interestType === 'buy'
                                ? 'bg-amber-550 bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-blue-550 bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {inq.interestType || 'rent'}
                            </span>
                          </div>
                          <span className="text-[10px] text-dark-400 font-semibold">{prop.city || 'N/A'}, {prop.state || ''}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <FiUser className="text-dark-400" />
                        <div>
                          <span className="block font-bold text-dark-800 leading-tight">{sender.name || 'N/A'}</span>
                          <span className="text-xs text-dark-400 block">{sender.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <FiUser className="text-primary-450 text-primary-500" />
                        <div>
                          <span className="block font-bold text-dark-800 leading-tight">{owner.name || 'N/A'}</span>
                          <span className="text-xs text-dark-400 block">{owner.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-dark-500 font-semibold">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1.5" />
                        {formattedDate}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-dark-500 max-w-[200px] truncate" title={inq.message}>
                      {inq.message}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inq.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' : inq.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inq.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
