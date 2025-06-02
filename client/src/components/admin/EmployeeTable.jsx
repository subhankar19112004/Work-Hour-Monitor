// src/components/admin/EmployeeTable.jsx

import React from 'react';
import { useDispatch } from 'react-redux';
import { updateUserRole, deleteUser } from '../../features/admin/adminSlice';
import { motion } from 'framer-motion';

const EmployeeTable = ({ employees }) => {
  const dispatch = useDispatch();

  return (
    <table className="w-full text-left border-collapse text-sm">
      <thead>
        <tr className="bg-slate-100">
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Role</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <motion.tr
            key={emp._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t hover:bg-slate-50"
          >
            <td className="p-2">{emp.name}</td>
            <td className="p-2">{emp.email}</td>
            <td className="p-2">
              <select
                value={emp.role}
                onChange={(e) => dispatch(updateUserRole({ userId: emp._id, role: e.target.value }))}
                className="p-1 border rounded"
              >
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </td>
            <td className="p-2">
              {/* Check the `status` field and display "Active" or "Inactive" */}
              {emp.status === 'active' ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-gray-400">Inactive</span>
              )}
            </td>
            <td className="p-2 space-x-2">
              <button
                onClick={() => dispatch(updateUserRole({ userId: emp._id, role: emp.role }))}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Update
              </button>
              <button
                onClick={() => dispatch(deleteUser(emp._id))}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;
