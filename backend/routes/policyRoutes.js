const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

/**
 * @route   GET /api/policies/companies
 * @desc    Get list of all companies with optional renewal year filter
 * @access  Private
 * @query   {string} [renewalYear] - Filter companies by renewal year (optional)
 */
router.get('/companies', policyController.getCompanies);

/**
 * @route   GET /api/policies/company-details
 * @desc    Get details for a specific company and renewal year
 * @access  Private
 * @query   {string} companyName - Name of the company
 * @query   {string} renewalYear - Renewal year
 */
router.get('/company-details', policyController.getCompanyDetails);

module.exports = router;
