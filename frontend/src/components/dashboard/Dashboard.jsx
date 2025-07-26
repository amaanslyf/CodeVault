import React, { useState, useEffect } from "react";
import api from "../../api"; // --- USE API SERVICE ---
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No user ID found");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // --- API CALLS ARE NOW CLEANER ---
        const [userReposResponse, suggestedReposResponse] = await Promise.all([
          api.get(`/repo/user/${userId}`),
          api.get("/repo/all")
        ]);

        setRepositories(Array.isArray(userReposResponse.data) ? userReposResponse.data : []);
        setSuggestedRepositories(Array.isArray(suggestedReposResponse.data) ? suggestedReposResponse.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... (rest of the component is the same, no need to show for brevity) ...
  // But for the user, I'll provide the full file.
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepositories = repositories.filter(repo =>
    repo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRepoClick = (repoId) => {
    navigate(`/repo/viewrepo/${repoId}`);
  };

  if (loading) {
    return (
      <>
        <div className="loading-message">Loading repositories...</div>
      </>
    );
  }

  return (
    <>
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {error ? (
            <div className="error-message">{error}</div>
          ) : suggestedRepositories.length === 0 ? (
            <div>No suggested repositories found</div>
          ) : (
            suggestedRepositories.map(repo => (
              <div
                key={repo._id}
                className="repo-card clickable"
                onClick={() => handleRepoClick(repo._id)}
              >
                <h4>{repo.name || 'Unnamed Repository'}</h4>
                <p>{repo.description || 'No description'}</p>
                <span>Owner: {repo.owner?.username || 'Unknown'}</span>
              </div>
            ))
          )}
        </aside>

        <main>
          <div className="main-header">
            <h2>Your Repositories</h2>
          </div>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search your repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {error ? (
            <div className="error-message">{error}</div>
          ) : filteredRepositories.length === 0 ? (
            <div className="no-repos-message">
              {searchQuery
                ? "No repositories match your search"
                : "You don't have any repositories yet"}
            </div>
          ) : (
            filteredRepositories.map(repo => (
              <div
                key={repo._id}
                className="repo-card clickable"
                onClick={() => handleRepoClick(repo._id)}
              >
                <h4>{repo.name || 'Unnamed Repository'}</h4>
                <p>{repo.description || 'No description'}</p>
              </div>
            ))
          )}
        </main>
      </section>
    </>
  );
};


export default Dashboard;
