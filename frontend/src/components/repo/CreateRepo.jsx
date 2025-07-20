import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../authContext";
import { BookIcon } from "@primer/octicons-react";
import { UnderlineNav } from "@primer/react";
import Navbar from "../Navbar";
import "./CreateRepo.css";

const CreateRepo = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: false, // false = private (default), true = public
    content: '',
    issues: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({                  // Spread previous state
      ...prev,
      [name]: value
    }));
  };

  // Special handler for boolean visibility
  const handleVisibilityChange = (isPublic) => {
    setFormData(prev => ({
      ...prev,
      visibility: isPublic // true or false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(
        'http://localhost:3002/repo/create', 
        {
          ...formData,
          owner: userId,
          
        },
        {
          headers: {                            // this headers are set to allow CORS and authentication
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.data?.repository) {
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
      <Navbar />
      

      <div className="create-repo-wrapper">
        <div className="create-repo-container">
          <h1>Create a new repository</h1>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="repo-form">
            {/* Name field */}
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
            
            {/* Description field */}
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
            
            {/* Updated Visibility radio buttons (boolean) */}
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
            
            {/* Content field */}
            <div className="form-group">
              <label htmlFor="content">Initial content (optional)</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="You can add initial content for your repository..."
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading} 
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