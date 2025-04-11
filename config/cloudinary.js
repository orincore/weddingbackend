const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
console.log('Cloudinary configuration:');
console.log(`- Cloud name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
console.log(`- API key is set: ${!!process.env.CLOUDINARY_API_KEY}`);
console.log(`- API secret is set: ${!!process.env.CLOUDINARY_API_SECRET}`);

module.exports = cloudinary; 