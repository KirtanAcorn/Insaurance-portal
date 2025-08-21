const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const claimsController = require('../controllers/claimsController');

// Get all claims
router.get('/', claimsController.getAllClaims);

// Get claim by ID
router.get('/:claimId', claimsController.getClaimById);

// Create new claim (with file upload)
router.post('/', upload.single('supportingDocuments'), claimsController.createClaim);

// Update claim
router.post('/:claimId', upload.single('supportingDocuments'), claimsController.updateClaim);

// Delete claim
// router.delete('/:claimId', claimsController.deleteClaim);

module.exports = router;
