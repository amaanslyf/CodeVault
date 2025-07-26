import React from 'react';
import './IssueList.css';

const IssueList = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return <p>No issues have been created for this repository yet.</p>;
  }

  return (
    <ul className="issue-list">
      {issues.map((issue) => (
        <li key={issue._id} className="issue-item">
          <div className="issue-status-icon">
            {issue.status === 'open' ? '🟢' : '⚪️'}
          </div>
          <div className="issue-details">
            <span className="issue-title">{issue.title}</span>
            <p className="issue-meta">
              #{issue._id.substring(0, 6)} opened on {new Date(issue.createdAt).toLocaleDateString()} by {issue.author?.username || 'Unknown'}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default IssueList;
