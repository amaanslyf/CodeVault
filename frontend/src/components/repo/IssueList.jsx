
import React from 'react';
import IssueItem from './IssueItem'; 
import './IssueList.css'; 


const IssueList = ({ issues, onIssueUpdate, onIssueDelete }) => {
  if (!issues || issues.length === 0) {
    
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
