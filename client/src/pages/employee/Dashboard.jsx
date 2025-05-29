import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FiEdit2, FiX } from "react-icons/fi";
import { fetchTodayAttendance } from "../../features/attendance/attendanceSlice";
import { updateUserProfile } from "../../features/auth/authSlice";
import { useInterval } from "../../utils/useInterval";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { today, loading: attendanceLoading } = useSelector((state) => state.attendance);

  const [liveWorkedTime, setLiveWorkedTime] = useState("");
  const [formData, setFormData] = useState({
    profileUrl: "",
    age: "",
    gender: "",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchTodayAttendance());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        profileUrl: user.profileUrl || "",
        age: user.age || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  useInterval(() => {
    if (today?.punchInTime && !today?.punchOutTime) {
      const start = new Date(today.punchInTime);
      const now = new Date();
      const diffMs = now - start;

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setLiveWorkedTime(`${hours}h ${minutes}m`);
    }
  }, 1000);

  const handlePunch = () => navigate("/punch");
  const handleHistory = () => navigate("/history");

  const openModal = () => {
    setIsModalVisible(true);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => setIsModalVisible(false), 250);
  };

  const isModified = () =>
    formData.profileUrl !== user.profileUrl ||
    String(formData.age) !== String(user.age) ||
    formData.gender !== user.gender;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isModified()) return toast.info("No changes made.");
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success("✅ Profile updated successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        closeModal();
      }, 1000);
    } catch (err) {
      toast.error(`❌ ${err}`);
    }
  };

  if (authLoading || attendanceLoading)
    return <div className="text-center mt-10">Loading your dashboard...</div>;

  if (!user)
    return <div className="text-center mt-10 text-red-500">No user data found. Please login again.</div>;

  const renderPunchStatus = () => {
    if (!today?.punchInTime) {
      return (
        <button
          onClick={handlePunch}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          ⏺️ Punch In
        </button>
      );
    } else if (!today?.punchOutTime) {
      return (
        <>
          <button
            onClick={handlePunch}
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600"
          >
            ⏹️ Punch Out
          </button>
          <p className="mt-4 text-lg text-green-700 font-medium">
            ⏱️ You are working — <span className="font-bold">{liveWorkedTime}</span>
          </p>
        </>
      );
    } else {
      const start = new Date(today.punchInTime);
      const end = new Date(today.punchOutTime);
      const diffMs = end - start;
      const workedHours = (diffMs / (1000 * 60 * 60)).toFixed(2);
      return (
        <p className="mt-6 text-blue-700 text-lg font-medium">
          ✅ You’ve worked {workedHours} hours today.
        </p>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 relative">
        <button
          onClick={openModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
        >
          <FiEdit2 size={22} />
        </button>

        <div className="flex flex-col items-center">
          <img
            src={user.profileUrl}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name} 👋</h1>
          <p className="text-gray-500">{user.role.toUpperCase()}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">📧 Email:</span> {user.email}</p>
          <p><span className="font-semibold">🎂 Age:</span> {user.age}</p>
          <p><span className="font-semibold">⚧ Gender:</span> {user.gender}</p>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-center">
          {renderPunchStatus()}
          <button
            onClick={handleHistory}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📖 View History
          </button>
        </div>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
          <div className={`bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-hidden ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-600">
                <FiX size={22} />
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
              {showSuccess && (
                <div className="flex justify-center items-center mb-4 text-green-600 text-3xl font-bold animate-bounce">
                  ✅ Saved!
                </div>
              )}

              <div className="flex justify-center mb-4">
                <img
                  src={formData.profileUrl}
                  alt="Preview"
                  className="w-20 h-20 rounded-full border object-cover"
                />
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block font-semibold">Name</label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="w-full border bg-gray-100 text-gray-500 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full border bg-gray-100 text-gray-500 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Role</label>
                  <input
                    type="text"
                    value={user.role}
                    readOnly
                    className="w-full border bg-gray-100 text-gray-500 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Profile Image URL</label>
                  <input
                    type="text"
                    name="profileUrl"
                    value={formData.profileUrl}
                    onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="flex justify-end items-center px-6 py-4 border-t">
              <button
                type="submit"
                onClick={handleUpdate}
                className={`px-4 py-2 text-white rounded ${isModified() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={!isModified()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
