// src/components/employee/LeaveRequestForm.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyLeave } from '../../features/leave/leaveSlice';
import { Link, useNavigate } from 'react-router-dom';

const LeaveRequestForm = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.leave);

  const handleSubmit = (e) => {
    e.preventDefault();
    const leaveData = { startDate, endDate, reason };
    dispatch(applyLeave(leaveData))
      .unwrap()
      .then(() => {
        navigate('/dashboard');  // Redirect after successful leave request
      })
      .catch((err) => {
        alert('Error applying leave: ' + err);
      });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded">
     <span className='absolute top-40 left-4 border-2 rounded-full border-transparent bg-black '><Link className='h-10 w-10 p-2 py-10 mt-10' to="/dashboard">⬅️</Link></span>

      <h2 className="text-2xl font-semibold text-center">Apply for Leave</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default LeaveRequestForm;
