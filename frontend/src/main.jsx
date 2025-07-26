import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './authContext.jsx';
import ProjectRoutes from './Routes.jsx'; // Corrected the import name
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode is good practice for development
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <ProjectRoutes />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
