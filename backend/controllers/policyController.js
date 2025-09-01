// policyController.js
const { getConnection } = require('../db');
const sql = require('mssql');
const poolPromise = require('../db').poolPromise;

exports.getCompanyDetails = async (req, res) => {
  const { companyName, renewalYear } = req.query;
  if (!companyName || !renewalYear) {
    return res.status(400).json({ error: "Company name and Renewal Year are required" });
  }

  const decodedCompany = decodeURIComponent(companyName).trim();
  const decodedYear = decodeURIComponent(renewalYear).trim();

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("companyName", sql.NVarChar(255), `%${decodedCompany}%`) // allow partial
      .input("renewalYear", sql.NVarChar(255), decodedYear)
      .query(`
        SELECT * 
        FROM Tbl_Insurance_Details_Facility
        WHERE 
          [Company Name] LIKE @companyName AND
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