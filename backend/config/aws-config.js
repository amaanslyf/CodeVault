const AWS = require("aws-sdk");
const dotenv = require("dotenv");


dotenv.config(); 

AWS.config.update({ 
    region: process.env.AWS_REGION || "ap-south-1", 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
});


const s3 = new AWS.S3();
const S3_BUCKET = process.env.S3_BUCKET_NAME || "codevaults3"; 


module.exports = { s3, S3_BUCKET };
