import React, { useState } from 'react';
import api from '../../api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const IssueItem = ({ issue, onIssueUpdate, onIssueDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(issue.title);
  const [editedDescription, setEditedDescription] = useState(issue.description);
  const [error, setError] = useState('');

  const validateTitle = (value) => {
    if (!value.trim()) {
      return 'Issue title cannot be empty.';
    }
    if (value.length < 5) {
      return 'Title must be at least 5 characters long.';
    }
    if (value.length > 100) {
      return 'Title cannot exceed 100 characters.';
    }
    return '';
  };

  const validateDescription = (value) => {
    if (!value.trim()) {
      return 'Issue description cannot be empty.';
    }
    if (value.length < 10) {
      return 'Description must be at least 10 characters long.';
    }
    return '';
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(issue.title);
    setEditedDescription(issue.description);
    setError('');
  };

  const handleSave = async () => {
    const titleError = validateTitle(editedTitle);
    const descriptionError = validateDescription(editedDescription);

    if (titleError) {
      setError(titleError);
      return;
    }

    if (descriptionError) {
      setError(descriptionError);
      return;
    }

    try {
      const response = await api.put(`/issue/update/${issue._id}`, {
        title: editedTitle,
        description: editedDescription,
      });
      onIssueUpdate(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Error updating issue:', err);
      setError(err.response?.data?.message || 'Failed to update issue.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) {
      return;
    }

    try {
      await api.delete(`/issue/delete/${issue._id}`);
      onIssueDelete(issue._id);
    } catch (err) {
      console.error('Error deleting issue:', err);
      setError(err.response?.data?.message || 'Failed to delete issue.');
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = issue.status === 'open' ? 'closed' : 'open';
    try {
      const response = await api.put(`/issue/update/${issue._id}`, {
        status: newStatus,
      });
      onIssueUpdate(response.data);
    } catch (err) {
      console.error('Error toggling issue status:', err);
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {!isEditing ? (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h6" fontWeight="bold">
                  {issue.title}
                </Typography>
                <Chip
                  icon={issue.status === 'open' ? <ErrorIcon /> : <CheckCircleIcon />}
                  label={issue.status}
                  color={issue.status === 'open' ? 'warning' : 'success'}
                  size="small"
                />
              </Box>
              <Typography variant="body1" color="text.secondary" mb={1}>
                {issue.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created by {issue.author?.username || 'Unknown'} on{' '}
                {new Date(issue.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Box display="flex" gap={1}>
              <IconButton onClick={handleEdit} color="primary" size="small">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={handleToggleStatus}
            startIcon={issue.status === 'open' ? <CheckCircleIcon /> : <ErrorIcon />}
          >
            Mark as {issue.status === 'open' ? 'Closed' : 'Open'}
          </Button>
        </Box>
      ) : (
        <Box>
          <TextField
            fullWidth
            label="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            multiline
            rows={4}
            margin="normal"
          />
          <Box display="flex" gap={1} mt={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default IssueItem;
