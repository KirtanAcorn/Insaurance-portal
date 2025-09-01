// policyController.js
const { getConnection } = require('../db');
const sql = require('mssql');

// Get all policies for a company and year
exports.getPoliciesByCompanyAndYear = async (req, res) => {
  const { companyId, year } = req.params;
  
  try {
    const request = await getConnection();
    const query = `
      SELECT * 
      FROM [dbo].[Tbl_Insurance_Details_Facility]
      WHERE [Id] = @companyId 
      AND ([Renewal Year] = @year OR @year = 'all')
    `;
    
    const result = await request
      .input('companyId', sql.Int, companyId)
      .input('year', sql.VarChar(10), year)
      .query(query);
      
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No policies found for the selected company and year' });
    }
    
    // Transform the data to match frontend requirements
    const policies = result.recordset.map(policy => ({
      id: policy.Id,
      companyName: policy['Company Name'],
      country: policy.Country,
      regAddress: policy['Reg Address'],
      warehouseAddress: policy['Warehouse/Office Address/es'],
      regNo: policy['Reg No'],
      regDate: policy['Reg Date'],
      firstTimePolicy: policy['Company first Time Policy'],
      directorName: policy['Director/Owner Name'],
      handledBy: policy['Company Handle By'],
      vatNumber: policy['VAT Number'],
      commodity: policy['Comodity'],
      currency: policy.Currency,
      turnover: policy['Turnover in £ Mn'],
      insuranceAgent: policy['Insurance Agent'],
      accountHandler: policy['A/C HANDLER'],
      employeeCount: policy['Emp Count'],
      
      // Commercial Policy Section
      commercialPolicy: {
        policyNumber: policy['Commercial Policy'],
        renewalDate: policy['Commercial Renewal Date'],
        policyLink: policy['Commercial Policy Link'],
        premiumPaid: policy['Commercial Premium Paid'],
        employeeLiability: policy['Employee Liability Cover'],
        employeeLiabilityRenewal: policy['Emp_Liabality Renewal Date'],
        floatingStock: policy['Floting stock'],
        stockCover: policy['Stock Cover'],
        stockLocation: policy['Stock Location'],
        productLiability: policy['Product Liability'],
        excessPerClaim: policy['Commercial Excess Per claim'],
        claimCount: policy['No Of claim Commercial']
      },
      
      // Marine Policy Section
      marinePolicy: {
        policyNumber: policy.Marine,
        policyLink: policy['Marine Policy Link'],
        renewalDate: policy['Marine Renewal'],
        premiumPaid: policy['Marine Premium Paid'],
        perTransitCover: policy['Per Transit Cover'],
        sameCountryCover: policy['UK-UK/EU-EU/USA-USA'],
        ukEuCover: policy['UK-EU'],
        internationalCover: policy['UK-USA/MiddelEast'],
        worldwideCover: policy['UK-ROW/USA-ROW'],
        crossVoyage: policy['CROSS VOYAGE'],
        transportModes: policy['AIR/SEA/RAIL'],
        roadCover: policy.ROAD,
        transitLocations: policy['ANYONE LOACTION IN ORDINARY COURSE OF TRANSIT'],
        excessPerClaim: policy['Cargo Excess Excess Per claim'],
        claimCount: policy['No Of claim Cargo']
      },
      
      // Building Policy Section
      buildingPolicy: {
        policyNumber: policy['Building Insurance'],
        policyLink: policy['Property Policy Link'],
        renewalDate: policy['Renewal Date'],
        premiumPaid: policy['Building Premium Paid'],
        sumAssured: policy['Sume Assure(Value of )Premises'],
        declaredValue: policy['Declare Value'],
        location: policy['Building Location'],
        excessPerClaim: policy['Building Excess Per claim'],
        claimCount: policy['No Of claim Building']
      },
      
      // Fleet Policy Section
      fleetPolicy: {
        policyNumber: policy['Fleet Policy'],
        policyLink: policy['Fleet Policy Link'],
        renewalDate: policy['Renewal Date2'],
        premiumPaid: policy['Fleet Premium Paid'],
        registrationNumber: policy['Reg No2'],
        excessPerClaim: policy['Fleet Excess Per claim '],
        claimCount: policy['No Of claim made fleet']
      },
      
      // Additional Info
      renewalYear: policy['Renewal Year']
    }));
    
    res.json(policies);
  } catch (err) {
    console.error('Error fetching policies:', err);
    res.status(500).json({ error: 'Server error while fetching policies' });
  }
};

// @desc    Get all companies with optional year filter
// @route   GET /api/policies/companies
// @access  Private
exports.getCompanies = async (req, res) => {
  try {
    const { renewalYear } = req.query;
    const request = await getConnection();
    
    let query = `
      SELECT DISTINCT 
        [Id] as id,
        [Company Name] as name,
        [Renewal Year] as renewalYear
      FROM [dbo].[Tbl_Insurance_Details_Facility]
    `;
    
    if (renewalYear) {
      query += ' WHERE [Renewal Year] = @renewalYear';
    }
    
    query += ' ORDER BY [Company Name]';
    
    const result = await request
      .input('renewalYear', sql.VarChar(10), renewalYear || null)
      .query(query);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

// @desc    Get company details by ID
// @route   GET /api/policies/company/:id
// @access  Private
exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await getConnection();
    
    const result = await request
      .input('id', sql.Int, id)
      .query(`
        SELECT TOP 1 * 
        FROM [dbo].[Tbl_Insurance_Details_Facility]
        WHERE [Id] = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching company details:', err);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
};

// @desc    Get company details by name and year
// @route   GET /api/policies/company-details
// @access  Private
exports.getCompanyDetails = async (req, res) => {
  const { companyName, renewalYear } = req.query;
  
  if (!companyName || !renewalYear) {
    return res.status(400).json({ error: 'Company name and renewal year are required' });
  }

  try {
    const request = await getConnection();
    
    const result = await request
      .input('companyName', sql.NVarChar, companyName.trim())
      .input('renewalYear', sql.VarChar, renewalYear.trim())
      .query(`
        SELECT TOP 1 * 
        FROM [dbo].[Tbl_Insurance_Details_Facility]
        WHERE RTRIM(LTRIM([Company Name])) = RTRIM(LTRIM(@companyName))
        AND RTRIM(LTRIM([Renewal Year])) = RTRIM(LTRIM(@renewalYear))
        ORDER BY [Id] DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'No matching records found' });
    }

    const data = result.recordset[0];
    
    // Transform the data into a structured format for the frontend
    const response = {
      companyInfo: {
        id: data.Id,
        name: data['Company Name'],
        regAddress: data['Reg Address'],
        warehouseAddress: data['Warehouse/Office Address/es'],
        regNo: data['Reg No'],
        vatNumber: data['VAT Number'],
        directorName: data['Director/Owner Name'],
        insuranceAgent: data['Insurance Agent'],
        employeeCount: data['Emp Count'],
        turnover: data['Turnover in £ Mn'],
        renewalYear: data['Renewal Year']
      },
      policies: {
        property: {
          policyNumber: data['Building Insurance'],
          policyLink: data['Property Policy Link'],
          renewalDate: data['Renewal Date'],
          premiumPaid: data['Building Premium Paid'],
          sumAssured: data['Sume Assure(Value of )Premises'],
          location: data['Building Location'],
          excessPerClaim: data['Building Excess Per claim'],
          claimsCount: data['No Of claim Building']
        },
        commercial: {
          policyNumber: data['Commercial Policy'],
          policyLink: data['Commercial Policy Link'],
          renewalDate: data['Commercial Renewal Date'],
          premiumPaid: data['Commercial Premium Paid'],
          employeeLiability: data['Employee Liability Cover'],
          stockCover: data['Stock Cover'],
          stockLocation: data['Stock Location'],
          productLiability: data['Product Liability'],
          excessPerClaim: data['Commercial Excess Per claim'],
          claimsCount: data['No Of claim Commercial']
        },
        marine: {
          policyNumber: data['Marine'],
          policyLink: data['Marine Policy Link'],
          renewalDate: data['Marine Renewal'],
          premiumPaid: data['Marine Premium Paid'],
          perTransitCover: data['Per Transit Cover'],
          sameCountryCover: data['UK-UK/EU-EU/USA-USA'],
          ukEuCover: data['UK-EU'],
          internationalCover: data['UK-USA/MiddelEast'],
          worldwideCover: data['UK-ROW/USA-ROW'],
          crossVoyage: data['CROSS VOYAGE'],
          transportModes: data['AIR/SEA/RAIL'],
          roadCover: data['ROAD'],
          transitLocations: data['ANYONE LOACTION IN ORDINARY COURSE OF TRANSIT'],
          excessPerClaim: data['Cargo Excess Excess Per claim'],
          claimsCount: data['No Of claim Cargo']
        },
        fleet: {
          policyNumber: data['Fleet Policy'],
          policyLink: data['Fleet Policy Link'],
          renewalDate: data['Renewal Date2'],
          premiumPaid: data['Fleet Premium Paid'],
          registrationNumber: data['Reg No2'],
          excessPerClaim: data['Fleet Excess Per claim '],
          claimsCount: data['No Of claim made fleet']
        }
      }
    };
    
    res.json(response);
  } catch (err) {
    console.error('Error fetching company details:', err);
    res.status(500).json({ error: 'Server error while fetching company details' });
  }
};

// @desc    Get policy summary for dashboard
// @route   GET /api/policies/summary
// @access  Private
exports.getPolicySummary = async (req, res) => {
  try {
    const request = await getConnection();
    
    const query = `
      SELECT 
        COUNT(DISTINCT [Company Name]) as totalCompanies,
        COUNT([Building Insurance]) as propertyPolicies,
        COUNT([Commercial Policy]) as commercialPolicies,
        COUNT([Marine]) as marinePolicies,
        COUNT([Fleet Policy]) as fleetPolicies,
        [Renewal Year] as renewalYear
      FROM [dbo].[Tbl_Insurance_Details_Facility]
      GROUP BY [Renewal Year]
      ORDER BY [Renewal Year] DESC
    `;
    
    const result = await request.query(query);
    
    res.json({
      summary: result.recordset[0] || {},
      recentPolicies: []
    });
  } catch (err) {
    console.error('Error fetching policy summary:', err);
    res.status(500).json({ error: 'Failed to fetch policy summary' });
  }
};