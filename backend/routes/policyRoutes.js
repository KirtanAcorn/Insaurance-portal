const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../db');
// @route   GET api/policies
// @desc    Get policy data for a company and year
// @access  Private
router.get('/', async (req, res) => {
  const { companyName, year } = req.query;
  
  if (!companyName || !year) {
    return res.status(400).json({ msg: 'Company Name and year are required' });
  }

  try {
    console.log('Attempting to connect to database...');
    const pool = await poolPromise;
    if (!pool) {
      console.error('Database connection pool is not available');
      return res.status(500).json({ msg: 'Database connection failed' });
    }
    console.log('Database connection successful');
    const request = pool.request();
    console.log('Creating SQL query with parameters:', { companyName, year });
    
    const query = `
      SELECT TOP 1
        [Id] as id,
        [Company Name] as companyName,
        [Country],
        [Reg Address] as regAddress,
        [Warehouse/Office Address/es] as warehouseAddress,
        [Reg No] as regNo,
        [Reg Date] as regDate,
        [Director/Owner Name] as directorName,
        [Company Handle By] as handledBy,
        [VAT Number] as vatNumber,
        [Commercial Policy] as commercialPolicy,
        [Commercial Renewal Date] as commercialRenewalDate,
        [Commercial Policy Link] as commercialPolicyLink,
        [Commercial Premium Paid] as commercialPremiumPaid,
        [Employee Liability Cover] as employeeLiabilityCover,
        [Stock Cover] as stockCover,
        [Product Liability] as productLiability,
        [Commercial Excess Per claim] as commercialExcessPerClaim,
        [No Of claim Commercial] as commercialClaimsCount,
        [Marine] as marinePolicyNumber,
        [Marine Policy Link] as marinePolicyLink,
        [Marine Renewal] as marineRenewalDate,
        [Marine Premium Paid] as marinePremiumPaid,
        [Per Transit Cover] as perTransitCover,
        [CROSS VOYAGE] as crossVoyage,
        [AIR/SEA/RAIL] as transportMode,
        [Cargo Excess Excess Per claim] as cargoExcessPerClaim,
        [No Of claim Cargo] as cargoClaimsCount,
        [Building Insurance] as buildingInsurance,
        [Property Policy Link] as propertyPolicyLink,
        [Renewal Date] as propertyRenewalDate,
        [Building Premium Paid] as buildingPremiumPaid,
        [Sume Assure(Value of )Premises] as sumAssuredValue,
        [Declare Value] as declareValue,
        [Building Location] as buildingLocation,
        [Building Excess Per claim] as buildingExcessPerClaim,
        [No Of claim Building] as buildingClaimsCount,
        [Fleet Policy] as fleetPolicy,
        [Fleet Policy Link] as fleetPolicyLink,
        [Renewal Date2] as fleetRenewalDate,
        [Fleet Premium Paid] as fleetPremiumPaid,
        [Reg No2] as vehicleRegNo,
        [Fleet Excess Per claim] as fleetExcessPerClaim,
        [No Of claim made fleet] as fleetClaimsCount,
        [Renewal Year] as renewalYear,
        [Policy Status] as policyStatus
      FROM Tbl_Insurance_Details_Facility 
      WHERE [Company Name] = @companyName AND [Renewal Year] = @policyYear
      ORDER BY [Id] DESC
    `;
    
    console.log('Setting query parameters...');
    request.input('companyName', sql.NVarChar, companyName);
    request.input('policyYear', sql.NVarChar, year);
    console.log('Parameters set, executing query...');

    const result = await request.query(query);
    console.log('Query executed successfully');
    
    const rows = result.recordset;
    console.log(`Query returned ${rows.length} rows`);
    
    if (rows.length === 0) {
      console.log('No data found for the given parameters');
      return res.status(404).json({ 
        msg: 'No policy data found',
        query: query,
        parameters: { companyName, year }
      });
    }
    
    console.log('Sending response with policy data');
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in policy route:', err);
    res.status(500).json({ 
      msg: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// @route   GET /api/policies/companies
// @desc    Get list of companies with optional year filter
// @access  Private
router.get('/companies', async (req, res) => {
  try {
    const { renewalYear } = req.query;
    const pool = await poolPromise;

    let query = `
      SELECT DISTINCT [Company Name] AS companyName
      FROM Tbl_Insurance_Details_Facility
    `;

    if (renewalYear) {
      query += ` WHERE [Renewal Year] = @renewalYear`;
    }

    const request = pool.request();
    if (renewalYear) {
      request.input('renewalYear', sql.VarChar, renewalYear);
    }

    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch company names' });
  }
});

// @route   GET /api/policies/company-details
// @desc    Get detailed policy information for a company
// @access  Private
router.get('/company-details', async (req, res) => {
  const { companyName, renewalYear } = req.query;
  
  if (!companyName || !renewalYear) {
    return res.status(400).json({ error: 'Company name and Renewal Year are required' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('companyName', sql.NVarChar, companyName.trim())
      .input('renewalYear', sql.VarChar, renewalYear.trim())
      .query(`
        SELECT TOP 1 * 
        FROM Tbl_Insurance_Details_Facility
        WHERE 
          RTRIM(LTRIM([Company Name])) = RTRIM(LTRIM(@companyName)) AND
          RTRIM(LTRIM([Renewal Year])) = RTRIM(LTRIM(@renewalYear))
        ORDER BY [Id] DESC
      `);

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'No matching records found' });
    }
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
