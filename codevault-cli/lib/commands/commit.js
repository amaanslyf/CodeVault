const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { LOCAL_REPO_PATH, STAGING_PATH, COMMITS_PATH } = require('../config');

async function commitRepo(message) {
  try {
    const commitID = uuidv4();
    const commitDir = path.join(COMMITS_PATH, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    let filesToCommit = [];
    try {
      filesToCommit = await fs.readdir(STAGING_PATH);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('❌ No changes to commit: Staging area is empty.');
        return;
      }
      throw err;
    }

    if (filesToCommit.length === 0) {
      console.log('❌ No changes to commit: Staging area is empty.');
      return;
    }

    const committedFilesManifest = [];
    for (const file of filesToCommit) {
      const sourceFilePath = path.join(STAGING_PATH, file);
      const destFilePath = path.join(commitDir, file);
      await fs.copyFile(sourceFilePath, destFilePath);
      committedFilesManifest.push(file);
    }

    const commitMetadata = {
      commitId: commitID,
      message: message || 'No message',
      timestamp: new Date().toISOString(),
      files: committedFilesManifest
    };

    await fs.writeFile(
      path.join(commitDir, 'commit.json'),
      JSON.stringify(commitMetadata, null, 2)
    );

    await fs.writeFile(path.join(LOCAL_REPO_PATH, 'HEAD'), commitID);

    // Clear staging area
    for (const file of filesToCommit) {
      await fs.unlink(path.join(STAGING_PATH, file));
    }

    console.log(`✅ Commit created: ${commitID.substring(0, 8)}`);
    console.log(`   Message: ${message}`);
  } catch (error) {
    console.error('❌ Commit failed:', error.message);
    process.exit(1);
  }
}

module.exports = { commitRepo };
