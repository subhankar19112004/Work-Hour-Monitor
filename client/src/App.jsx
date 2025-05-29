// src/App.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, setToken } from './features/auth/authSlice';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/employee/Dashboard';
import PunchPage from './pages/employee/punchPage';
import History from './pages/employee/History';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRoute from './components/common/AdminRote';



function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      dispatch(setToken(localToken));
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      {token && <Navbar />} {/* ✅ Show Navbar only if logged in */}
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
    </BrowserRouter>
  );
}

export default App;
