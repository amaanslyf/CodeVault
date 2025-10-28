import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CommitIcon from '@mui/icons-material/Commit';

const CommitHistory = ({ commits, onCommitSelect }) => {
  if (!commits || commits.length === 0) {
    return (
      <Alert severity="info">
        No commits have been pushed to this repository yet.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Commit History
      </Typography>
      <List>
        {commits.map((commit) => (
          <ListItem key={commit.commitId} disablePadding>
            <ListItemButton onClick={() => onCommitSelect(commit)} sx={{ borderRadius: 1, mb: 1 }}>
              <CommitIcon sx={{ mr: 2, color: 'primary.main' }} />
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight="medium">
                    {commit.message || 'No commit message'}
                  </Typography>
                }
                secondary={
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Chip
                      label={commit.commitId.substring(0, 8)}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      by {commit.author?.username || 'Unknown'} • {new Date(commit.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CommitHistory;
