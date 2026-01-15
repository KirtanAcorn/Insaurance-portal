const { poolPromise } = require('../db');
const sql = require('mssql');

exports.getQuickStats = async (req, res) => {
  try {
    const pool = await poolPromise;

    // 1. Claim Success Calculation
    const claimsResult = await pool.request().query(`
      SELECT
        COUNT(*) AS totalClaims,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approvedClaims
      FROM Facility_Claims
    `);
    const { totalClaims, approvedClaims } = claimsResult.recordset[0];
    const claimSuccessPercentage = totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0;

    // 2. Global Coverage Calculation
    const latestYearResult = await pool.request().query(`
      SELECT TOP 1 [Year] AS renewalYear
      FROM Facility_Insurance_Details
      WHERE [Year] IS NOT NULL AND LTRIM(RTRIM([Year])) <> ''
      ORDER BY [Year] DESC
    `);
    const latestRenewalYear = latestYearResult.recordset[0]?.renewalYear;

    let globalCoveragePercentage = 0;
    if (latestRenewalYear) {
      const coverageResult = await pool.request().query(`
        SELECT 
          (SELECT COUNT(DISTINCT [Company Name]) FROM Facility_Insurance_Details WHERE [Year] = '${latestRenewalYear}') AS companiesWithPolicyInYear,
          (SELECT COUNT(DISTINCT [Company Name]) FROM Facility_Insurance_Details) AS totalUniqueCompanies
      `);
      const { companiesWithPolicyInYear, totalUniqueCompanies } = coverageResult.recordset[0];
      globalCoveragePercentage = totalUniqueCompanies > 0 ? (companiesWithPolicyInYear / totalUniqueCompanies) * 100 : 0;
    }

    // 3. Data Security Calculation
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const currentYearStr = `${currentYear}-${currentYear + 1}`;
    const lastYearStr = `${lastYear}-${currentYear}`;

    const dataSecurityResult = await pool.request().query(`
        SELECT
            (SELECT COUNT(*) FROM Facility_Insurance_Details WHERE [Year] = '${currentYearStr}') AS policiesCurrentYear,
            (SELECT COUNT(*) FROM Facility_Insurance_Details WHERE [Year] = '${lastYearStr}') AS policiesLastYear
    `);
    const { policiesCurrentYear, policiesLastYear } = dataSecurityResult.recordset[0];
    const dataSecurityPercentage = policiesLastYear > 0 ? (policiesCurrentYear / policiesLastYear) * 100 : (policiesCurrentYear > 0 ? 100 : 0);


    res.json({
      claimSuccess: claimSuccessPercentage.toFixed(1),
      globalCoverage: globalCoveragePercentage.toFixed(1),
      dataSecurity: Math.min(100, dataSecurityPercentage).toFixed(1)
    });

  } catch (error) {
    console.error('Error in getQuickStats:', error);
    res.status(500).send('Server Error: ' + error.message);
  }
};
