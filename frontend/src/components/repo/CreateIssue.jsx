import React, { useState } from 'react';
import api from '../../api';
import './CreateIssue.css';

const CreateIssue = ({ repoId, onIssueCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post(`/issue/create/${repoId}`, { title, description });
      // Call the parent component's callback function to update the issue list
      onIssueCreated(response.data);
      // Reset the form
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create issue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-issue-container">
      <h3>Submit a New Issue</h3>
      <form onSubmit={handleSubmit} className="create-issue-form">
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Leave a comment (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit new issue'}
        </button>
      </form>
    </div>
  );
};

export default CreateIssue;
