const fs = require('fs').promises;
const path = require('path');
const { COMMITS_PATH } = require('../config');

async function revertRepo(commitID) {
  try {
    const commitDir = path.join(COMMITS_PATH, commitID);

    try {
      await fs.access(commitDir);
    } catch (err) {
      console.error(`❌ Commit ID "${commitID}" not found locally.`);
      return;
    }

    const commitMetadata = JSON.parse(
      await fs.readFile(path.join(commitDir, 'commit.json'), 'utf8')
    );

    const filesToRevert = commitMetadata.files;
    if (!filesToRevert || filesToRevert.length === 0) {
      console.log(`Commit ${commitID} has no tracked files to revert.`);
      return;
    }

    console.log(`🔄 Reverting to commit ${commitID.substring(0, 8)}...`);

    for (const fileName of filesToRevert) {
      const srcPath = path.join(commitDir, fileName);
      const destPath = path.join(process.cwd(), fileName);
      await fs.copyFile(srcPath, destPath);
      console.log(`✅ Reverted: ${fileName}`);
    }

    console.log('✅ Revert complete!');
  } catch (error) {
    console.error('❌ Revert failed:', error.message);
    process.exit(1);
  }
}

module.exports = { revertRepo };
