import React, { useState } from 'react';
import { FiMail, FiPhone, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const AllBookings = ({ bookings, onUpdateStatus }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, type, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(`${id}-${type}`);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }).catch(err => console.error("Clipboard copy failed:", err));
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse';
    }
  };

  const getEmailLink = (email, propTitle) => {
    const subject = `Nestora Listing: ${propTitle || 'Inquiry'}`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}`;
  };

  const getWhatsAppLink = (phone, propTitle) => {
    if (!phone) return '';
    let formattedPhone = phone.replace(/[^0-9]/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '91' + formattedPhone;
    }
    const text = encodeURIComponent(`Hello! Regarding your inquiry on Nestora for the listing "${propTitle}", I am contacting you to discuss rental options.`);
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.startsWith('+91') && cleaned.length === 13) {
      return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
    }
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dark-100 shadow-sm text-center text-dark-400 font-semibold text-sm">
          No bookings or inquiries received yet.
        </div>
      ) : (
        bookings.map((inq) => {
          const prop = inq.propertyId || {};
          const tenant = inq.senderId || {};
          const isPending = inq.status === 'pending';
          const formattedDate = new Date(inq.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          return (
            <div
              key={inq._id}
              className="bg-white rounded-3xl p-6 border border-dark-100 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Renter Details */}
              <div className="lg:col-span-4 space-y-3">
                <div>
                  <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block mb-1">Renter Contact</span>
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-dark-50 text-dark-600 font-bold flex items-center justify-center">
                      {tenant.name?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-dark-850 leading-tight truncate">{tenant.name || 'Anonymous User'}</h4>
                      <span className="text-[10px] text-dark-400 font-semibold block mb-1">Submitted {formattedDate}</span>
                      <div className="space-y-0.5 text-[11px] font-semibold text-dark-500">
                        {tenant.email && (
                          <div className="flex items-center space-x-1.5 truncate">
                            <FiMail className="text-dark-400 flex-shrink-0" />
                            <span className="truncate">{tenant.email}</span>
                          </div>
                        )}
                        {tenant.phone && (
                          <div className="flex items-center space-x-1.5">
                            <FiPhone className="text-dark-400 flex-shrink-0" />
                            <span>{formatPhoneNumber(tenant.phone)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <a
                    href={getEmailLink(tenant.email, prop.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleCopy(tenant.email, 'email', inq._id)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 py-2 rounded-xl bg-dark-50 hover:bg-primary-50 text-dark-600 hover:text-primary-500 border border-dark-100 hover:border-primary-200 text-xs font-bold transition-all"
                  >
                    {copiedId === `${inq._id}-email` ? (
                      <>
                        <FiCheck className="text-green-500 animate-bounce" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiMail />
                        <span>Email</span>
                      </>
                    )}
                  </a>
                  <a
                    href={`tel:${tenant.phone}`}
                    onClick={() => handleCopy(tenant.phone, 'phone', inq._id)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 py-2 rounded-xl bg-dark-50 hover:bg-primary-50 text-dark-600 hover:text-primary-500 border border-dark-100 hover:border-primary-200 text-xs font-bold transition-all"
                  >
                    {copiedId === `${inq._id}-phone` ? (
                      <>
                        <FiCheck className="text-green-500 animate-bounce" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiPhone />
                        <span>Call</span>
                      </>
                    )}
                  </a>
                  {tenant.phone && (
                    <a
                      href={getWhatsAppLink(tenant.phone, prop.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center space-x-1 py-2 rounded-xl bg-dark-50 hover:bg-green-50 text-dark-600 hover:text-green-600 border border-dark-100 hover:border-green-200 text-xs font-bold transition-all"
                    >
                      <FaWhatsapp />
                      <span>Text</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Renter Message & Listing reference */}
              <div className="lg:col-span-5 space-y-2 lg:border-l lg:border-r lg:border-dark-100 lg:px-6">
                <div>
                  <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block mb-0.5">Reference Property</span>
                  <span className="text-sm font-bold text-dark-800 block leading-snug">{prop.title || 'Property Listing'}</span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wide">
                      Price: ${prop.price?.toLocaleString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${
                      inq.interestType === 'buy'
                        ? 'bg-amber-550 bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-550 bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {inq.interestType || 'rent'}
                    </span>
                  </div>
                </div>
                <div className="bg-dark-50/50 p-3 rounded-xl border border-dark-100 text-xs font-medium text-dark-600 italic">
                  "{inq.message}"
                </div>
              </div>

              {/* Status & Action Buttons */}
              <div className="lg:col-span-3 flex flex-col justify-between items-end space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(inq.status)}`}>
                    {inq.status}
                  </span>
                </div>

                {isPending && (
                  <div className="flex space-x-2 w-full lg:w-auto">
                    <button
                      onClick={() => onUpdateStatus(inq._id, 'approved')}
                      className="flex-1 lg:flex-initial inline-flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs shadow-md shadow-green-500/10 active:scale-98 transition-all"
                    >
                      <FiCheck />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onUpdateStatus(inq._id, 'rejected')}
                      className="flex-1 lg:flex-initial inline-flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 border border-dark-200 hover:border-red-200 text-red-500 font-bold text-xs transition-all"
                    >
                      <FiX />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })
      )}
    </div>
  );
};

export default AllBookings;
