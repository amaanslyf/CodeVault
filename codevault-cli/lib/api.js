const axios = require('axios');
const { API_URL, GLOBAL_CONFIG_FILE } = require('./config');
const fs = require('fs').promises;

async function getAuthToken() {
  try {
    const configData = await fs.readFile(GLOBAL_CONFIG_FILE, 'utf8');
    const config = JSON.parse(configData);
    return config.token;
  } catch (error) {
    throw new Error('Not logged in. Please run "codevault login" first.');
  }
}

async function apiRequest(method, endpoint, data = null, headers = {}) {
  try {
    const token = await getAuthToken();
    
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'API request failed');
    }
    throw error;
  }
}

async function apiLogin(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw error;
  }
}

module.exports = {
  getAuthToken,
  apiRequest,
  apiLogin
};
