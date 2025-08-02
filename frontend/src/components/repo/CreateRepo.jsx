
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./CreateRepo.css";

const CreateRepo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: false, // false = private, true = public
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState(''); 

  const validateName = (name) => {
    if (!name.trim()) {
      return "Repository name cannot be empty.";
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      return "Name can only contain letters, numbers, dashes, and underscores.";
    }
    if (name.length < 3) {
      return "Name must be at least 3 characters long.";
    }
    if (name.length > 100) { 
      return "Name cannot exceed 100 characters.";
    }
    return ''; 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear name-specific error when user starts typing again
    if (name === 'name' && nameError) {
      setNameError('');
    }
  };

  const handleVisibilityChange = (isPublic) => {
    setFormData(prev => ({
      ...prev,
      visibility: isPublic
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameValidationError = validateName(formData.name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    setIsLoading(true);
    setError(''); // Clear general error
    setNameError(''); // Clear specific error

    try {
      const response = await api.post('/repo/create', formData);

      if (response.data?.repository?._id) {
        navigate(`/repo/viewrepo/${response.data.repository._id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create repository';
      if (errorMessage.includes('A repository with this name already exists')) {
        setNameError(errorMessage);
      } else {
        setError(errorMessage);
      }
      console.error('Repository creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-repo-wrapper">
      <div className="create-repo-container">
        <h1>Create a new repository</h1>
        
        {/* General error message at the top if not specific to a field */}
        {error && <div className="error-message general-error">{error}</div>}

        <form onSubmit={handleSubmit} className="repo-form">
          <div className="form-group">
            <label htmlFor="name">Repository name<span className="required-star">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., my-awesome-project"
              className={nameError ? 'input-error' : ''} 
            />
            {nameError && <p className="input-error-message">{nameError}</p>} {/* Display name-specific error */}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="A short description of your repository"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Visibility</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="visibility"
                  checked={!formData.visibility} // false = private
                  onChange={() => handleVisibilityChange(false)}
                />
                Private
                <span className="radio-description">Only you can see this repository.</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="visibility"
                  checked={formData.visibility} // true = public
                  onChange={() => handleVisibilityChange(true)}
                />
                Public
                <span className="radio-description">Anyone can see this repository.</span>
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading || !formData.name.trim() || nameError} 
            className="create-repo-btn"
          >
            {isLoading ? 'Creating repository...' : 'Create repository'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRepo;
