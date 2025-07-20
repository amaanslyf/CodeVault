import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [loading, setLoading] = useState({
    userRepos: true,
    suggestedRepos: true
  });
  const [error, setError] = useState({
    userRepos: null,
    suggestedRepos: null
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError(prev => ({...prev, userRepos: "No user ID found"}));
      setLoading(prev => ({...prev, userRepos: false}));
      return;
    }

    // Fetch user repositories
    const fetchUserRepositories = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/repo/${userId}`);
        setRepositories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching user repositories:", err);
        setError(prev => ({...prev, userRepos: err.message}));
        setRepositories([]);
      } finally {
        setLoading(prev => ({...prev, userRepos: false}));
      }
    };

    // Fetch suggested repositories
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await axios.get("http://localhost:3002/repo/all");
        setSuggestedRepositories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching suggested repositories:", err);
        setError(prev => ({...prev, suggestedRepos: err.message}));
        setSuggestedRepositories([]);
      } finally {
        setLoading(prev => ({...prev, suggestedRepos: false}));
      }
    };

    fetchUserRepositories();
    fetchSuggestedRepositories();
  }, []);

  // Filter repositories based on search query
  const filteredRepositories = repositories.filter(repo =>
    repo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading.userRepos || loading.suggestedRepos) {
    return (
      <>
        <Navbar />
        <div className="loading-message">Loading repositories...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {error.suggestedRepos ? (
            <div className="error-message">{error.suggestedRepos}</div>
          ) : suggestedRepositories.length === 0 ? (
            <div>No suggested repositories found</div>
          ) : (
            suggestedRepositories.map(repo => (
              <div key={repo._id}>
                <h4>{repo.name || 'Unnamed Repository'}</h4>
                <p>{repo.description || 'No description'}</p>
              </div>
            ))
          )}
        </aside>

        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {error.userRepos ? (
            <div className="error-message">{error.userRepos}</div>
          ) : filteredRepositories.length === 0 ? (
            <div>
              {searchQuery 
                ? "No repositories match your search"
                : "You don't have any repositories yet"}
            </div>
          ) : (
            filteredRepositories.map(repo => (
              <div key={repo._id}>
                <h4>{repo.name || 'Unnamed Repository'}</h4>
                <p>{repo.description || 'No description'}</p>
              </div>
            ))
          )}
        </main>

        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li><p>Tech Conference - Dec 15</p></li>
            <li><p>Developer Meetup - Dec 25</p></li>
            <li><p>React Summit - Jan 5</p></li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;