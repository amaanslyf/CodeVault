const fs = require('fs').promises;
const path = require('path');
const { STAGING_PATH } = require('../config');

async function addRepo(filePath) {
  try {
    await fs.mkdir(STAGING_PATH, { recursive: true });

    if (filePath === '.') {
      const filesInCurrentDir = await fs.readdir(process.cwd());
      const filesToStage = filesInCurrentDir.filter(name => name !== '.codevault');

      for (const file of filesToStage) {
        const sourcePath = path.join(process.cwd(), file);
        const destPath = path.join(STAGING_PATH, file);
        const stat = await fs.stat(sourcePath);

        if (stat.isFile()) {
          await fs.copyFile(sourcePath, destPath);
          console.log(`✅ Added: ${file}`);
        }
      }
    } else {
      const sourcePath = path.resolve(process.cwd(), filePath);
      const destPath = path.join(STAGING_PATH, path.basename(filePath));
      await fs.copyFile(sourcePath, destPath);
      console.log(`✅ Added: ${filePath}`);
    }
  } catch (error) {
    console.error('❌ Add failed:', error.message);
    process.exit(1);
  }
}

module.exports = { addRepo };
