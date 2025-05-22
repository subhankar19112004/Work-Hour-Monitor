import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // backend URL
});

// Add token if available
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  return req;
});


export default api;