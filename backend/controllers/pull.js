const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const axios = require('axios');

// --- Define paths for local and global configuration ---
const LOCAL_REPO_PATH = path.resolve(process.cwd(), '.codevault');
const LOCAL_CONFIG_FILE = path.join(LOCAL_REPO_PATH, 'config.json');
const COMMITS_PATH = path.join(LOCAL_REPO_PATH, 'commits');
const GLOBAL_CONFIG_FILE = path.join(os.homedir(), '.codevault', 'config.json');

// This is the main function for the 'pull' command
async function pullRepo() {
  try {
    // 1. Read local and global config files to get repository ID and auth token
    const { repositoryId } = JSON.parse(await fs.readFile(LOCAL_CONFIG_FILE, 'utf8'));
    const { token } = JSON.parse(await fs.readFile(GLOBAL_CONFIG_FILE, 'utf8'));

    if (!repositoryId || !token) {
      console.error('Error: Repository not initialized or user not logged in.');
      return;
    }

    console.log('Fetching remote history...');
    // 2. Make an authenticated API call to the backend pull endpoint
    const response = await axios.get(
      `http://localhost:3002/repo/pull/${repositoryId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const remoteCommits = response.data;
    if (remoteCommits.length === 0) {
      console.log('Repository is empty or up-to-date.');
      return;
    }

    console.log(`Found ${remoteCommits.length} commit(s). Downloading files...`);

    // 3. Clear local commits to ensure a fresh sync (a more advanced implementation would merge)
    await fs.rm(COMMITS_PATH, { recursive: true, force: true });
    await fs.mkdir(COMMITS_PATH, { recursive: true });

    // 4. Iterate through each commit from the server's response
    for (const commit of remoteCommits) {
      const commitDir = path.join(COMMITS_PATH, commit.commitId);
      await fs.mkdir(commitDir, { recursive: true });

      // Download each file for the commit using the secure, temporary URL
      for (const file of commit.files) {
        process.stdout.write(`  - Downloading ${file.fileName} for commit ${commit.commitId.substring(0,8)}... `);
        const fileResponse = await axios.get(file.url, { responseType: 'arraybuffer' });
        await fs.writeFile(path.join(commitDir, file.fileName), fileResponse.data);
        process.stdout.write('Done\n');
      }

      // Re-create the local commit.json metadata file
      const commitMetadata = {
        commitID: commit.commitId,
        message: commit.message,
        date: commit.timestamp,
      };
      await fs.writeFile(path.join(commitDir, 'commit.json'), JSON.stringify(commitMetadata, null, 2));
    }

    console.log('✅ Pull complete. Your local repository is now in sync with the remote.');

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('Error: Not a CodeVault repository or you are not logged in.');
    } else {
      console.error('Error pulling changes:', error.response?.data?.message || error.message);
    }
  }
}

module.exports = { pullRepo };
