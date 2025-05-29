import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Register.css'; // for custom animations and transitions

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    password: '',
    role: '', // Added role field
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registered! Now login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 transition-all duration-500 ease-in-out">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 transform transition-all duration-500 ease-in-out"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Register</h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          required
        />

        {/* Age */}
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="input-field"
          required
        />

        {/* Gender */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />

        {/* Role (Admin/Employee) */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select Role</option>
          <option value="admin">admin</option>
          <option value="employee">employee</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn hover:bg-indigo-700 transition-all duration-300 ease-in-out"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
