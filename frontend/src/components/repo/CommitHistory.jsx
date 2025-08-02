
import React from 'react';
import './CommitHistory.css';

const CommitHistory = ({ commits, onCommitSelect }) => {
  if (!commits || commits.length === 0) {
    return (
      // Applied 'card' utility class for consistent styling
      <div className="commit-history-container card">
        <h3>Commit History</h3>
        <p className="empty-state-message">No commits have been pushed to this repository yet.</p>
      </div>
    );
  }

  return (
    // Applied 'card' utility class for consistent styling
    <div className="commit-history-container card">
      <h3>Commit History ({commits.length})</h3>
      <ul className="commit-list">
        {commits.map((commit) => (
          <li key={commit.commitId} className="commit-item" onClick={() => onCommitSelect(commit)}>
            <div className="commit-message">{commit.message}</div>
            <div className="commit-meta">
              <span className="commit-id">{commit.commitId.substring(0, 7)}</span>
              <span>committed on {new Date(commit.timestamp).toLocaleDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitHistory;
