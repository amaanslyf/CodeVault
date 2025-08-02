import React, { useState } from 'react';
import './IssueItem.css';

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
    setError(''); // Clear any previous error when entering edit mode
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    setEditedTitle(issue.title);
    setEditedDescription(issue.description);
    setError('');
  };

  const handleSave = () => {
    const titleValidationError = validateTitle(editedTitle);
    const descriptionValidationError = validateDescription(editedDescription);

    if (titleValidationError || descriptionValidationError) {
      // Concatenate errors or choose to show only one at a time
      setError(titleValidationError || descriptionValidationError);
      return;
    }
    
    // Call the parent update function
    onIssueUpdate(issue._id, { title: editedTitle, description: editedDescription });
    setIsEditing(false);
    setError('');
  };

  if (isEditing) {
    // --- Render the EDITING view ---
    return (
      <li className="issue-item editing">
        <div className="issue-edit-form">
          {error && <p className="error-message edit-form-error">{error}</p>} {/* Use global error-message */}
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => {
              setEditedTitle(e.target.value);
              if (error) setError(''); // Clear error on typing
            }}
            className={`input-field ${validateTitle(editedTitle) ? 'input-error' : ''}`}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => {
              setEditedDescription(e.target.value);
              if (error) setError(''); // Clear error on typing
            }}
            className={`input-field ${validateDescription(editedDescription) ? 'input-error' : ''}`}
            rows="3"
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="button-primary save-button">Save</button>
            <button onClick={handleCancel} className="button-secondary cancel-button">Cancel</button> {/* Use button-secondary */}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="issue-item">
      <div className="issue-status-icon">
        {issue.status === 'open' ? '🟢' : '⚪️'}
      </div>
      <div className="issue-details">
        <span className="issue-title">{issue.title}</span>
        <p className="issue-meta">
          #{issue._id.substring(0, 6)} opened on {new Date(issue.createdAt).toLocaleDateString()} by {issue.author?.username || 'Unknown'}
        </p>
      </div>
      <div className="issue-actions">
        <button onClick={handleEdit} className="button-primary small-button">Edit</button> {/* Use button-primary, maybe small variant */}
        <button onClick={() => onIssueDelete(issue._id)} className="button-danger small-button">Delete</button> {/* Use button-danger */}
      </div>
    </li>
  );
};

export default IssueItem;
