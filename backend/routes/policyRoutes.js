const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

// Input validation middleware
const validateCompanyParams = (req, res, next) => {
  const { companyName, renewalYear } = req.query;
  
  if (!companyName || !renewalYear) {
    return res.status(400).json({ 
      error: 'Both companyName and renewalYear query parameters are required' 
    });
  }
  
  next();
};

// Error handling middleware
const handleErrors = (err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

/**
 * @route   GET /api/policies/summary
 * @desc    Get policy summary statistics
 * @access  Private
 */
router.get('/summary', policyController.getPolicySummary);

/**
 * @route   GET /api/policies/companies
 * @desc    Get list of all companies with optional year filter
 * @query   {string} [renewalYear] - Filter companies by renewal year
 * @access  Private
 */
router.get('/companies', policyController.getCompanies);

/**
 * @route   GET /api/policies/company/:id
 * @desc    Get company details by ID
 * @param   {string} id - Company ID
 * @access  Private
 */
router.get('/company/:id', policyController.getCompanyById);

/**
 * @route   GET /api/policies/company-details
 * @desc    Get detailed policy information for a company by name and year
 * @query   {string} companyName - Name of the company
 * @query   {string} renewalYear - Renewal year
 * @access  Private
 */
router.get('/company-details', validateCompanyParams, policyController.getCompanyDetails);

/**
 * @route   GET /api/policies/company/:companyId/year/:year
 * @desc    Get all policies for a specific company and year
 * @param   {string} companyId - Company ID
 * @param   {string} year - Policy year (or 'all' for all years)
 * @access  Private
 */
router.get('/company/:companyId/year/:year', policyController.getPoliciesByCompanyAndYear);

// Apply error handling middleware
router.use(handleErrors);

module.exports = router;
