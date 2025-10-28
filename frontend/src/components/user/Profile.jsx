import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../authContext"; // Import useAuth
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const Profile = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // Get setCurrentUser from context
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await api.put(`/updateProfile/${userDetails._id}`, { password });
      setSuccess("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setEditMode(false);
    } catch (err) {
      console.error("Error updating password:", err);
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/deleteProfile/${userDetails._id}`);
      
      // Clear authentication state
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setCurrentUser(null);
      
      // Navigate to login page
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(err.response?.data?.message || "Failed to delete account.");
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Unable to load profile. Please try again.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {userDetails.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {userDetails.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
              {success}
            </Alert>
          )}

          <Typography variant="h5" gutterBottom fontWeight="bold">
            Account Settings
          </Typography>

          {!editMode ? (
            <Box>
              <Typography variant="body1" color="text.secondary" mb={2}>
                Manage your account security and preferences
              </Typography>
              <Button
                variant="contained"
                onClick={() => setEditMode(true)}
                sx={{ mr: 2 }}
              >
                Change Password
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleUpdatePassword} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button type="submit" variant="contained">
                  Update Password
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    setPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ bgcolor: '#fff5f5', p: 3, borderRadius: 2, border: '1px solid #ffcccc' }}>
            <Typography variant="h6" color="error" gutterBottom fontWeight="bold">
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Once you delete your account, there is no going back. All your repositories and data will be permanently deleted.
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you absolutely sure you want to delete your account? This action cannot be undone.
            All your repositories, commits, and issues will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
