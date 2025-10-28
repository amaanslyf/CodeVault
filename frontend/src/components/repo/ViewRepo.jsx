import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../authContext';
import CommitHistory from './CommitHistory';
import FileList from './FileList';
import IssueList from './IssueList';
import CreateIssue from './CreateIssue';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewRepo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [repository, setRepository] = useState(null);
  const [commits, setCommits] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isOwner = repository && currentUser === repository.owner?._id;

  const fetchRepoData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch repository details first
      const repoResponse = await api.get(`/repo/viewrepo/${id}`);
      const repoData = repoResponse.data;
      setRepository(repoData);

      // ✅ FIX: Check access - deny ONLY if repo is private AND user is not owner
      if (!repoData.visibility && currentUser !== repoData.owner?._id) {
        setError("This is a private repository. You don't have access.");
        setLoading(false);
        return;
      }

      // If access is granted, fetch commits and issues
      const [commitsResponse, issuesResponse] = await Promise.all([
        api.get(`/repo/pull/${id}`).catch(() => ({ data: { commits: [] } })),
        api.get(`/issue/all/${id}`).catch(() => ({ data: [] })),
      ]);

      setCommits(commitsResponse.data.commits || []);
      setIssues(issuesResponse.data || []);
      
    } catch (err) {
      console.error('Error fetching repository data:', err);
      if (err.response?.status === 404) {
        setError('Repository not found.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view this repository.');
      } else {
        setError(err.response?.data?.message || 'Failed to load repository');
      }
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchRepoData();
  }, [fetchRepoData]);

  const handleDeleteRepository = async () => {
    try {
      await api.delete(`/repo/delete/${id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting repository:', err);
      setError(err.response?.data?.message || 'Failed to delete repository');
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      await api.patch(`/repo/toggle/${id}`);
      setRepository(prev => ({ ...prev, visibility: !prev.visibility }));
    } catch (err) {
      console.error('Error toggling visibility:', err);
      setError(err.response?.data?.message || 'Failed to update visibility');
    }
  };

  const handleIssueCreated = (newIssue) => {
    setIssues(prev => [newIssue, ...prev]);
  };

  const handleIssueUpdate = (updatedIssue) => {
    setIssues(prev => prev.map(issue => 
      issue._id === updatedIssue._id ? updatedIssue : issue
    ));
  };

  const handleIssueDelete = (deletedIssueId) => {
    setIssues(prev => prev.filter(issue => issue._id !== deletedIssueId));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!repository) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Repository not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {repository.name}
              </Typography>
              <Chip
                icon={repository.visibility ? <PublicIcon /> : <LockIcon />}
                label={repository.visibility ? "Public" : "Private"}
                color={repository.visibility ? "success" : "default"}
                size="small"
              />
            </Box>
            <Typography variant="body1" color="text.secondary" mb={1}>
              {repository.description || "No description provided"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Owner: {repository.owner?.username || "Unknown"}
            </Typography>
          </Box>

          {isOwner && (
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                onClick={handleToggleVisibility}
                startIcon={repository.visibility ? <LockIcon /> : <PublicIcon />}
              >
                Make {repository.visibility ? "Private" : "Public"}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<CodeIcon />} label="Code" iconPosition="start" />
          <Tab icon={<BugReportIcon />} label={`Issues (${issues.length})`} iconPosition="start" />
          <Tab icon={<HistoryIcon />} label={`Commits (${commits.length})`} iconPosition="start" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Files
              </Typography>
              {selectedCommit ? (
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedCommit(null)}
                    sx={{ mb: 2 }}
                  >
                    ← Back to Commits
                  </Button>
                  <FileList files={selectedCommit.files} />
                </Box>
              ) : (
                <CommitHistory commits={commits} onCommitSelect={setSelectedCommit} />
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {isOwner && <CreateIssue repoId={id} onIssueCreated={handleIssueCreated} />}
              <IssueList
                issues={issues}
                onIssueUpdate={handleIssueUpdate}
                onIssueDelete={handleIssueDelete}
              />
            </Box>
          )}

          {activeTab === 2 && (
            <CommitHistory commits={commits} onCommitSelect={setSelectedCommit} />
          )}
        </Box>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Repository?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{repository.name}"? This action cannot be undone.
            All commits, files, and issues will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteRepository} color="error" variant="contained">
            Delete Repository
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewRepo;
