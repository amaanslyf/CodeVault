import React, { useState } from 'react';
import api from '../../api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

const CreateIssue = ({ repoId, onIssueCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setTitleError('');
    setDescriptionError('');

    const titleValidationError = validateTitle(title);
    const descriptionValidationError = validateDescription(description);

    if (titleValidationError) {
      setTitleError(titleValidationError);
      return;
    }

    if (descriptionValidationError) {
      setDescriptionError(descriptionValidationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(`/issue/create/${repoId}`, {
        title,
        description,
      });
      console.log('Issue created:', response.data);
      onIssueCreated(response.data);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error creating issue:', err);
      setGeneralError(
        err.response?.data?.message || 'Failed to create issue. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Create New Issue
      </Typography>

      {generalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {generalError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Issue Title"
          name="title"
          autoFocus
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError('');
          }}
          disabled={isLoading}
          error={!!titleError}
          helperText={titleError}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Issue Description"
          name="description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionError('');
          }}
          disabled={isLoading}
          error={!!descriptionError}
          helperText={descriptionError}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Create Issue'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateIssue;
