

const fs = require('fs').promises; // Importing the file system module to handle file operations asynchronously
const path = require('path');

async function addRepo(filePath) {
    // --- FIX: Ensure consistency with init.js for the local repo folder name ---
    const repoPath = path.resolve(process.cwd(), '.codevault');
    const stagingPath = path.join(repoPath, 'staging'); // Path to the staging area inside the repository

    try {
        await fs.mkdir(stagingPath, { recursive: true }); // Create the staging area directory if it doesn't exist

        // Handle adding all files if '.' is provided
        if (filePath === '.') {
            const filesInCurrentDir = await fs.readdir(process.cwd());
            // Filter out the .codevault directory itself
            const filesToStage = filesInCurrentDir.filter(name => name !== '.codevault');

            for (const file of filesToStage) {
                const sourcePath = path.join(process.cwd(), file);
                const destPath = path.join(stagingPath, file);
                // Check if it's a file before copying (avoid copying subdirectories)
                const stat = await fs.stat(sourcePath);
                if (stat.isFile()) {
                    await fs.copyFile(sourcePath, destPath);
                    console.log(`File ${file} added to staging area`);
                } else {
                    console.log(`Skipping directory: ${file}`);
                }
            }
            console.log('✅ All eligible files added to staging area.');
        } else {
            // Handle adding a single specified file
            const sourcePath = path.resolve(process.cwd(), filePath);
            const fileName = path.basename(filePath); // Get the base name of the file to be added
            const destPath = path.join(stagingPath, fileName);

            // Check if the file exists before copying
            try {
                await fs.access(sourcePath);
            } catch (error) {
                console.error(`Error: File "${filePath}" not found.`);
                return;
            }
            
            await fs.copyFile(sourcePath, destPath); // Copy the file to the staging area
            console.log(`✅ File ${fileName} added to staging area`);
        }
    } catch (err) {
        console.error("Error adding file to staging area:", err.message); // Log any errors that occur during the file addition
    }
}
module.exports = { addRepo };
