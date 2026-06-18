import React from 'react';
import { FiTrash2, FiUserCheck, FiShield } from 'react-icons/fi';

const AllUsers = ({ users, onApproveOwner, onDeleteUser }) => {
  return (
    <div className="bg-white rounded-3xl border border-dark-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-dark-50 text-dark-500 font-bold uppercase text-[10px] tracking-wider border-b border-dark-100">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Phone</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-50 font-medium text-dark-700">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-dark-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-dark-50 text-dark-600 font-bold flex items-center justify-center">
                      {u.name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-bold text-dark-800">{u.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-dark-500">{u.email}</td>
                <td className="py-4 px-6 text-dark-500">{u.phone || 'N/A'}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    u.role === 'admin' ? 'bg-red-105 text-red-700 bg-red-50 border border-red-100' : u.role === 'owner' ? 'bg-primary-50 text-primary-700 border border-primary-100' : 'bg-green-50 text-green-700 border border-green-100'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {u.role === 'owner' ? (
                    u.isApproved ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-50 text-green-700 border border-green-200">
                        Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                        Pending Approval
                      </span>
                    )
                  ) : (
                    <span className="text-dark-400 font-bold text-xs">-</span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {u.role === 'owner' && !u.isApproved && (
                      <button
                        onClick={() => onApproveOwner(u._id)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-green-550 text-white bg-green-600 hover:bg-green-700 text-[10px] font-bold uppercase tracking-wider transition-all shadow-md shadow-green-500/10 cursor-pointer"
                        title="Approve Landlord"
                      >
                        <FiUserCheck className="text-xs" />
                        <span>Verify Owner</span>
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteUser(u._id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors inline-block cursor-pointer"
                      title="Delete user"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
