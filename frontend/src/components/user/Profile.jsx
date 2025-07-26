import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await api.get(`/userProfile/${userId}`);
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) return setError("Passwords don't match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    
    try {
      await api.put(`/updateProfile/${localStorage.getItem("userId")}`, { password });
      setEditMode(false);
      setPassword("");
      setConfirmPassword("");
      alert("Password updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await api.delete(`/deleteProfile/${localStorage.getItem("userId")}`);
      // The logout logic is now handled by the Navbar, but we can clear storage here too just in case.
      localStorage.clear();
      // A full page reload to clear all state is a good idea after deletion.
      window.location.href = '/auth';
    } catch (err) {
      console.error("Error deleting profile: ", err);
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="user-profile-section">
        <div className="profile-image"></div>
        <div className="name">
          <h3>{userDetails.username}</h3>
          <p>{userDetails.email}</p>
        </div>
        {editMode ? (
          <form onSubmit={handleUpdatePassword}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" required />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required />
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Update Password</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        ) : (
          <button className="edit-btn" onClick={() => setEditMode(true)}>Change Password</button>
        )}
        <button className="delete-btn" onClick={handleDelete}>Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
