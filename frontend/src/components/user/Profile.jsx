import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await api.get('/me');
      setUserDetails(response.data);
    } catch (err) {
      console.error("Cannot fetch user details: ", err);
      setError("Failed to load your profile. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    try {
      await api.put(`/updateProfile/${userDetails._id}`, { password });
      setEditMode(false);
      setPassword("");
      setConfirmPassword("");
      console.log("Password updated successfully!"); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
      try {
        await api.delete(`/deleteProfile/${userDetails._id}`);
        localStorage.clear();
        navigate('/auth');
      } catch (err) {
        console.error("Error deleting profile: ", err);
        setError("Failed to delete your account. Please try again.");
      }
    }
  };

  if (loading) {
    // Using global loading-message class
    return (
      <div className="page-container">
        <div className="loading-message">Loading profile...</div>
      </div>
    );
  }
  
  if (!userDetails) {
    // Using global error-message class
    return (
      <div className="page-container">
        <div className="error-message">{error || "Could not load profile."}</div>
      </div>
    );
  }

  return (
    <div className="page-container profile-page-wrapper"> {/* Applied global page-container */}
      <div className="user-profile-card card"> {/* Applied global card utility class */}
        <h3>Account Settings</h3>
        <div className="profile-info">
          <p><strong>Username:</strong> {userDetails.username}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
        </div>
        <hr className="divider" /> {/* Applied global divider class name for consistency */}
        <div className="profile-actions">
          <h4>Manage Account</h4>
          {editMode ? (
            <form onSubmit={handleUpdatePassword} className="password-form">
              <p>Enter a new password for your account.</p>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="New Password" 
                required 
                className="input-field" 
              />
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm New Password" 
                required 
                className="input-field" 
              />
              {error && <p className="error-message">{error}</p>}
              <div className="form-buttons">
                <button type="submit" className="button-primary"> {/* Applied global button-primary */}
                  Update Password
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="button-secondary"> {/* New button-secondary or similar */}
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button className="button-primary" onClick={() => setEditMode(true)}> {/* Applied global button-primary */}
              Change Password
            </button>
          )}
        </div>
        <hr className="divider" /> {/* Applied global divider class name for consistency */}
        <div className="danger-zone card"> {/* Applied global card utility class & danger-zone */}
          <h4>Danger Zone</h4>
          <p>This action is irreversible. Please be certain.</p>
          <button className="button-danger" onClick={handleDelete}> {/* Applied global button-danger */}
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
