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
}; // <--- FIXED: Missing closing brace was added here

// Get all policies for a specific year, or latest year if none provided
exports.getPoliciesByYear = async (req, res) => {
  const { renewalYear } = req.query;
  let pool;
  try {
    pool = await poolPromise;

    // Determine latest year if not provided - using [Year ] field (note the trailing space)
    let targetYear = renewalYear;
    if (!targetYear) {
      const latestYearQuery = `
        SELECT TOP 1 [Year ] AS renewalYear
        FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
        WHERE [Year ] IS NOT NULL AND LTRIM(RTRIM([Year ])) <> ''
        ORDER BY TRY_CONVERT(datetime, SUBSTRING([Year ], 1, 4) + '-01-01') DESC
      `;
      const latestResult = await pool.request().query(latestYearQuery);
      targetYear = latestResult.recordset[0]?.renewalYear || null;
    }

    if (!targetYear) {
      return res.status(404).json({ message: 'No year found in data' });
    }

    const query = `
      SELECT
        [Id],
        [Company Name],
        [Currency],
        [Commercial Premium Paid],
        [Marine Premium Paid],
        [Building Premium Paid],
        [Fleet Premium Paid],
        [Year ]
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE [Year ] = @renewalYear
    `;

    const request = pool.request();
    request.input('renewalYear', sql.NVarChar(50), targetYear);
    const result = await request.query(query);

    // Aggregate totals per currency on the server to avoid client parsing issues
    const totalsQuery = `
      SELECT
        UPPER(REPLACE(REPLACE(LTRIM(RTRIM(ISNULL([Currency], 'GBP'))), '£', 'GBP'), ' ', '')) AS currency,
        SUM(TRY_CONVERT(decimal(18,2), REPLACE(REPLACE(ISNULL([Commercial Premium Paid], '0'), ',', ''), '£', ''))) AS commercialTotal,
        SUM(TRY_CONVERT(decimal(18,2), REPLACE(REPLACE(ISNULL([Marine Premium Paid], '0'), ',', ''), '£', ''))) AS marineTotal,
        SUM(TRY_CONVERT(decimal(18,2), REPLACE(REPLACE(ISNULL([Building Premium Paid], '0'), ',', ''), '£', ''))) AS buildingTotal,
        SUM(TRY_CONVERT(decimal(18,2), REPLACE(REPLACE(ISNULL([Fleet Premium Paid], '0'), ',', ''), '£', ''))) AS fleetTotal
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE [Year ] = @renewalYear
      GROUP BY UPPER(REPLACE(REPLACE(LTRIM(RTRIM(ISNULL([Currency], 'GBP'))), '£', 'GBP'), ' ', ''))
    `;

    const totalsResult = await pool.request()
      .input('renewalYear', sql.NVarChar(50), targetYear)
      .query(totalsQuery);

    return res.json({ renewalYear: targetYear, rows: result.recordset, currencyTotals: totalsResult.recordset });
  } catch (error) {
    console.error('Error in getPoliciesByYear:', error);
    return res.status(500).json({ error: 'Failed to fetch policies by year', details: error.message });
  }
};

exports.getCompanyDetails = async (req, res) => {
  const { companyName, renewalYear } = req.query;
  if (!companyName || !renewalYear) {
    return res.status(400).json({ error: "Company name and Renewal Year (Year field) are required" });
  }

  const decodedCompany = decodeURIComponent(companyName).replace(/-/g, ' ').trim();
  const decodedYear = decodeURIComponent(renewalYear).trim();

  let pool;
  try {
    pool = await poolPromise;
    
    // First, check if the table exists and is accessible
    await pool.request().query('SELECT TOP 1 1 FROM Tbl_Insurance_Details_Facility');
    
    // Query with new table structure - using [Year ] field (note the trailing space)
    const query = `
      SELECT TOP 50 * FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE 
        [Company Name] = @companyName AND
        [Year ] = @renewalYear
    `;
    
    const request = pool.request();
    request.input("companyName", sql.NVarChar(255), decodedCompany);
    request.input("renewalYear", sql.NVarChar(50), decodedYear);
    
    const result = await request.query(query);
    
    if (result.recordset.length > 0) {
      return res.json(result.recordset);
    } else {
      // Try with a more flexible search if no exact match found
      const likeQuery = `
        SELECT TOP 50 * FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
        WHERE 
          [Company Name] LIKE '%' + @companyName + '%' AND
          [Year ] LIKE '%' + @renewalYear + '%'
      `;
      
      const likeRequest = pool.request();
      likeRequest.input("companyName", sql.NVarChar(255), decodedCompany);
      likeRequest.input("renewalYear", sql.NVarChar(50), decodedYear);
      
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

// Create a new policy
exports.createPolicy = async (req, res) => {
  const policyData = req.body;
  
  if (!policyData.companyName || !policyData.year || !policyData.propertyType) {
    return res.status(400).json({ error: 'Company name, year, and property type are required' });
  }

  let pool;
  try {
    pool = await poolPromise;
    
    // Check if a policy already exists for this company and year
    const checkQuery = `
      SELECT COUNT(*) as count 
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE [Company Name] = @companyName AND [Year ] = @year
    `;
    
    const checkRequest = pool.request();
    checkRequest.input('companyName', sql.NVarChar(255), policyData.companyName);
    checkRequest.input('year', sql.NVarChar(50), policyData.year);
    
    const checkResult = await checkRequest.query(checkQuery);
    const existingCount = checkResult.recordset[0].count;
    
    if (existingCount > 0) {
      return res.status(409).json({ 
        error: 'Duplicate policy detected',
        message: `A policy for ${policyData.companyName} in year ${policyData.year} already exists. Please use the Edit function to update the existing policy.`,
        existingCount: existingCount
      });
    }
    
    // Build the INSERT query dynamically based on property type
    let fields = ['[Company Name]', '[Year ]'];
    let values = ['@companyName', '@year'];
    let params = {
      companyName: policyData.companyName,
      year: policyData.year
    };

    // Add common company information fields
    if (policyData.country) { fields.push('[Country]'); values.push('@country'); params.country = policyData.country; }
    if (policyData.regAddress) { fields.push('[Reg Address]'); values.push('@regAddress'); params.regAddress = policyData.regAddress; }
    if (policyData.warehouseOfficeAddress) { fields.push('[Warehouse/Office Address/es]'); values.push('@warehouseOfficeAddress'); params.warehouseOfficeAddress = policyData.warehouseOfficeAddress; }
    if (policyData.regNo) { fields.push('[Reg No]'); values.push('@regNo'); params.regNo = policyData.regNo; }
    if (policyData.regDate) { fields.push('[Reg Date]'); values.push('@regDate'); params.regDate = policyData.regDate; }
    if (policyData.companyFirstTimePolicy) { fields.push('[Company first Time Policy]'); values.push('@companyFirstTimePolicy'); params.companyFirstTimePolicy = policyData.companyFirstTimePolicy; }
    if (policyData.directorOwnerName) { fields.push('[Director/Owner Name]'); values.push('@directorOwnerName'); params.directorOwnerName = policyData.directorOwnerName; }
    if (policyData.companyHandledBy) { fields.push('[Company Handle By]'); values.push('@companyHandledBy'); params.companyHandledBy = policyData.companyHandledBy; }
    if (policyData.vatNumber) { fields.push('[VAT Number]'); values.push('@vatNumber'); params.vatNumber = policyData.vatNumber; }
    if (policyData.commodity) { fields.push('[Comodity]'); values.push('@commodity'); params.commodity = policyData.commodity; }
    if (policyData.currency) { fields.push('[Currency]'); values.push('@currency'); params.currency = policyData.currency; }
    if (policyData.turnoverGBP) { fields.push('[Turnover in £ Mn]'); values.push('@turnoverGBP'); params.turnoverGBP = policyData.turnoverGBP; }
    if (policyData.insuranceAgent) { fields.push('[Insurance Agent]'); values.push('@insuranceAgent'); params.insuranceAgent = policyData.insuranceAgent; }
    if (policyData.accountHandler) { fields.push('[A/C HANDLER]'); values.push('@accountHandler'); params.accountHandler = policyData.accountHandler; }
    if (policyData.empCount) { fields.push('[Emp Count]'); values.push('@empCount'); params.empCount = policyData.empCount; }

    // Add fields based on property type
    if (policyData.propertyType === 'Commercial') {
      if (policyData.commercialPolicy) { fields.push('[Commercial Policy]'); values.push('@commercialPolicy'); params.commercialPolicy = policyData.commercialPolicy; }
      if (policyData.commercialPolicyLink) { fields.push('[Commercial Policy Link]'); values.push('@commercialPolicyLink'); params.commercialPolicyLink = policyData.commercialPolicyLink; }
      if (policyData.commercialRenewalDate) { fields.push('[Commercial Renewal Date]'); values.push('@commercialRenewalDate'); params.commercialRenewalDate = policyData.commercialRenewalDate; }
      if (policyData.commercialPremiumPaid) { fields.push('[Commercial Premium Paid]'); values.push('@commercialPremiumPaid'); params.commercialPremiumPaid = policyData.commercialPremiumPaid; }
      if (policyData.employeeLiabilityCover) { fields.push('[Employee Liability Cover]'); values.push('@employeeLiabilityCover'); params.employeeLiabilityCover = policyData.employeeLiabilityCover; }
      if (policyData.empLiabilityRenewalDate) { fields.push('[Emp_Liabality Renewal Date]'); values.push('@empLiabilityRenewalDate'); params.empLiabilityRenewalDate = policyData.empLiabilityRenewalDate; }
      if (policyData.floatingStock) { fields.push('[Floting stock]'); values.push('@floatingStock'); params.floatingStock = policyData.floatingStock; }
      if (policyData.stockCover) { fields.push('[Stock Cover]'); values.push('@stockCover'); params.stockCover = policyData.stockCover; }
      if (policyData.stockLocation) { fields.push('[Stock Location]'); values.push('@stockLocation'); params.stockLocation = policyData.stockLocation; }
      if (policyData.productLiability) { fields.push('[Product Liability]'); values.push('@productLiability'); params.productLiability = policyData.productLiability; }
      if (policyData.amazonVendorLiability) { fields.push('[Amazon Vendor Liability]'); values.push('@amazonVendorLiability'); params.amazonVendorLiability = policyData.amazonVendorLiability; }
      if (policyData.legalExpenseCover) { fields.push('[Legal Expense Cover]'); values.push('@legalExpenseCover'); params.legalExpenseCover = policyData.legalExpenseCover; }
      if (policyData.commercialExcessPerClaim) { fields.push('[Commercial Excess Per claim]'); values.push('@commercialExcessPerClaim'); params.commercialExcessPerClaim = policyData.commercialExcessPerClaim; }
      if (policyData.noOfClaimCommercial) { fields.push('[No Of claim Commercial]'); values.push('@noOfClaimCommercial'); params.noOfClaimCommercial = policyData.noOfClaimCommercial; }
    } else if (policyData.propertyType === 'Marine') {
      if (policyData.marine) { fields.push('[Marine]'); values.push('@marine'); params.marine = policyData.marine; }
      if (policyData.marinePolicyLink) { fields.push('[Marine Policy Link]'); values.push('@marinePolicyLink'); params.marinePolicyLink = policyData.marinePolicyLink; }
      if (policyData.marineRenewal) { fields.push('[Marine Renewal]'); values.push('@marineRenewal'); params.marineRenewal = policyData.marineRenewal; }
      if (policyData.marinePremiumPaid) { fields.push('[Marine Premium Paid]'); values.push('@marinePremiumPaid'); params.marinePremiumPaid = policyData.marinePremiumPaid; }
      if (policyData.perTransitCover) { fields.push('[Per Transit Cover]'); values.push('@perTransitCover'); params.perTransitCover = policyData.perTransitCover; }
      if (policyData.ukUk) { fields.push('[UK-UK]'); values.push('@ukUk'); params.ukUk = policyData.ukUk; }
      if (policyData.ukEu) { fields.push('[UK-EU]'); values.push('@ukEu'); params.ukEu = policyData.ukEu; }
      if (policyData.ukUsaCanada) { fields.push('[UK-USA/Canada]'); values.push('@ukUsaCanada'); params.ukUsaCanada = policyData.ukUsaCanada; }
      if (policyData.ukMiddleEastDubai) { fields.push('[UK-MiddelEast(Dubai)]'); values.push('@ukMiddleEastDubai'); params.ukMiddleEastDubai = policyData.ukMiddleEastDubai; }
      if (policyData.usaMiddleEastDubai) { fields.push('[USA-Middeleast(Dubai)]'); values.push('@usaMiddleEastDubai'); params.usaMiddleEastDubai = policyData.usaMiddleEastDubai; }
      if (policyData.euMiddleEastDubai) { fields.push('[EU-Middeleast(Dubai)]'); values.push('@euMiddleEastDubai'); params.euMiddleEastDubai = policyData.euMiddleEastDubai; }
      if (policyData.euEu) { fields.push('[EU-EU]'); values.push('@euEu'); params.euEu = policyData.euEu; }
      if (policyData.euUsa) { fields.push('[EU-USA]'); values.push('@euUsa'); params.euUsa = policyData.euUsa; }
      if (policyData.usaUsa) { fields.push('[USA-USA]'); values.push('@usaUsa'); params.usaUsa = policyData.usaUsa; }
      if (policyData.ukRow) { fields.push('[UK-ROW]'); values.push('@ukRow'); params.ukRow = policyData.ukRow; }
      if (policyData.usaRow) { fields.push('[USA-ROW]'); values.push('@usaRow'); params.usaRow = policyData.usaRow; }
      if (policyData.euRow) { fields.push('[EU-ROW]'); values.push('@euRow'); params.euRow = policyData.euRow; }
      if (policyData.rowRow) { fields.push('[ROW-ROW]'); values.push('@rowRow'); params.rowRow = policyData.rowRow; }
      if (policyData.crossVoyage) { fields.push('[CROSS VOYAGE]'); values.push('@crossVoyage'); params.crossVoyage = policyData.crossVoyage; }
      if (policyData.airSeaRail) { fields.push('[AIR/SEA/RAIL]'); values.push('@airSeaRail'); params.airSeaRail = policyData.airSeaRail; }
      if (policyData.road) { fields.push('[ROAD]'); values.push('@road'); params.road = policyData.road; }
      if (policyData.anyLocationInOrdinaryCourseOfTransit) { fields.push('[ANYONE LOACTION IN ORDINARY COURSE OF TRANSIT]'); values.push('@anyLocationInOrdinaryCourseOfTransit'); params.anyLocationInOrdinaryCourseOfTransit = policyData.anyLocationInOrdinaryCourseOfTransit; }
      if (policyData.cargoExcessPerClaim) { fields.push('[Cargo Excess Excess Per claim]'); values.push('@cargoExcessPerClaim'); params.cargoExcessPerClaim = policyData.cargoExcessPerClaim; }
      if (policyData.noOfClaimCargo) { fields.push('[No Of claim Cargo]'); values.push('@noOfClaimCargo'); params.noOfClaimCargo = policyData.noOfClaimCargo; }
    } else if (policyData.propertyType === 'Property') {
      if (policyData.buildingInsurance) { fields.push('[Building Insurance]'); values.push('@buildingInsurance'); params.buildingInsurance = policyData.buildingInsurance; }
      if (policyData.propertyPolicyLink) { fields.push('[Property Policy Link]'); values.push('@propertyPolicyLink'); params.propertyPolicyLink = policyData.propertyPolicyLink; }
      if (policyData.renewalDate) { fields.push('[Renewal Date]'); values.push('@renewalDate'); params.renewalDate = policyData.renewalDate; }
      if (policyData.buildingPremiumPaid) { fields.push('[Building Premium Paid]'); values.push('@buildingPremiumPaid'); params.buildingPremiumPaid = policyData.buildingPremiumPaid; }
      if (policyData.sumAssuredValueOfPremises) { fields.push('[Sume Assure(Value of )Premises]'); values.push('@sumAssuredValueOfPremises'); params.sumAssuredValueOfPremises = policyData.sumAssuredValueOfPremises; }
      if (policyData.declareValue) { fields.push('[Declare Value]'); values.push('@declareValue'); params.declareValue = policyData.declareValue; }
      if (policyData.buildingLocation) { fields.push('[Building Location]'); values.push('@buildingLocation'); params.buildingLocation = policyData.buildingLocation; }
      if (policyData.buildingExcessPerClaim) { fields.push('[Building Excess Per claim]'); values.push('@buildingExcessPerClaim'); params.buildingExcessPerClaim = policyData.buildingExcessPerClaim; }
      if (policyData.noOfClaimBuilding) { fields.push('[No Of claim Building]'); values.push('@noOfClaimBuilding'); params.noOfClaimBuilding = policyData.noOfClaimBuilding; }
    } else if (policyData.propertyType === 'Fleet') {
      if (policyData.fleetPolicy) { fields.push('[Fleet Policy]'); values.push('@fleetPolicy'); params.fleetPolicy = policyData.fleetPolicy; }
      if (policyData.fleetPolicyLink) { fields.push('[Fleet Policy Link]'); values.push('@fleetPolicyLink'); params.fleetPolicyLink = policyData.fleetPolicyLink; }
      if (policyData.renewalDate2) { fields.push('[Renewal Date2]'); values.push('@renewalDate2'); params.renewalDate2 = policyData.renewalDate2; }
      if (policyData.fleetPremiumPaid) { fields.push('[Fleet Premium Paid]'); values.push('@fleetPremiumPaid'); params.fleetPremiumPaid = policyData.fleetPremiumPaid; }
      if (policyData.regNo2) { fields.push('[Reg No2]'); values.push('@regNo2'); params.regNo2 = policyData.regNo2; }
      if (policyData.fleetExcessPerClaim) { fields.push('[Fleet Excess Per claim ]'); values.push('@fleetExcessPerClaim'); params.fleetExcessPerClaim = policyData.fleetExcessPerClaim; }
      if (policyData.noOfClaimMadeFleet) { fields.push('[No Of claim made fleet]'); values.push('@noOfClaimMadeFleet'); params.noOfClaimMadeFleet = policyData.noOfClaimMadeFleet; }
    }

    const query = `
      INSERT INTO Tbl_Insurance_Details_Facility (${fields.join(', ')})
      VALUES (${values.join(', ')})
    `;

    const request = pool.request();
    Object.keys(params).forEach(key => {
      request.input(key, sql.NVarChar, params[key]);
    });

    await request.query(query);

    return res.status(201).json({ message: 'Policy created successfully' });
  } catch (error) {
    console.error('Error creating policy:', error);
    return res.status(500).json({ error: 'Failed to create policy', details: error.message });
  }
};

// Update an existing policy
exports.updatePolicy = async (req, res) => {
  const policyData = req.body;
  
  if (!policyData.id) {
    return res.status(400).json({ error: 'Policy ID is required' });
  }

  let pool;
  try {
    pool = await poolPromise;
    
    // Build the UPDATE query dynamically
    let updates = [];
    let params = { id: policyData.id };

    // Add common company information fields
    if (policyData.country !== undefined) { updates.push('[Country] = @country'); params.country = policyData.country; }
    if (policyData.regAddress !== undefined) { updates.push('[Reg Address] = @regAddress'); params.regAddress = policyData.regAddress; }
    if (policyData.warehouseOfficeAddress !== undefined) { updates.push('[Warehouse/Office Address/es] = @warehouseOfficeAddress'); params.warehouseOfficeAddress = policyData.warehouseOfficeAddress; }
    if (policyData.regNo !== undefined) { updates.push('[Reg No] = @regNo'); params.regNo = policyData.regNo; }
    if (policyData.regDate !== undefined) { updates.push('[Reg Date] = @regDate'); params.regDate = policyData.regDate; }
    if (policyData.companyFirstTimePolicy !== undefined) { updates.push('[Company first Time Policy] = @companyFirstTimePolicy'); params.companyFirstTimePolicy = policyData.companyFirstTimePolicy; }
    if (policyData.directorOwnerName !== undefined) { updates.push('[Director/Owner Name] = @directorOwnerName'); params.directorOwnerName = policyData.directorOwnerName; }
    if (policyData.companyHandledBy !== undefined) { updates.push('[Company Handle By] = @companyHandledBy'); params.companyHandledBy = policyData.companyHandledBy; }
    if (policyData.vatNumber !== undefined) { updates.push('[VAT Number] = @vatNumber'); params.vatNumber = policyData.vatNumber; }
    if (policyData.commodity !== undefined) { updates.push('[Comodity] = @commodity'); params.commodity = policyData.commodity; }
    if (policyData.currency !== undefined) { updates.push('[Currency] = @currency'); params.currency = policyData.currency; }
    if (policyData.turnoverGBP !== undefined) { updates.push('[Turnover in £ Mn] = @turnoverGBP'); params.turnoverGBP = policyData.turnoverGBP; }
    if (policyData.insuranceAgent !== undefined) { updates.push('[Insurance Agent] = @insuranceAgent'); params.insuranceAgent = policyData.insuranceAgent; }
    if (policyData.accountHandler !== undefined) { updates.push('[A/C HANDLER] = @accountHandler'); params.accountHandler = policyData.accountHandler; }
    if (policyData.empCount !== undefined) { updates.push('[Emp Count] = @empCount'); params.empCount = policyData.empCount; }

    // Add property-type-specific fields
    if (policyData.propertyType === 'Commercial') {
      if (policyData.commercialPolicy !== undefined) { updates.push('[Commercial Policy] = @commercialPolicy'); params.commercialPolicy = policyData.commercialPolicy; }
      if (policyData.commercialPolicyLink !== undefined) { updates.push('[Commercial Policy Link] = @commercialPolicyLink'); params.commercialPolicyLink = policyData.commercialPolicyLink; }
      if (policyData.commercialRenewalDate !== undefined) { updates.push('[Commercial Renewal Date] = @commercialRenewalDate'); params.commercialRenewalDate = policyData.commercialRenewalDate; }
      if (policyData.commercialPremiumPaid !== undefined) { updates.push('[Commercial Premium Paid] = @commercialPremiumPaid'); params.commercialPremiumPaid = policyData.commercialPremiumPaid; }
      if (policyData.employeeLiabilityCover !== undefined) { updates.push('[Employee Liability Cover] = @employeeLiabilityCover'); params.employeeLiabilityCover = policyData.employeeLiabilityCover; }
      if (policyData.empLiabilityRenewalDate !== undefined) { updates.push('[Emp_Liabality Renewal Date] = @empLiabilityRenewalDate'); params.empLiabilityRenewalDate = policyData.empLiabilityRenewalDate; }
      if (policyData.floatingStock !== undefined) { updates.push('[Floting stock] = @floatingStock'); params.floatingStock = policyData.floatingStock; }
      if (policyData.stockCover !== undefined) { updates.push('[Stock Cover] = @stockCover'); params.stockCover = policyData.stockCover; }
      if (policyData.stockLocation !== undefined) { updates.push('[Stock Location] = @stockLocation'); params.stockLocation = policyData.stockLocation; }
      if (policyData.productLiability !== undefined) { updates.push('[Product Liability] = @productLiability'); params.productLiability = policyData.productLiability; }
      if (policyData.amazonVendorLiability !== undefined) { updates.push('[Amazon Vendor Liability] = @amazonVendorLiability'); params.amazonVendorLiability = policyData.amazonVendorLiability; }
      if (policyData.legalExpenseCover !== undefined) { updates.push('[Legal Expense Cover] = @legalExpenseCover'); params.legalExpenseCover = policyData.legalExpenseCover; }
      if (policyData.commercialExcessPerClaim !== undefined) { updates.push('[Commercial Excess Per claim] = @commercialExcessPerClaim'); params.commercialExcessPerClaim = policyData.commercialExcessPerClaim; }
      if (policyData.noOfClaimCommercial !== undefined) { updates.push('[No Of claim Commercial] = @noOfClaimCommercial'); params.noOfClaimCommercial = policyData.noOfClaimCommercial; }
    } else if (policyData.propertyType === 'Marine') {
      if (policyData.marine !== undefined) { updates.push('[Marine] = @marine'); params.marine = policyData.marine; }
      if (policyData.marinePolicyLink !== undefined) { updates.push('[Marine Policy Link] = @marinePolicyLink'); params.marinePolicyLink = policyData.marinePolicyLink; }
      if (policyData.marineRenewal !== undefined) { updates.push('[Marine Renewal] = @marineRenewal'); params.marineRenewal = policyData.marineRenewal; }
      if (policyData.marinePremiumPaid !== undefined) { updates.push('[Marine Premium Paid] = @marinePremiumPaid'); params.marinePremiumPaid = policyData.marinePremiumPaid; }
      if (policyData.perTransitCover !== undefined) { updates.push('[Per Transit Cover] = @perTransitCover'); params.perTransitCover = policyData.perTransitCover; }
      if (policyData.ukUk !== undefined) { updates.push('[UK-UK] = @ukUk'); params.ukUk = policyData.ukUk; }
      if (policyData.ukEu !== undefined) { updates.push('[UK-EU] = @ukEu'); params.ukEu = policyData.ukEu; }
      if (policyData.ukUsaCanada !== undefined) { updates.push('[UK-USA/Canada] = @ukUsaCanada'); params.ukUsaCanada = policyData.ukUsaCanada; }
      if (policyData.ukMiddleEastDubai !== undefined) { updates.push('[UK-MiddelEast(Dubai)] = @ukMiddleEastDubai'); params.ukMiddleEastDubai = policyData.ukMiddleEastDubai; }
      if (policyData.usaMiddleEastDubai !== undefined) { updates.push('[USA-Middeleast(Dubai)] = @usaMiddleEastDubai'); params.usaMiddleEastDubai = policyData.usaMiddleEastDubai; }
      if (policyData.euMiddleEastDubai !== undefined) { updates.push('[EU-Middeleast(Dubai)] = @euMiddleEastDubai'); params.euMiddleEastDubai = policyData.euMiddleEastDubai; }
      if (policyData.euEu !== undefined) { updates.push('[EU-EU] = @euEu'); params.euEu = policyData.euEu; }
      if (policyData.euUsa !== undefined) { updates.push('[EU-USA] = @euUsa'); params.euUsa = policyData.euUsa; }
      if (policyData.usaUsa !== undefined) { updates.push('[USA-USA] = @usaUsa'); params.usaUsa = policyData.usaUsa; }
      if (policyData.ukRow !== undefined) { updates.push('[UK-ROW] = @ukRow'); params.ukRow = policyData.ukRow; }
      if (policyData.usaRow !== undefined) { updates.push('[USA-ROW] = @usaRow'); params.usaRow = policyData.usaRow; }
      if (policyData.euRow !== undefined) { updates.push('[EU-ROW] = @euRow'); params.euRow = policyData.euRow; }
      if (policyData.rowRow !== undefined) { updates.push('[ROW-ROW] = @rowRow'); params.rowRow = policyData.rowRow; }
      if (policyData.crossVoyage !== undefined) { updates.push('[CROSS VOYAGE] = @crossVoyage'); params.crossVoyage = policyData.crossVoyage; }
      if (policyData.airSeaRail !== undefined) { updates.push('[AIR/SEA/RAIL] = @airSeaRail'); params.airSeaRail = policyData.airSeaRail; }
      if (policyData.road !== undefined) { updates.push('[ROAD] = @road'); params.road = policyData.road; }
      if (policyData.anyLocationInOrdinaryCourseOfTransit !== undefined) { updates.push('[ANYONE LOACTION IN ORDINARY COURSE OF TRANSIT] = @anyLocationInOrdinaryCourseOfTransit'); params.anyLocationInOrdinaryCourseOfTransit = policyData.anyLocationInOrdinaryCourseOfTransit; }
      if (policyData.cargoExcessPerClaim !== undefined) { updates.push('[Cargo Excess Excess Per claim] = @cargoExcessPerClaim'); params.cargoExcessPerClaim = policyData.cargoExcessPerClaim; }
      if (policyData.noOfClaimCargo !== undefined) { updates.push('[No Of claim Cargo] = @noOfClaimCargo'); params.noOfClaimCargo = policyData.noOfClaimCargo; }
    } else if (policyData.propertyType === 'Property') {
      if (policyData.buildingInsurance !== undefined) { updates.push('[Building Insurance] = @buildingInsurance'); params.buildingInsurance = policyData.buildingInsurance; }
      if (policyData.propertyPolicyLink !== undefined) { updates.push('[Property Policy Link] = @propertyPolicyLink'); params.propertyPolicyLink = policyData.propertyPolicyLink; }
      if (policyData.renewalDate !== undefined) { updates.push('[Renewal Date] = @renewalDate'); params.renewalDate = policyData.renewalDate; }
      if (policyData.buildingPremiumPaid !== undefined) { updates.push('[Building Premium Paid] = @buildingPremiumPaid'); params.buildingPremiumPaid = policyData.buildingPremiumPaid; }
      if (policyData.sumAssuredValueOfPremises !== undefined) { updates.push('[Sume Assure(Value of )Premises] = @sumAssuredValueOfPremises'); params.sumAssuredValueOfPremises = policyData.sumAssuredValueOfPremises; }
      if (policyData.declareValue !== undefined) { updates.push('[Declare Value] = @declareValue'); params.declareValue = policyData.declareValue; }
      if (policyData.buildingLocation !== undefined) { updates.push('[Building Location] = @buildingLocation'); params.buildingLocation = policyData.buildingLocation; }
      if (policyData.buildingExcessPerClaim !== undefined) { updates.push('[Building Excess Per claim] = @buildingExcessPerClaim'); params.buildingExcessPerClaim = policyData.buildingExcessPerClaim; }
      if (policyData.noOfClaimBuilding !== undefined) { updates.push('[No Of claim Building] = @noOfClaimBuilding'); params.noOfClaimBuilding = policyData.noOfClaimBuilding; }
    } else if (policyData.propertyType === 'Fleet') {
      if (policyData.fleetPolicy !== undefined) { updates.push('[Fleet Policy] = @fleetPolicy'); params.fleetPolicy = policyData.fleetPolicy; }
      if (policyData.fleetPolicyLink !== undefined) { updates.push('[Fleet Policy Link] = @fleetPolicyLink'); params.fleetPolicyLink = policyData.fleetPolicyLink; }
      if (policyData.renewalDate2 !== undefined) { updates.push('[Renewal Date2] = @renewalDate2'); params.renewalDate2 = policyData.renewalDate2; }
      if (policyData.fleetPremiumPaid !== undefined) { updates.push('[Fleet Premium Paid] = @fleetPremiumPaid'); params.fleetPremiumPaid = policyData.fleetPremiumPaid; }
      if (policyData.regNo2 !== undefined) { updates.push('[Reg No2] = @regNo2'); params.regNo2 = policyData.regNo2; }
      if (policyData.fleetExcessPerClaim !== undefined) { updates.push('[Fleet Excess Per claim ] = @fleetExcessPerClaim'); params.fleetExcessPerClaim = policyData.fleetExcessPerClaim; }
      if (policyData.noOfClaimMadeFleet !== undefined) { updates.push('[No Of claim made fleet] = @noOfClaimMadeFleet'); params.noOfClaimMadeFleet = policyData.noOfClaimMadeFleet; }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const query = `
      UPDATE Tbl_Insurance_Details_Facility
      SET ${updates.join(', ')}
      WHERE Id = @id
    `;

    const request = pool.request();
    Object.keys(params).forEach(key => {
      request.input(key, sql.NVarChar, params[key]);
    });

    await request.query(query);

    return res.status(200).json({ message: 'Policy updated successfully' });
  } catch (error) {
    console.error('Error updating policy:', error);
    return res.status(500).json({ error: 'Failed to update policy', details: error.message });
  }
};

// Get all distinct years from the database
exports.getAvailableYears = async (req, res) => {
  let pool;
  try {
    pool = await poolPromise;
    
    const query = `
      SELECT DISTINCT [Year ] as year
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE [Year ] IS NOT NULL AND LTRIM(RTRIM([Year ])) <> ''
      ORDER BY [Year ] DESC
    `;
    
    const result = await pool.request().query(query);
    
    const years = result.recordset.map(row => row.year);
    
    return res.json({ years });
  } catch (error) {
    console.error('Error fetching available years:', error);
    return res.status(500).json({ error: 'Failed to fetch available years', details: error.message });
  }
};

// Get all policies for a company
exports.getCompanyPolicies = async (req, res) => {
  const { companyName } = req.params;
  const { renewalYear } = req.query;
  
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
    
    // Build the base query with new table structure
    let query = `
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
        [Year ] AS renewalYear
      FROM Tbl_Insurance_Details_Facility WITH (NOLOCK)
      WHERE [Company Name] = @companyName
    `;
    
    // Add year filter if provided - using [Year ] field (note the trailing space)
    if (renewalYear) {
      query += ` AND [Year ] = @renewalYear`;
    }
    
    query += ` ORDER BY [Company Name]`;
    
    const request = pool.request();
    request.input("companyName", sql.NVarChar(255), decodedCompany);
    
    if (renewalYear) {
      request.input("renewalYear", sql.NVarChar(50), renewalYear);
    }
    
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