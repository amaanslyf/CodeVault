const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const axios = require('axios');

// Path to the global config file to get the token
const GLOBAL_CONFIG_FILE = path.join(os.homedir(), '.codevault', 'config.json');
// Path for the new local repository's config
const LOCAL_REPO_PATH = path.resolve(process.cwd(), '.codevault');
const LOCAL_CONFIG_FILE = path.join(LOCAL_REPO_PATH, 'config.json');

async function initRepo() {
  try {
    const repoName = path.basename(process.cwd()); // Use current directory name as repo name

    // 1. Read the saved authentication token from the global config file
    let globalConfig;
    try {
      const configData = await fs.readFile(GLOBAL_CONFIG_FILE, 'utf8');
      globalConfig = JSON.parse(configData);
    } catch (e) {
      console.error('Error: You are not logged in. Please run "codevault login" first.');
      return;
    }

    if (!globalConfig.token) {
      console.error('Error: Authentication token not found. Please run "codevault login" first.');
      return;
    }

    // 2. Make an authenticated API call to the backend to create the repository
    console.log(`Initializing repository "${repoName}" on CodeVault...`);
    const response = await axios.post(
      'http://localhost:3002/repo/create',
      { name: repoName, description: 'Initialized from CLI' }, // Body of the request
      { headers: { Authorization: `Bearer ${globalConfig.token}` } } // Auth header
    );

    const { repository } = response.data;
    if (!repository || !repository._id) {
      console.error('Failed to initialize repository on the server.');
      return;
    }

    // 3. Create the local .codevault directory and config file
    await fs.mkdir(LOCAL_REPO_PATH, { recursive: true });
    
    // 4. Write the new repository's ID into the local config file
    // This links the local folder to the remote repository
    const localConfig = { repositoryId: repository._id };
    await fs.writeFile(LOCAL_CONFIG_FILE, JSON.stringify(localConfig, null, 2));

    console.log(`✅ Repository "${repoName}" initialized successfully.`);
    console.log(`   Local directory is now linked to remote repository ID: ${repository._id}`);

  } catch (error) {
    console.error('Error initializing repository:', error.response?.data?.message || error.message);
  }
}

module.exports = { initRepo };
