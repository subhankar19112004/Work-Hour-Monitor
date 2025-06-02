import { useEffect, useState } from 'react';
import axios from '../../utils/api';
import { useSelector, useDispatch } from 'react-redux';
import CameraCapture from '../../components/common/CameraCapture';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../features/auth/authSlice'; // Import action to fetch user profile

const PunchPage = () => {
  const [status, setStatus] = useState(null); // "none", "punched-in", "punched-out"
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { token } = useSelector((state) => state.auth); // Access token from redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch today's attendance status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get('/attendance/today', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        if (!data.punchInTime) {
          setStatus('none'); // User has not punched in yet
        } else if (data.punchInTime && !data.punchOutTime) {
          setStatus('punched-in'); // User has punched in but not out yet
        } else {
          setStatus('punched-out'); // User has punched out
        }
      } catch (err) {
        console.error('Status fetch failed', err);
        setStatus('none'); // Default to 'none' if an error occurs
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };

    fetchStatus();
  }, [token]); // Add token as dependency so that status is fetched again when the token changes

  // Handle camera capture and perform punch-in or punch-out action
const handleCapture = async (photoData) => {
  try {
    let endpoint = status === 'none' ? '/attendance/punch-in' : '/attendance/punch-out';

    const res = await axios.post(
      endpoint,
      { photo: photoData },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessage(res.data.message);

    // After punch-in or punch-out, refresh the user profile
    await dispatch(fetchUserProfile());  // This will update the `status` in Redux

    setTimeout(() => navigate('/dashboard'), 3000);
  } catch (err) {
    setMessage('Punch failed. Try again.');
    console.error(err);
  }
};


  // Show loading state while checking the status
  if (loading) return <div className="text-center mt-10">Checking punch status...</div>;

  // If the user has already punched in and out
  if (status === 'punched-out') {
    return <div className="text-center mt-10 text-green-600">✅ You already punched in and out today.</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        {status === 'none' ? 'Punch In' : 'Punch Out'}
      </h1>

      <CameraCapture onCapture={handleCapture} /> {/* CameraCapture component to capture image for punch-in/punch-out */}

      {message && <p className="text-center mt-4 text-blue-600">{message}</p>} {/* Display the response message */}
    </div>
  );
};

export default PunchPage;
