// src/pages/History.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceHistory } from '../features/attendance/attendanceSlice';

const History = () => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchAttendanceHistory());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📅 Attendance History</h1>

      {loading ? (
        <p>Loading history...</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Punch In</th>
                <th className="border px-4 py-2">Punch Out</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                history.map((record, idx) => (
                  <tr key={idx} className="even:bg-gray-50">
                    <td className="border px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString() : '-'}</td>
                    <td className="border px-4 py-2">{record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;