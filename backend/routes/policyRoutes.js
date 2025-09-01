const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

/**
 * @route   GET /api/policies/company-details
 * @desc    Get details for a specific company and renewal year
 * @access  Private
 * @query   {string} companyName - Name of the company
 * @query   {string} renewalYear - Renewal year
 */
router.get('/company-details', policyController.getCompanyDetails);

module.exports = router;
