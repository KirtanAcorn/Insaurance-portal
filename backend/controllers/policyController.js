// policyController.js
const { getConnection } = require('../db');
const sql = require('mssql');
const poolPromise = require('../db').poolPromise;

// Helper function to extract policy data (keeping this for backward compatibility)
const extractPolicyData = (record) => {
  return {
    policyType: record.policyType || 'N/A',
    policyNumber: record.policyNumber || 'N/A',
    insurer: record.insurer || 'N/A',
    inceptionDate: record.inceptionDate || 'N/A',
    expiryDate: record.expiryDate || 'N/A',
    sumInsured: record.sumInsured || 'N/A',
    premium: record.premium || 'N/A',
    status: record.policyStatus || 'Active',
    renewalDate: record.renewalDate || 'N/A',
    policyDocument: record.policyDocument || null
  };
};

exports.getCompanyDetails = async (req, res) => {
  const { companyName, renewalYear } = req.query;
  if (!companyName || !renewalYear) {
    return res.status(400).json({ error: "Company name and Renewal Year are required" });
  }

  const decodedCompany = decodeURIComponent(companyName).replace(/-/g, ' ').trim();
  const decodedYear = decodeURIComponent(renewalYear).trim();

  let pool;
  try {
    pool = await poolPromise;
    
    // First, check if the table exists and is accessible
    await pool.request().query('SELECT TOP 1 1 FROM Tbl_Insurance_Details_Facility');
    
    // Optimize the query by selecting only needed columns and using parameterized query
    const query = `
      SELECT TOP 50 * 
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE 
        [Company Name] = @companyName AND
        [Renewal Year] = @renewalYear
    `;
    
    const request = pool.request();
    request.input("companyName", sql.NVarChar(255), decodedCompany);
    request.input("renewalYear", sql.NVarChar(50), decodedYear);
    
    // Set a specific timeout for this request
    //request.query_timeout = 45000; // 45 seconds
    
    const result = await request.query(query);
    
    if (result.recordset.length > 0) {
      return res.json(result.recordset);
    } else {
      // Try with a more flexible search if no exact match found
      const likeQuery = `
        SELECT TOP 50 * 
        FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
        WHERE 
          [Company Name] LIKE '%' + @companyName + '%' AND
          [Renewal Year] LIKE '%' + @renewalYear + '%'
      `;
      
      const likeRequest = pool.request();
      likeRequest.input("companyName", sql.NVarChar(255), decodedCompany);
      likeRequest.input("renewalYear", sql.NVarChar(50), decodedYear);
      //likeRequest.query_timeout = 45000;
      
      const likeResult = await likeRequest.query(likeQuery);
      
      if (likeResult.recordset.length > 0) {
        return res.json(likeResult.recordset);
      }
      
      return res.status(404).json({ 
        message: "No matching records found",
        searchParameters: { companyName: decodedCompany, renewalYear: decodedYear }
      });
    }
  } catch (error) {
    console.error("Error in getCompanyDetails:", {
      error: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    
    // Return more detailed error information
    return res.status(500).json({ 
      error: "Failed to fetch company details",
      details: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    });
  }
};

// Get all policies for a company
exports.getCompanyPolicies = async (req, res) => {
  const { companyName } = req.params;
  
  if (!companyName) {
    return res.status(400).json({ error: "Company name is required" });
  }

  const decodedCompany = decodeURIComponent(companyName).replace(/-/g, ' ').trim();
  
  let pool;
  try {
    pool = await poolPromise;
    
    // First, let's get the table structure to see what columns exist
    const schemaQuery = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Tbl_Insurance_Details_Facility'
    `;
    const schemaResult = await pool.request().query(schemaQuery);
    
    // Query using the exact column names from the database
    const query = `
      SELECT DISTINCT TOP 50
        [Company Name] AS companyName,
        [Commercial Policy] AS commercialPolicy,
        [Commercial Policy Link] AS commercialPolicyLink,
        [Marine Policy Link] AS marinePolicyLink,
        [Property Policy Link] AS propertyPolicyLink,
        [Fleet Policy] AS fleetPolicy,
        [Fleet Policy Link] AS fleetPolicyLink,
        [Commercial Premium Paid] AS commercialPremium,
        [Marine Premium Paid] AS marinePremium,
        [Building Premium Paid] AS buildingPremium,
        [Fleet Premium Paid] AS fleetPremium,
        [Commercial Renewal Date] AS commercialRenewalDate,
        [Marine Renewal] AS marineRenewalDate,
        [Renewal Date] AS propertyRenewalDate,
        [Renewal Date2] AS fleetRenewalDate,
        [Renewal Year] AS renewalYear
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE [Company Name] = @companyName
      ORDER BY [Company Name]
    `;
    
    const request = pool.request();
    request.input("companyName", sql.NVarChar(255), decodedCompany);
    
    const result = await request.query(query);
    
    if (result.recordset.length > 0) {
      // Since we're now using column aliases in the query, we can return the data directly
      return res.json(result.recordset);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.error('Error fetching company policies:', error);
    return res.status(500).json({ 
      error: "Error fetching company policies",
      details: error.message 
    });
  } finally {
    // No need to close the pool as it's managed by poolPromise
  }
};