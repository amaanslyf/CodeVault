import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

const CreateRepo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');

  const validateName = (value) => {
    if (!value.trim()) {
      return "Repository name cannot be empty.";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Name can only contain letters, numbers, dashes, and underscores.";
    }
    if (value.length < 3) {
      return "Name must be at least 3 characters long.";
    }
    if (value.length > 100) {
      return "Name cannot exceed 100 characters.";
    }
    return '';
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    
    const validationError = validateName(value);
    setNameError(validationError);
    if (!validationError) {
      setError('');
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleVisibilityChange = (e) => {
    setVisibility(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setNameError('');

    const validationError = validateName(name);
    if (validationError) {
      setNameError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        name: name.trim(),
        description: description.trim(),
        visibility: visibility
      };
      
      await api.post('/repo/create', requestData);
      navigate('/dashboard');
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to create repository. Please try again.';
      
      if (errorMessage.includes('already exists')) {
        setNameError(errorMessage);
      } else {
        setError(errorMessage);
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Create a New Repository
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            A repository contains all project files, including the revision history.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Repository Name"
              name="name"
              autoFocus
              value={name}
              onChange={handleNameChange}
              disabled={isLoading}
              error={!!nameError}
              helperText={nameError || "Use only letters, numbers, dashes, and underscores"}
            />

            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description (optional)"
              name="description"
              multiline
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              disabled={isLoading}
              helperText="Brief description of your repository"
            />

            <Box sx={{ mt: 3, mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={visibility}
                    onChange={handleVisibilityChange}
                    disabled={isLoading}
                    color="primary"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {visibility ? <PublicIcon color="success" /> : <LockIcon />}
                    <Typography>
                      {visibility ? "Public Repository" : "Private Repository"}
                    </Typography>
                  </Box>
                }
              />
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                {visibility 
                  ? "Anyone can see this repository. You choose who can commit."
                  : "You choose who can see and commit to this repository."}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Repository'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateRepo;
