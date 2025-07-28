// frontend/src/components/repo/FileList.jsx (REPLACE FULL FILE)

import React from 'react';
import './FileList.css';

const FileList = ({ files }) => {
  if (!files || files.length === 0) {
    // MODIFIED: Display a message instead of returning null for better UX
    return (
      <div className="file-list-container">
        <h4>Files in this commit</h4>
        <p className="empty-state-message">No files found for this commit.</p>
      </div>
    );
  }

  return (
    <div className="file-list-container">
      <h4>Files in this commit</h4>
      <ul className="file-list">
        {files.map((file, index) => (
          <li key={index} className="file-item">
            <span className="file-name">{file.fileName}</span>
            {/* The secure URL allows direct download */}
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="download-link">
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
