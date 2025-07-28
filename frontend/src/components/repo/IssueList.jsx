// frontend/src/components/repo/IssueList.jsx (REPLACE FULL FILE)

import React from 'react';
import IssueItem from './IssueItem'; // Import the new component
import './IssueList.css'; // Keep the list-level styles


const IssueList = ({ issues, onIssueUpdate, onIssueDelete }) => {
  if (!issues || issues.length === 0) {
    // MODIFIED: Use the global empty-state-message class
    return <p className="empty-state-message">No issues have been created for this repository yet.</p>;
  }

  return (
    <ul className="issue-list">
      {issues.map((issue) => (
        <IssueItem
          key={issue._id}
          issue={issue}
          onIssueUpdate={onIssueUpdate}
          onIssueDelete={onIssueDelete}
        />
      ))}
    </ul>
  );
};

export default IssueList;
