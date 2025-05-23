// src/pages/Dashboard.jsx
import { useSelector } from 'react-redux';  // Use useSelector to access Redux store

export default function Dashboard() {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="text-center mt-10">Loading your dashboard...</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-red-500">No user data found. Please login again.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name} 👋</h1>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
      <p>Gender: {user.gender}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
