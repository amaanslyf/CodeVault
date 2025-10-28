import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './authContext.jsx';
import ProjectRoutes from './Routes.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2ea44f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0366d6',
    },
    error: {
      main: '#d73a49',
    },
    background: {
      default: '#f6f8fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <ProjectRoutes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
