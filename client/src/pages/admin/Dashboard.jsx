// src/pages/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/admin/adminSlice.js';
import { motion } from 'framer-motion';
import EmployeeTable from '../../components/admin/EmployeeTable.jsx';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!loading && users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, loading, users.length]);

  const active = users.filter(u => u.isActive).length;

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      <motion.div className="grid md:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-700">
        <Card title="Total Employees" value={users.length} />
        <Card title="Active Today" value={active} />
        <Card title="Pending Tasks" value={5} />
      </motion.div>

      <motion.div
        className="rounded-xl bg-white p-6 shadow-card3d animate-in fade-in duration-700 delay-200"
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <EmployeeTable employees={users} />
        )}
      </motion.div>
    </motion.div>
  );
}

function Card({ title, value }) {
  return (
    <motion.div
      className="rounded-lg p-5 bg-white shadow-card3d text-center"
      whileHover={{ scale: 1.03 }}
    >
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </motion.div>
  );
}
