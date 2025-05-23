// src/App.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './features/auth/authSlice'; // Action to fetch user data
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Dispatch action to fetch user data from the backend using the token
      dispatch(fetchUser(token));
    }
  }, [dispatch]); // Only run on component mount

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
