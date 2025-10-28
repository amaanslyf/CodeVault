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
  console.log('ProtectedRoute - currentUser:', currentUser);
  return currentUser ? children : <Navigate to="/login" replace />;
};

const ProjectRoutes = () => {
  console.log('ProjectRoutes rendering');
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="create-repo" element={<ProtectedRoute><CreateRepo /></ProtectedRoute>} />
        <Route path="repo/:id" element={<ProtectedRoute><ViewRepo /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

export default ProjectRoutes;
