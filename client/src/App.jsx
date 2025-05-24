// src/App.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from './features/auth/authSlice'; // Action to fetch user data
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PunchPage from './pages/punchPage';
import History from './pages/History';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Dispatch action to fetch user data from the backend using the token
      dispatch(fetchUserProfile(token));
    }
  }, [dispatch]); // Only run on component mount

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/punch" element={<PunchPage />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
