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

/**
 * @route   GET /api/policies/company/:companyName
 * @desc    Get all policies for a specific company
 * @access  Private
 * @param   {string} companyName - Name of the company
 */
router.get('/company/:companyName', policyController.getCompanyPolicies);

/**
 * @route   GET /api/policies/by-year
 * @desc    Get all policies for a specific renewal year, or the latest year if not provided
 * @access  Private
 * @query   {string} [renewalYear] - Renewal year (optional)
 */
router.get('/by-year', policyController.getPoliciesByYear);

module.exports = router;
