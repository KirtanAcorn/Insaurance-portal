// Test script to check premium data in database
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { poolPromise } = require('./db');
const sql = require('mssql');

async function testPremiumData() {
  try {
    const pool = await poolPromise;
    
    // Get latest year
    const latestYearQuery = `
      SELECT TOP 1 [Year ] AS renewalYear
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE [Year ] IS NOT NULL AND LTRIM(RTRIM([Year ])) <> ''
      ORDER BY TRY_CONVERT(datetime, SUBSTRING([Year ], 1, 4) + '-01-01') DESC
    `;
    const latestResult = await pool.request().query(latestYearQuery);
    const targetYear = latestResult.recordset[0]?.renewalYear;
    
    console.log('Latest year:', targetYear);
    console.log('');
    
    // Get sample premium data
    const sampleQuery = `
      SELECT TOP 5
        [Company Name],
        [Currency],
        [Commercial Premium Paid],
        [Marine Premium Paid],
        [Building Premium Paid],
        [Fleet Premium Paid]
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE [Year ] = @renewalYear
    `;
    
    const sampleResult = await pool.request()
      .input('renewalYear', sql.NVarChar(50), targetYear)
      .query(sampleQuery);
    
    console.log('Sample premium data:');
    console.log(JSON.stringify(sampleResult.recordset, null, 2));
    console.log('');
    
    // Get currency totals
    const totalsQuery = `
      SELECT
        CASE 
          WHEN UPPER([Currency]) LIKE '%GBP%' OR UPPER([Currency]) LIKE '%£%' THEN 'GBP'
          WHEN UPPER([Currency]) LIKE '%USD%' OR UPPER([Currency]) LIKE '%$%' THEN 'USD'
          WHEN UPPER([Currency]) LIKE '%EUR%' OR UPPER([Currency]) LIKE '%€%' THEN 'EUR'
          WHEN UPPER([Currency]) LIKE '%INR%' OR UPPER([Currency]) LIKE '%₹%' THEN 'INR'
          WHEN UPPER([Currency]) LIKE '%PLN%' OR UPPER([Currency]) LIKE '%ZL%' THEN 'PLN'
          ELSE 'GBP'
        END AS currency,
        COUNT(*) as recordCount,
        SUM(
          CASE 
            WHEN [Commercial Premium Paid] IS NULL OR LTRIM(RTRIM([Commercial Premium Paid])) = '' OR LTRIM(RTRIM([Commercial Premium Paid])) = '-' THEN 0
            ELSE TRY_CONVERT(decimal(18,2), 
              REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                LTRIM(RTRIM([Commercial Premium Paid])), 
                ',', ''), '£', ''), '$', ''), '€', ''), '₹', ''), ' ', ''), CHAR(13), ''), CHAR(10), '')
            )
          END
        ) AS commercialTotal,
        SUM(
          CASE 
            WHEN [Marine Premium Paid] IS NULL OR LTRIM(RTRIM([Marine Premium Paid])) = '' OR LTRIM(RTRIM([Marine Premium Paid])) = '-' THEN 0
            ELSE TRY_CONVERT(decimal(18,2), 
              REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                LTRIM(RTRIM([Marine Premium Paid])), 
                ',', ''), '£', ''), '$', ''), '€', ''), '₹', ''), ' ', ''), CHAR(13), ''), CHAR(10), '')
            )
          END
        ) AS marineTotal,
        SUM(
          CASE 
            WHEN [Building Premium Paid] IS NULL OR LTRIM(RTRIM([Building Premium Paid])) = '' OR LTRIM(RTRIM([Building Premium Paid])) = '-' THEN 0
            ELSE TRY_CONVERT(decimal(18,2), 
              REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                LTRIM(RTRIM([Building Premium Paid])), 
                ',', ''), '£', ''), '$', ''), '€', ''), '₹', ''), ' ', ''), CHAR(13), ''), CHAR(10), '')
            )
          END
        ) AS buildingTotal,
        SUM(
          CASE 
            WHEN [Fleet Premium Paid] IS NULL OR LTRIM(RTRIM([Fleet Premium Paid])) = '' OR LTRIM(RTRIM([Fleet Premium Paid])) = '-' THEN 0
            ELSE TRY_CONVERT(decimal(18,2), 
              REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                LTRIM(RTRIM([Fleet Premium Paid])), 
                ',', ''), '£', ''), '$', ''), '€', ''), '₹', ''), ' ', ''), CHAR(13), ''), CHAR(10), '')
            )
          END
        ) AS fleetTotal
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE [Year ] = @renewalYear
      GROUP BY CASE 
          WHEN UPPER([Currency]) LIKE '%GBP%' OR UPPER([Currency]) LIKE '%£%' THEN 'GBP'
          WHEN UPPER([Currency]) LIKE '%USD%' OR UPPER([Currency]) LIKE '%$%' THEN 'USD'
          WHEN UPPER([Currency]) LIKE '%EUR%' OR UPPER([Currency]) LIKE '%€%' THEN 'EUR'
          WHEN UPPER([Currency]) LIKE '%INR%' OR UPPER([Currency]) LIKE '%₹%' THEN 'INR'
          WHEN UPPER([Currency]) LIKE '%PLN%' OR UPPER([Currency]) LIKE '%ZL%' THEN 'PLN'
          ELSE 'GBP'
        END
    `;
    
    const totalsResult = await pool.request()
      .input('renewalYear', sql.NVarChar(50), targetYear)
      .query(totalsQuery);
    
    console.log('Currency totals:');
    console.log(JSON.stringify(totalsResult.recordset, null, 2));
    
    // Calculate grand total
    const grandTotal = totalsResult.recordset.reduce((sum, row) => {
      const rowTotal = (row.commercialTotal || 0) + (row.marineTotal || 0) + 
                      (row.buildingTotal || 0) + (row.fleetTotal || 0);
      return sum + rowTotal;
    }, 0);
    
    console.log('');
    console.log('Grand total (all currencies):', grandTotal);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPremiumData();
