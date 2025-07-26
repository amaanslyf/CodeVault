import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext"; // Adjust path if needed
import "./navbar.css";
import logo from "../assets/codevault_icon.png";

const Navbar = () => {
  // --- NEW: Get user state and logout function from auth context ---
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  // --- NEW: Handle user logout ---
  const handleLogout = () => {
    // Clear user data from storage and state
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    // Redirect to the login page
    navigate("/auth");
  };

  return (
    <nav>
      <div>
        <Link to={currentUser ? "/" : "/auth"}>
          <img src={logo} alt="CodeVault Logo" />
        </Link>
        {currentUser && <h3>Welcome to CodeVault</h3>}
      </div>

      {/* --- NEW: Dynamic navigation links --- */}
      <div>
        {currentUser ? (
          // --- Links to show when user IS logged in ---
          <>
            <Link to="/createrepo">
              <p className="link">Create Repository</p>
            </Link>
            <Link to="/profile">
              <p className="link">Profile</p>
            </Link>
            <button onClick={handleLogout} className="link-button">
              Logout
            </button>
          </>
        ) : (
          // --- Links to show when user IS NOT logged in ---
          <>
            <Link to="/auth">
              <p className="link">Login</p>
            </Link>
            <Link to="/signup">
              <p className="link">Sign Up</p>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
