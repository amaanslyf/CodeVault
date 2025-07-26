import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// --- NEW: Import our centralized API service ---
import api from "../../api"; 
import "./CreateRepo.css";

const CreateRepo = () => {
  const navigate = useNavigate();
  // --- MODIFIED: Simplified initial form state ---
  // We only need the fields the user will actually fill out.
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: false, // false = private, true = public
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVisibilityChange = (isPublic) => {
    setFormData(prev => ({
      ...prev,
      visibility: isPublic
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // --- MODIFIED: Use the new `api` instance ---
      // The API call is much cleaner now. The base URL and Authorization header
      // are handled automatically by our api.js service.
      // We also no longer send 'owner', 'content', or 'issues' in the body.
      const response = await api.post('/repo/create', formData);

      // Navigate to the newly created repository's page
      if (response.data?.repository?._id) {
        navigate(`/repo/viewrepo/${response.data.repository._id}`);
      } else {
        // Fallback to dashboard if ID is not available for some reason
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create repository');
      console.error('Repository creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="create-repo-wrapper">
        <div className="create-repo-container">
          <h1>Create a new repository</h1>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="repo-form">
            <div className="form-group">
              <label htmlFor="name">Repository name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter-repository-name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description (optional)</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A short description of your repository"
              />
            </div>
            
            <div className="form-group">
              <label>Visibility</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="visibility"
                    checked={!formData.visibility} // false = private
                    onChange={() => handleVisibilityChange(false)}
                  />
                  Private
                </label>
                <label>
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.visibility} // true = public
                    onChange={() => handleVisibilityChange(true)}
                  />
                  Public
                </label>
              </div>
            </div>
            
            {/* --- REMOVED: The initial content textarea is no longer needed --- */}
            
            <button 
              type="submit" 
              disabled={isLoading || !formData.name} // Disable if loading or no name
              className="create-repo-btn"
            >
              {isLoading ? 'Creating repository...' : 'Create repository'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;
