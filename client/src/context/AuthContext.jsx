import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Stores user data
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');  // JWT token
  const [loading, setLoading] = useState(false);

  // Login function: calls backend, saves token and user data
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      console.log(token, user);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(error.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout function: clears state and localStorage
  const logoutUser = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  // Fetch user data with token on app load or token change
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        console.error('Fetch user error:', error.response?.data || error.message);
        logoutUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
