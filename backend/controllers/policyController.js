// policyController.js
const { getConnection } = require('../db');
const sql = require('mssql');


exports.getCompanies = async (req, res) => {
  try {
    const { renewalYear } = req.query;
    const pool = await poolPromise;

    let query = `
      SELECT DISTINCT [Company Name] AS CompanyName
      FROM Tbl_Insurance_Details_Facility
    `;

    if (renewalYear) {
      query += ` WHERE [Renewal Year] = @renewalYear`;
    }

    const request = pool.request();
    if (renewalYear) {
      request.input("renewalYear", sql.VarChar, renewalYear);
    }

    const result = await request.query(query);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch company names" });
  }
};

exports.getCompanyDetails = async (req, res) => {

  const { companyName, renewalYear } = req.query;
  if (!companyName || !renewalYear ) {
    return res.status(400).json({ error: "Company name and Renewal Year are required" });
  }

  const decodedCompany = decodeURIComponent(companyName).trim();
  const decodedYear = decodeURIComponent(renewalYear).trim();

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("companyName", sql.NVarChar(255), decodedCompany)
      .input("renewalYear", sql.NVarChar(255), decodedYear)
      .query(`
        SELECT * 
        FROM Tbl_Insurance_Details_Facility
        WHERE 
          RTRIM(LTRIM([Company Name])) = RTRIM(LTRIM(@companyName)) AND
          RTRIM(LTRIM([Renewal Year])) = RTRIM(LTRIM(@renewalYear))
      `);

    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res.status(404).json({ message: "No matching records found" });
    }
    
  } catch (error) {
    console.error("Error fetching company details:", error);
    return res.status(500).json({ error: "Server error" });
  }
};