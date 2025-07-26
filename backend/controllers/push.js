const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const axios = require('axios');
const FormData = require('form-data'); // Used to build multipart/form-data requests

// --- Define paths for local and global configuration ---
const LOCAL_REPO_PATH = path.resolve(process.cwd(), '.codevault');
const LOCAL_CONFIG_FILE = path.join(LOCAL_REPO_PATH, 'config.json');
const COMMITS_PATH = path.join(LOCAL_REPO_PATH, 'commits');
const GLOBAL_CONFIG_FILE = path.join(os.homedir(), '.codevault', 'config.json');

// This is the main function for the 'push' command
async function pushRepo() {
  try {
    // 1. Read local and global config files to get repository ID and auth token
    const { repositoryId } = JSON.parse(await fs.readFile(LOCAL_CONFIG_FILE, 'utf8'));
    const { token } = JSON.parse(await fs.readFile(GLOBAL_CONFIG_FILE, 'utf8'));

    if (!repositoryId || !token) {
      console.error('Error: Repository not initialized or user not logged in. Please run "codevault init" and "codevault login".');
      return;
    }

    // 2. Identify which commits need to be pushed
    // (A simple implementation pushes all local commits. A more advanced version would track the last pushed commit.)
    const commitDirs = await fs.readdir(COMMITS_PATH);
    if (commitDirs.length === 0) {
      console.log('Everything up-to-date. Nothing to push.');
      return;
    }

    console.log(`Pushing ${commitDirs.length} commit(s) to remote...`);

    // 3. Loop through each local commit and push it individually
    for (const commitId of commitDirs) {
      const commitPath = path.join(COMMITS_PATH, commitId);
      const commitDetails = JSON.parse(await fs.readFile(path.join(commitPath, 'commit.json'), 'utf8'));
      
      // Create a new FormData object for each commit
      const formData = new FormData();
      formData.append('commitId', commitDetails.commitID);
      formData.append('message', commitDetails.message);
      formData.append('timestamp', commitDetails.date);

      // 4. Attach all files from the commit to the FormData
      const filesInCommit = await fs.readdir(commitPath);
      for (const fileName of filesInCommit) {
        if (fileName !== 'commit.json') {
          const filePath = path.join(commitPath, fileName);
          const fileContent = await fs.readFile(filePath);
          formData.append('files', fileContent, fileName); // Append file buffer with its name
        }
      }

      // 5. Make the authenticated API call to the backend push endpoint
      process.stdout.write(`  - Pushing commit ${commitId.substring(0, 8)}... `);
      await axios.post(
        `http://localhost:3002/repo/push/${repositoryId}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(), // Important for multipart/form-data
            'Authorization': `Bearer ${token}`
          }
        }
      );
      process.stdout.write('Done\n');

      // (Optional but recommended) After a successful push, you could move the commit
      // from the local 'commits' folder to a 'pushed' folder to prevent re-pushing.
    }

    console.log('✅ Push complete.');

  } catch (error) {
    // Provide more specific error feedback
    if (error.code === 'ENOENT') {
      console.error('Error: Not a CodeVault repository or you are not logged in. Please run "codevault login" and "codevault init".');
    } else {
      console.error('Error pushing changes:', error.response?.data?.message || error.message);
    }
  }
}

module.exports = { pushRepo };
