const fs = require('fs').promises;
const path = require('path');
const { apiRequest } = require('../api');
const { LOCAL_REPO_PATH, LOCAL_CONFIG_FILE } = require('../config');

async function initRepo() {
  try {
    const repoName = path.basename(process.cwd());

    console.log(`Initializing repository "${repoName}"...`);
    
    const data = await apiRequest('POST', '/repo/create', {
      name: repoName,
      description: '',
      visibility: false
    });

    await fs.mkdir(LOCAL_REPO_PATH, { recursive: true });
    await fs.mkdir(path.join(LOCAL_REPO_PATH, 'staging'), { recursive: true });
    await fs.mkdir(path.join(LOCAL_REPO_PATH, 'commits'), { recursive: true });

    const localConfig = { repositoryId: data.repository._id };
    await fs.writeFile(LOCAL_CONFIG_FILE, JSON.stringify(localConfig, null, 2));

    console.log(`✅ Repository "${repoName}" initialized successfully!`);
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  }
}

module.exports = { initRepo };
