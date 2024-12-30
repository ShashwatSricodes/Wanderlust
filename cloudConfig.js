// Import Cloudinary SDK and Multer storage for Cloudinary
const cloudinary = require('cloudinary').v2;  // Access the Cloudinary API using v2 version
const { CloudinaryStorage } = require('multer-storage-cloudinary');  // Import the Cloudinary storage engine for Multer

// Configure Cloudinary with your credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,    // Cloudinary account cloud name
    api_key: process.env.CLOUD_API_KEY,    // API key for authenticating with Cloudinary
    api_secret: process.env.CLOUD_API_SECRET  // API secret key for authentication
});

// Set up the storage configuration for Multer using CloudinaryStorage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,  // Pass the configured Cloudinary instance
    params: {
        folder: 'wanderlust_DEV',  // Specify the folder in Cloudinary where files will be uploaded
        allowed_formats: ['jpeg', 'png', 'jpg'],  // Restrict uploads to only these file formats
    },
});

// Export both the Cloudinary instance and the storage configuration for use in other parts of the application
module.exports = {
    cloudinary,  // Export the Cloudinary instance to interact with Cloudinary (e.g., delete images)
    storage,  // Export the Multer storage configuration to handle file uploads
};
