import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!token) {
    return (
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          Work Hour Monitor
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center relative">
      <Link to="/dashboard" className="font-bold text-xl">
        Work Hour Monitor
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <img
            src={user?.profileUrl || 'https://via.placeholder.com/40'}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <span className="hidden md:inline">{user?.name || 'User'}</span>
          <svg
            className={`w-4 h-4 transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-20">
            <Link
              to="/dashboard"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={() => setDropdownOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/premium"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={() => setDropdownOpen(false)}
            >
              Premium
            </Link>
            <Link
              to="/admin"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={() => setDropdownOpen(false)}
            >
              Login as Admin
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white text-red-600 font-semibold"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
