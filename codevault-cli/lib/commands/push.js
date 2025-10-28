const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { API_URL, LOCAL_CONFIG_FILE, COMMITS_PATH, GLOBAL_CONFIG_FILE } = require('../config');

async function pushRepo() {
  try {
    const { repositoryId } = JSON.parse(await fs.readFile(LOCAL_CONFIG_FILE, 'utf8'));
    const { token } = JSON.parse(await fs.readFile(GLOBAL_CONFIG_FILE, 'utf8'));

    const commits = await fs.readdir(COMMITS_PATH);

    if (commits.length === 0) {
      console.log('❌ No commits to push.');
      return;
    }

    console.log(`📤 Pushing ${commits.length} commit(s)...`);

    for (const commitId of commits) {
      const commitDir = path.join(COMMITS_PATH, commitId);
      const metadataPath = path.join(commitDir, 'commit.json');
      const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));

      const form = new FormData();
      form.append('commitId', metadata.commitId);
      form.append('message', metadata.message);
      form.append('timestamp', metadata.timestamp);

      for (const fileName of metadata.files) {
        const filePath = path.join(commitDir, fileName);
        form.append('files', await fs.readFile(filePath), fileName);
      }

      try {
        await axios.post(`${API_URL}/repo/push/${repositoryId}`, form, {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(`✅ Pushed: ${commitId.substring(0, 8)} - ${metadata.message}`);

        // Delete local commit after successful push
        await fs.rm(commitDir, { recursive: true });
      } catch (error) {
        if (error.response?.data?.duplicate) {
          console.log(`⏭️  Skipped (duplicate): ${commitId.substring(0, 8)}`);
          await fs.rm(commitDir, { recursive: true });
        } else {
          throw error;
        }
      }
    }

    console.log('✅ Push complete!');
  } catch (error) {
    console.error('❌ Push failed:', error.message);
    process.exit(1);
  }
}

module.exports = { pushRepo };
