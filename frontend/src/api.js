import axios from 'axios';

// Create a new instance of axios with a custom configuration
const api = axios.create({
  // Set the base URL for all API requests.
   baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3002', // For Vite
});

//Use an interceptor to automatically attach the JWT to every request
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
    return Promise.reject(error);
  }
);

export default api;
