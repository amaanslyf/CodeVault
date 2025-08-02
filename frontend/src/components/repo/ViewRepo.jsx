import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../authContext';
import CommitHistory from './CommitHistory';
import FileList from './FileList';
import IssueList from './IssueList';
import CreateIssue from './CreateIssue';
import './ViewRepo.css';

const ViewRepo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [repository, setRepository] = useState(null);
  const [commits, setCommits] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [activeTab, setActiveTab] = useState('Code');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = repository && currentUser === repository.owner?._id;

  const fetchRepoData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [repoDetailsResponse, repoCommitsResponse, repoIssuesResponse] = await Promise.all([
        api.get(`/repo/viewrepo/${id}`),
        api.get(`/repo/pull/${id}`),
        api.get(`/issue/all/${id}`)
      ]);
      setRepository(repoDetailsResponse.data);
      setIssues(repoIssuesResponse.data);
      const sortedCommits = repoCommitsResponse.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setCommits(sortedCommits);
      if (sortedCommits.length > 0) {
        setSelectedCommit(sortedCommits[0]);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Repository not found. It may have been deleted.');
      } else if (err.response?.status === 403) {
        setError('Access Denied. You do not have permission to view this private repository.');
      } else {
        setError('An error occurred while fetching repository data.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRepoData();
  }, [fetchRepoData]);

  const handleCommitSelect = (commit) => setSelectedCommit(commit);

  const handleIssueCreated = (newIssue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
  };
  
  const handleToggleVisibility = async () => {
    try {
      const response = await api.patch(`/repo/toggle/${id}`);
      setRepository(response.data.repository);
      console.log(`Repository visibility successfully changed to ${response.data.repository.visibility ? 'Public' : 'Private'}.`);
    } catch (err) {
      alert(`Error updating visibility: ${err.response?.data?.message || 'An unknown error occurred'}`);
    }
  };
  
  const handleDeleteRepository = async () => {
    if (window.confirm('Are you sure you want to delete this repository? This action cannot be undone.')) {
      try {
        await api.delete(`/repo/delete/${id}`);
        console.log('Repository deleted successfully.');
        navigate('/');
      } catch (err) {
        alert(`Failed to delete repository: ${err.response?.data?.message}`);
      }
    }
  };

  const handleIssueUpdate = async (issueId, updateData) => {
    try {
      const response = await api.put(`/issue/update/${issueId}`, updateData);
      setIssues(prevIssues => prevIssues.map(issue => 
        issue._id === issueId ? response.data : issue
      ));
    } catch (err) {
      alert(`Failed to update issue: ${err.response?.data?.message || 'An error occurred'}`);
    }
  };

  const handleIssueDelete = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await api.delete(`/issue/delete/${issueId}`);
        setIssues(prevIssues => prevIssues.filter(issue => issue._id !== issueId));
        console.log('Issue deleted successfully.');
      } catch (err) {
        alert(`Failed to delete issue: ${err.response?.data?.message || 'An error occurred'}`);
      }
    }
  };

  if (loading) return <div className="loading-message">Loading repository...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!repository) return <div className="not-found-message">Repository not found</div>; // Changed class name

  return (
    <div className="page-container repository-details-page"> {/* Applied global page-container */}
      <div className="repo-header">
        <h1>{repository.name}</h1>
        <span className={`visibility-badge ${repository.visibility ? 'public' : 'private'}`}>
          {repository.visibility ? 'Public' : 'Private'}
        </span>
      </div>
      <p className="repo-owner-info">Owner: {repository.owner?.username || 'Unknown'}</p>

      <div className="repo-tabs">
        <button className={`tab-button ${activeTab === 'Code' ? 'active' : ''}`} onClick={() => setActiveTab('Code')}>
          Code
        </button>
        <button className={`tab-button ${activeTab === 'Issues' ? 'active' : ''}`} onClick={() => setActiveTab('Issues')}>
          Issues ({issues.length})
        </button>
        {isOwner && (
          <button className={`tab-button ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => setActiveTab('Settings')}>
            Settings
          </button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === 'Code' && (
          <div className="repo-content-layout">
            <div className="files-view card"> {/* Applied card utility class */}
              <h2>Files</h2>
              <p className="sub-heading">Showing files from commit: <strong>{selectedCommit ? selectedCommit.message : 'None'}</strong></p>
              <FileList files={selectedCommit?.files} />
            </div>
            <div className="history-view card"> {/* Applied card utility class */}
              <h2>Commit History</h2>
              <CommitHistory commits={commits} onCommitSelect={handleCommitSelect} />
            </div>
          </div>
        )}

        {activeTab === 'Issues' && (
          <div className="issues-tab-content card"> {/* Applied card utility class */}
            <CreateIssue repoId={id} onIssueCreated={handleIssueCreated} />
            <hr className="divider" /> {/* Added a class for styling */}
            <IssueList 
              issues={issues} 
              onIssueUpdate={handleIssueUpdate} 
              onIssueDelete={handleIssueDelete} 
            />
          </div>
        )}

        {activeTab === 'Settings' && isOwner && (
          <div className="repo-settings card"> {/* Applied card utility class */}
            <h3>General Settings</h3>
            <div className="settings-section">
              <h4>Change Visibility</h4>
              <p>This repository is currently <strong className="current-visibility">{repository.visibility ? 'Public' : 'Private'}</strong>.</p>
              <p className="settings-description">
                {repository.visibility ? 'Private repositories can only be seen by you.' : 'Public repositories can be seen by anyone.'}
              </p>
              <button onClick={handleToggleVisibility} className="button-primary"> {/* Used global button class */}
                Make {repository.visibility ? 'Private' : 'Public'}
              </button>
            </div>
            <hr className="settings-divider" />
            <div className="settings-section danger-zone">
              <h4>Danger Zone</h4>
              <p className="settings-description">These actions are irreversible. Please be certain.</p>
              <button onClick={handleDeleteRepository} className="button-danger"> {/* Used global button class */}
                Delete This Repository
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRepo;
