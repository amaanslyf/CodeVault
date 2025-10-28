import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import Chip from '@mui/material/Chip';

const Dashboard = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No user ID found. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [userReposResponse, suggestedReposResponse] = await Promise.all([
          api.get(`/repo/user/${userId}`),
          api.get("/repo/public"),
        ]);

        setRepositories(userReposResponse.data || []);
        setSuggestedRepositories(suggestedReposResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRepositories = repositories.filter((repo) =>
    repo.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Your Repositories
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 2, mb: 3 }}
        />

        {filteredRepositories.length === 0 ? (
          <Alert severity="info">
            No repositories found. Create your first repository!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredRepositories.map((repo) => (
              <Grid item xs={12} sm={6} md={4} key={repo._id}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <FolderIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h3" fontWeight="bold">
                        {repo.name || "Unnamed Repository"}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {repo.description || "No description"}
                    </Typography>
                    <Chip
                      icon={repo.visibility ? <PublicIcon /> : <LockIcon />}
                      label={repo.visibility ? "Public" : "Private"}
                      size="small"
                      color={repo.visibility ? "success" : "default"}
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/repo/${repo._id}`)}
                    >
                      View Repository
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Box mt={6}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
          Suggested Public Repositories
        </Typography>

        {suggestedRepositories.length === 0 ? (
          <Alert severity="info">No public repositories available.</Alert>
        ) : (
          <Grid container spacing={3} mt={1}>
            {suggestedRepositories.map((repo) => (
              <Grid item xs={12} sm={6} md={4} key={repo._id}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <FolderIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h3" fontWeight="bold">
                        {repo.name || "Unnamed Repository"}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {repo.description || "No description"}
                    </Typography>
                    <Chip
                      icon={<PublicIcon />}
                      label="Public"
                      size="small"
                      color="success"
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(`/repo/${repo._id}`)}
                    >
                      View Repository
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
