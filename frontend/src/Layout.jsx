import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; // Adjust path if needed



const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content-area">
        {/* The <Outlet> component renders the matched child route's component */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
