import React from 'react';
import IssueItem from './IssueItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

const IssueList = ({ issues, onIssueUpdate, onIssueDelete }) => {
  if (!issues || issues.length === 0) {
    return (
      <Alert severity="info">
        No issues have been created for this repository yet.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
        Issues
      </Typography>
      {issues.map((issue) => (
        <IssueItem
          key={issue._id}
          issue={issue}
          onIssueUpdate={onIssueUpdate}
          onIssueDelete={onIssueDelete}
        />
      ))}
    </Box>
  );
};

export default IssueList;
