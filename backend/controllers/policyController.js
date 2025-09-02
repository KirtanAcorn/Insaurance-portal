// policyController.js
const { getConnection } = require('../db');
const sql = require('mssql');
const poolPromise = require('../db').poolPromise;

exports.getCompanyDetails = async (req, res) => {
  const { companyName, renewalYear } = req.query;
  console.log('Received request with:', { companyName, renewalYear });
  
  if (!companyName || !renewalYear) {
    return res.status(400).json({ error: "Company name and Renewal Year are required" });
  }

  const decodedCompany = decodeURIComponent(companyName).replace(/-/g, ' ').trim();
  const decodedYear = decodeURIComponent(renewalYear).trim();
  
  console.log('Decoded parameters:', { decodedCompany, decodedYear });

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
    
    console.log('Executing query with:', { companyName: decodedCompany, renewalYear: decodedYear });
    
    const request = pool.request();
    request.input("companyName", sql.NVarChar(255), decodedCompany);
    request.input("renewalYear", sql.NVarChar(50), decodedYear);
    
    // Set a specific timeout for this request
    //request.query_timeout = 45000; // 45 seconds
    
    const result = await request.query(query);
    
    console.log(`Query returned ${result.recordset.length} records`);
    
    if (result.recordset.length > 0) {
      return res.json(result.recordset);
    } else {
      // Try with a more flexible search if no exact match found
      console.log('No exact match found, trying with LIKE operator...');
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