// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/admin/adminSlice';
import { motion } from 'framer-motion';
import EmployeeTable from '../../components/admin/EmployeeTable';
import axios from 'axios';  // Import axios to make the HTTP request
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const [todayAttendance, setTodayAttendance] = useState([]);  // State to hold active punched-in users

  useEffect(() => {
    if (!loading && users.length === 0) {
      dispatch(fetchUsers());  // Fetch all users if not already loaded
    }
  }, [dispatch, loading, users.length]);

  // Fetch active punched-in users when the component mounts
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await axios.get('/api/attendance/active-punched-in-users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTodayAttendance(res.data.users || []);  // Set the active users data
      } catch (err) {
        console.error('Error fetching active punched-in users:', err);
        setTodayAttendance([]);
      }
    };

    fetchActiveUsers();  // Call the function to fetch active punched-in users
  }, []);  // Only run once when the component mounts

  const activeUserIds = new Set(todayAttendance.map(entry => entry.user._id));  // Create a set of active user IDs
  const activeTodayCount = users.filter(u => activeUserIds.has(u._id)).length;  // Count the number of active users

  return (
    <motion.div
      className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
    
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <span className='absolute top-40 left-4 border-2 rounded-full border-transparent bg-black '><Link className='h-10 w-10 p-2 py-10 mt-10' to="/dashboard">⬅️</Link></span>

      <motion.div className="grid md:grid-cols-3 gap-6 mb-8 animate-in fade-in duration-700">
        <SummaryCard title="Total Employees" value={users.length} />
        <SummaryCard title="Active Today" value={activeTodayCount} />
        <SummaryCard title="Pending Tasks" value={5} />
      </motion.div>

      <motion.div
        className="rounded-xl bg-white p-6 shadow-card3d animate-in fade-in duration-700 delay-200"
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <EmployeeTable employees={users} activeUserIds={activeUserIds} />
        )}
      </motion.div>
    </motion.div>
  );
};

const SummaryCard = ({ title, value }) => {
  return (
    <motion.div
      className="rounded-lg p-5 bg-white shadow-card3d text-center"
      whileHover={{ scale: 1.03 }}
    >
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </motion.div>
  );
};

export default AdminDashboard;
