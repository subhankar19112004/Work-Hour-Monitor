import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests, approveLeave, rejectLeave } from '../../features/leave/leaveSlice';
import { Link } from 'react-router-dom';

const AdminLeaveRequests = () => {
  const dispatch = useDispatch();
  const { leaveRequests = [], loading, error } = useSelector((state) => state.leave); // Default to an empty array

  useEffect(() => {
    dispatch(fetchLeaveRequests());  // Fetch all leave requests when the component mounts
  }, [dispatch]);

  const handleApprove = (leaveId) => {
    dispatch(approveLeave(leaveId));
  };

  const handleReject = (leaveId) => {
    dispatch(rejectLeave(leaveId));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded">
     <span className='absolute top-40 left-4 border-2 rounded-full border-transparent bg-black '><Link className='h-10 w-10 p-2 py-10 mt-10' to="/dashboard">⬅️</Link></span>

      <h2 className="text-2xl font-semibold text-center">Manage Leave Requests</h2>

      {loading && <p>Loading leave requests...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full table-auto mt-4">
        <thead>
          <tr>
            <th className="p-4">Employee</th>
            <th className="p-4">Start Date</th>
            <th className="p-4">End Date</th>
            <th className="p-4">Reason</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">No leave requests found.</td>
            </tr>
          ) : (
            leaveRequests.map((request) => (
              <tr key={request._id}>
                <td className="p-4">{request.user?.name}</td>
                <td className="p-4">{new Date(request?.startDate).toLocaleDateString()}</td>
                <td className="p-4">{new Date(request?.endDate).toLocaleDateString()}</td>
                <td className="p-4">{request?.reason}</td>
                <td className="p-4">{request?.status}</td>
                <td className="p-4">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLeaveRequests;
