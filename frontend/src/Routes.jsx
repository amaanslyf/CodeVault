import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import Layout from './Layout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import CreateRepo from './components/repo/CreateRepo';
import ViewRepo from './components/repo/ViewRepo';
import Profile from './components/user/Profile';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" />;
};

// --- MODIFIED: Renamed to ProjectRoutes and removed BrowserRouter ---
const ProjectRoutes = () => {
  return (
    // The <BrowserRouter> wrapper has been removed from this file.
    <Routes>
      <Route path="/auth" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<Layout />}>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/createrepo" element={<ProtectedRoute><CreateRepo /></ProtectedRoute>} />
        <Route path="/repo/viewrepo/:id" element={<ProtectedRoute><ViewRepo /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ProjectRoutes; // Export as default
