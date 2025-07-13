const fs = require('fs').promises;
const path = require('path');
const { s3, S3_BUCKET } = require('../config/aws-config');
async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), '.CodeVault');
    const commitsPath = path.join(repoPath, 'commits');
    try {
        const data = await s3.listObjectsV2({ Bucket: S3_BUCKET, Prefix: 'commits/' }).promise(); // List all objects in the 'commits' directory of the S3 bucket
        const objects = data.Contents; // Get the contents of the response
        for (const object of objects) {
            const key = object.Key; // Get the key of the object
            const commitDir = path.join(commitsPath, path.dirname(key).split('/').pop()); // Extract the commit directory name from the key
            await fs.mkdir(commitDir, { recursive: true });
            const params = {
                Bucket: S3_BUCKET,
                Key: key
            };
            const fileContent = await s3.getObject(params).promise(); // Get the object from S3
            await fs.writeFile(path.join(repoPath, key), fileContent.Body); // Write the file to the commit directory
            console.log(`File ${key} pulled from S3 bucket ${S3_BUCKET} to local repository at ${commitDir}`);
        }
    } catch (err) {
        console.error("Error pulling changes from the remote repository:", err);
    }

}
module.exports = { pullRepo };