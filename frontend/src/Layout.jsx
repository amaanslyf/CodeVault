import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Box from '@mui/material/Box';

const Layout = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Outlet />
    </Box>
  );
};

export default Layout;
