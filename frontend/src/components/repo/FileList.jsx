import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';

const FileList = ({ files }) => {
  if (!files || files.length === 0) {
    return (
      <Alert severity="info">
        No files found for this commit.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Files in this commit
      </Typography>
      <List>
        {files.map((file, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <Link href={file.url} target="_blank" rel="noopener" underline="none">
                <DownloadIcon color="primary" />
              </Link>
            }
            sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary={file.name}
              secondary={`Click download icon to view/download`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FileList;
