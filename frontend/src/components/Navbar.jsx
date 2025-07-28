// frontend/src/components/Navbar.jsx (REPLACE FULL FILE)

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import "./navbar.css";
import logo from "../assets/codevault_icon.png";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/auth");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Link to={currentUser ? "/" : "/auth"} className="navbar-logo-link">
          <img src={logo} alt="CodeVault Logo" className="navbar-logo" />
        </Link>
        {currentUser && <h3 className="navbar-welcome">Welcome to CodeVault</h3>}
      </div>

      <div className="navbar-right">
        {currentUser ? (
          <>
            <Link to="/createrepo" className="navbar-link">
              Create Repository
            </Link>
            <Link to="/profile" className="navbar-link">
              Profile
            </Link>
            <button onClick={handleLogout} className="navbar-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="navbar-link">
              Login
            </Link>
            <Link to="/signup" className="navbar-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
