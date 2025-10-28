const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { apiRequest } = require('../api');
const { LOCAL_CONFIG_FILE, COMMITS_PATH } = require('../config');

async function pullRepo() {
  try {
    const { repositoryId } = JSON.parse(await fs.readFile(LOCAL_CONFIG_FILE, 'utf8'));

    console.log('📥 Pulling commits from remote...');
    
    const data = await apiRequest('GET', `/repo/pull/${repositoryId}`);
    const commits = data.commits || [];

    if (commits.length === 0) {
      console.log('✅ Already up to date.');
      return;
    }

    for (const commit of commits) {
      const commitDir = path.join(COMMITS_PATH, commit.commitId);
      await fs.mkdir(commitDir, { recursive: true });

      for (const file of commit.files) {
        const response = await axios.get(file.url, { responseType: 'arraybuffer' });
        await fs.writeFile(path.join(commitDir, file.name), response.data);
      }

      const commitMetadata = {
        commitId: commit.commitId,
        message: commit.message,
        timestamp: commit.timestamp,
        files: commit.files.map(f => f.name)
      };

      await fs.writeFile(
        path.join(commitDir, 'commit.json'),
        JSON.stringify(commitMetadata, null, 2)
      );

      console.log(`✅ Pulled: ${commit.commitId.substring(0, 8)} - ${commit.message}`);
    }

    console.log('✅ Pull complete!');
  } catch (error) {
    console.error('❌ Pull failed:', error.message);
    process.exit(1);
  }
}

module.exports = { pullRepo };
