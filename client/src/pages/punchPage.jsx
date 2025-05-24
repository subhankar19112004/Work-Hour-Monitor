import { useEffect, useState } from 'react';
import axios from '../utils/api';
import { useSelector } from 'react-redux';
import CameraCapture from '../components/CameraCapture';
import { useNavigate } from 'react-router-dom';

const PunchPage = () => {
  const [status, setStatus] = useState(null); // "none", "punched-in", "punched-out"
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch today's attendance
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
          setStatus('none');
        } else if (data.punchInTime && !data.punchOutTime) {
          setStatus('punched-in');
        } else {
          setStatus('punched-out');
        }
      } catch (err) {
        console.error('Status fetch failed', err);
        setStatus('none');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [token]);

  const handleCapture = async (photoData) => {
    try {
      let endpoint = status === 'none' ? '/attendance/punch-in' : '/attendance/punch-out';

      const res = await axios.post(
        endpoint,
        { photo: photoData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setMessage('Punch failed. Try again.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-10">Checking punch status...</div>;

  if (status === 'punched-out') {
    return <div className="text-center mt-10 text-green-600">✅ You already punched in and out today.</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        {status === 'none' ? 'Punch In' : 'Punch Out'}
      </h1>

      <CameraCapture onCapture={handleCapture} />

      {message && <p className="text-center mt-4 text-blue-600">{message}</p>}
    </div>
  );
};

export default PunchPage;
