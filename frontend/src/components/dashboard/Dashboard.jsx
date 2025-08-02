import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No user ID found. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [userReposResponse, suggestedReposResponse] = await Promise.all([
          api.get(`/repo/user/${userId}`),
          api.get("/repo/public")
        ]);

        setRepositories(Array.isArray(userReposResponse.data) ? userReposResponse.data : []);
        setSuggestedRepositories(Array.isArray(suggestedReposResponse.data) ? suggestedReposResponse.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRepositories = repositories.filter(repo =>
    repo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRepoClick = (repoId) => {
    navigate(`/repo/viewrepo/${repoId}`);
  };

  if (loading) {
    return (
      <div className="page-container"> {/* Use global page container */}
        <div className="loading-message">Loading repositories...</div>
      </div>
    );
  }

  return (
    <div className="page-container"> {/* Use global page container */}
      <section id="dashboard">
        <aside className="dashboard-sidebar">
          <h3>Suggested Repositories</h3>
          {error ? (
            <div className="error-message">{error}</div>
          ) : suggestedRepositories.length === 0 ? (
            <div className="empty-state-message">No suggested repositories found.</div>
          ) : (
            <div className="suggested-repos-list">
              {suggestedRepositories.map(repo => (
                <div
                  key={repo._id}
                  className="repo-card clickable card" 
                  onClick={() => handleRepoClick(repo._id)}
                >
                  <h4 className="repo-card-title">{repo.name || 'Unnamed Repository'}</h4>
                  <p className="repo-card-description">{repo.description || 'No description'}</p>
                  <span className="repo-card-owner">Owner: {repo.owner?.username || 'Unknown'}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        <main className="dashboard-main-content">
          <div className="main-header">
            <h2>Your Repositories</h2>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search your repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field search-input" 
            />
          </div>

          {error ? (
            <div className="error-message">{error}</div>
          ) : filteredRepositories.length === 0 ? (
            <div className="empty-state-message">
              {searchQuery
                ? "No repositories match your search."
                : "You don't have any repositories yet. Start by creating one!"}
            </div>
          ) : (
            <div className="user-repos-grid">
              {filteredRepositories.map(repo => (
                <div
                  key={repo._id}
                  className="repo-card clickable card" 
                  onClick={() => handleRepoClick(repo._id)}
                >
                  <h4 className="repo-card-title">{repo.name || 'Unnamed Repository'}</h4>
                  <p className="repo-card-description">{repo.description || 'No description'}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
