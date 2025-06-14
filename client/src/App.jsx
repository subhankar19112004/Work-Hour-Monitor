import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, setToken } from './features/auth/authSlice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';  // Admin route for protected pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/employee/Dashboard';
import PunchPage from './pages/employee/punchPage';
import History from './pages/employee/History';
import LeaveRequestForm from './components/employee/LeaveRequestForm';  // Employee leave request form
import AdminLeaveRequests from './components/admin/AdminLeaveRequests';  // Admin leave request management
import AdminDashboard from './pages/admin/Dashboard';
import useInactivity from './utils/useInactivity'; // Import the inactivity hook
import InactivityModal from './components/common/InactivityModal'; // Import the inactivity modal
import AdminRoute from './components/common/AdminRoute'; // Import AdminRoute
import Snapshots from './components/admin/Shapshots'; // Import the Snapshots component
import ScreenshotCapture from './utils/screenShotCapture'; // Import Screenshot Capture for global usage

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const isInactive = useInactivity(); // Track inactivity status

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      dispatch(setToken(localToken));
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isInactive) {
      console.log('Opening inactivity modal'); // Debug log when modal should open
      setIsModalOpen(true);  // Open modal after inactivity
    }
  }, [isInactive]);

  const handleResetInactivity = () => {
    console.log('Resetting inactivity'); // Debug log when reset happens
    setIsModalOpen(false);  // Close modal when "I'm here" is clicked
  };

  return (
    <BrowserRouter>
      {token && <Navbar />} {/* Show Navbar only if logged in */}
      
      {/* Global Screenshot Capture */}
      <ScreenshotCapture /> {/* Make Screenshot Capture globally active */}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<ScreenshotCapture />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/punch"
          element={
            <PrivateRoute>
              <PunchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
        <Route
          path="/leave-request"
          element={
            <PrivateRoute>
              <LeaveRequestForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/leave-requests"
          element={
            <AdminRoute>
              <AdminLeaveRequests />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-control"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        {/* Admin Route for Snapshots */}
        <Route
          path="/admin/snapshots"
          element={
            <PrivateRoute>
              <AdminRoute>
              <Snapshots /> {/* Admin route to view snapshots */}
            </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Inactivity Modal */}
      <InactivityModal
        isOpen={isModalOpen}
        onReset={handleResetInactivity}
      />
    </BrowserRouter>
  );
}

export default App;
