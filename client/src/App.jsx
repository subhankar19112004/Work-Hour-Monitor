import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, setToken } from './features/auth/authSlice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/employee/Dashboard';
import PunchPage from './pages/employee/punchPage';
import History from './pages/employee/History';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRoute from './components/common/AdminRote';

import useInactivity from './utils/useInactivity'; // Import the inactivity hook
import InactivityModal from './components/common/InactivityModal'; // Import the inactivity modal

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
      <Routes>
        <Route path="/" element={<Login />} />
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
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
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
