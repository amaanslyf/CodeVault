// frontend/src/components/repo/CreateIssue.jsx (REPLACE FULL FILE)

import React, { useState } from 'react';
import api from '../../api';
import './CreateIssue.css';

const CreateIssue = ({ repoId, onIssueCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState(''); // Changed to generalError to avoid conflict
  const [titleError, setTitleError] = useState('');     // NEW: For specific title errors
  const [descriptionError, setDescriptionError] = useState(''); // NEW: For specific description errors

  // Validation functions
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (titleError) setTitleError(''); // Clear error on change
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (descriptionError) setDescriptionError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run all validations
    const newTitleError = validateTitle(title);
    const newDescriptionError = validateDescription(description);

    if (newTitleError || newDescriptionError) {
      setTitleError(newTitleError);
      setDescriptionError(newDescriptionError);
      setGeneralError('Please fix the errors in the form.'); // General message for form issues
      return;
    }

    setIsLoading(true);
    setGeneralError('');
    setTitleError('');
    setDescriptionError('');

    try {
      const response = await api.post(`/issue/create/${repoId}`, { title, description });
      onIssueCreated(response.data);
      setTitle('');
      setDescription('');
      // Optionally show a success message here (e.g., using a toast)
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Failed to create issue.');
      console.error('Issue creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-issue-container"> {/* The parent ViewRepo.jsx applies the .card class */}
      <h3>Submit a New Issue</h3>
      <form onSubmit={handleSubmit} className="create-issue-form">
        {generalError && <div className="error-message general-form-error">{generalError}</div>}
        
        <div className="form-group">
          <label htmlFor="issue-title">Issue Title<span className="required-star">*</span></label>
          <input
            id="issue-title"
            type="text"
            placeholder="A concise summary of the issue"
            value={title}
            onChange={handleTitleChange}
            className={`input-field ${titleError ? 'input-error' : ''}`}
          />
          {titleError && <p className="input-error-message">{titleError}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="issue-description">Description<span className="required-star">*</span></label>
          <textarea
            id="issue-description"
            placeholder="Leave a detailed description of the issue"
            value={description}
            onChange={handleDescriptionChange}
            rows="5" // Set a default number of rows for textarea
            className={`input-field ${descriptionError ? 'input-error' : ''}`}
          />
          {descriptionError && <p className="input-error-message">{descriptionError}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="button-primary" // Use global button primary style
        >
          {isLoading ? 'Submitting...' : 'Submit new issue'}
        </button>
      </form>
    </div>
  );
};

export default CreateIssue;
