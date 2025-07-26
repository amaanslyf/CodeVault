import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import CommitHistory from './CommitHistory';
import FileList from './FileList';
import IssueList from './IssueList'; // --- IMPORT NEW COMPONENT ---
import CreateIssue from './CreateIssue'; // --- IMPORT NEW COMPONENT ---
import { UnderlineNav } from '@primer/react'; // For the tabs
import './ViewRepo.css';

const ViewRepo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [repository, setRepository] = useState(null);
  const [commits, setCommits] = useState([]);
  const [issues, setIssues] = useState([]); // --- NEW: State for issues ---
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [activeTab, setActiveTab] = useState('Code'); // --- NEW: State for tabs ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING ---
  const fetchRepoData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [repoDetailsResponse, repoCommitsResponse, repoIssuesResponse] = await Promise.all([
        api.get(`/repo/viewrepo/${id}`),
        api.get(`/repo/pull/${id}`),
        api.get(`/issue/all/${id}`) // --- NEW: Fetch issues for the repo ---
      ]);

      setRepository(repoDetailsResponse.data);
      setIssues(repoIssuesResponse.data);

      const sortedCommits = repoCommitsResponse.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setCommits(sortedCommits);

      if (sortedCommits.length > 0) {
        setSelectedCommit(sortedCommits[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load repository details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRepoData();
  }, [fetchRepoData]);

  // --- HANDLERS ---
  const handleCommitSelect = (commit) => setSelectedCommit(commit);

  // --- NEW: Callback to add a new issue to the list without a full page reload ---
  const handleIssueCreated = (newIssue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
  };

  const handleDeleteRepository = async () => {
    if (window.confirm('Are you sure you want to delete this repository?')) {
      try {
        await api.delete(`/repo/delete/${id}`);
        navigate('/');
      } catch (err) {
        alert(`Failed to delete repository: ${err.response?.data?.message}`);
      }
    }
  };

  // --- RENDER LOGIC ---
  if (loading) return <><div className="loading">Loading repository...</div></>;
  if (error) return <><div className="error">Error: {error}</div></>;
  if (!repository) return <><div className="not-found">Repository not found</div></>;

  return (
    <>
      <div className="repository-details">
        <div className="repo-header">
          <h1>{repository.name}</h1>
          <span className="visibility-badge">{repository.visibility ? 'Public' : 'Private'}</span>
        </div>
        <p className="owner">Owner: {repository.owner?.username || 'Unknown'}</p>
        
        {/* --- NEW: Tab Navigation --- */}
        <UnderlineNav aria-label="Repository Views">
          <UnderlineNav.Link href="#" selected={activeTab === 'Code'} onSelect={() => setActiveTab('Code')}>
            Code
          </UnderlineNav.Link>
          <UnderlineNav.Link href="#" selected={activeTab === 'Issues'} onSelect={() => setActiveTab('Issues')}>
            Issues ({issues.length})
          </UnderlineNav.Link>
          <UnderlineNav.Link href="#" selected={activeTab === 'Settings'} onSelect={() => setActiveTab('Settings')}>
            Settings
          </UnderlineNav.Link>
        </UnderlineNav>

        {/* --- Conditional Rendering Based on Active Tab --- */}
        {activeTab === 'Code' && (
          <div className="repo-content-layout">
            <div className="files-view">
              <h2>Files</h2>
              <p>Showing files from commit: <strong>{selectedCommit ? selectedCommit.message : 'None'}</strong></p>
              <FileList files={selectedCommit?.files} />
            </div>
            <div className="history-view">
              <CommitHistory commits={commits} onCommitSelect={handleCommitSelect} />
            </div>
          </div>
        )}

        {activeTab === 'Issues' && (
          <div className="issues-tab-content">
            <CreateIssue repoId={id} onIssueCreated={handleIssueCreated} />
            <hr />
            <IssueList issues={issues} />
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="repo-settings">
            <h3>Repository Settings</h3>
            <button onClick={handleDeleteRepository} className="action-button delete-button">
              Delete This Repository
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewRepo;
