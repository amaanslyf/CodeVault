import axios from 'axios';

// 1. Create a new instance of axios with a custom configuration
const api = axios.create({
  // Set the base URL for all API requests.
  // Now you only need to write '/login' or '/repo/create' instead of the full URL.
  baseURL: 'http://localhost:3002',
});

// 2. Use an interceptor to automatically attach the JWT to every request
// This function runs before any request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  }
);

export default api;
