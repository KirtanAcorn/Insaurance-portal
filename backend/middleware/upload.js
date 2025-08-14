const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Using the SharePoint folder path for document storage
    const sharepointPath = 'C:\\Users\\Priyal.Makwana\\Acorn Solution\\IT - PRIYAL MAKWANA\\Documents\\InsurancePortalDocuments';
    cb(null, sharepointPath);
  },
  filename: function (req, file, cb) {
    // Create a sanitized filename with timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, uniqueSuffix + '-' + sanitizedOriginalName);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
