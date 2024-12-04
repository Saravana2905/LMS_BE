const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'courses', // folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf', 'docx'],
    public_id: (req, file) => file.originalname.split('.')[0], // unique file name based on original name
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
