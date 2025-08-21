const sql = require('mssql');
const { poolPromise } = require('../db');



// Get all claims
exports.getAllClaims = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Claims');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get claim by ID
exports.getClaimById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('claimId', sql.Int, id)
      .query('SELECT * FROM Claims WHERE claimId = @claimId');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new claim
// exports.createClaim = async (req, res) => {
//   const {
//     claimType, claimAmount,companyName,policyName,
//     Description, incidentDate
//   } = req.body;

//   const parsedClaimAmount = Number(claimAmount);
//   if (!claimAmount || isNaN(parsedClaimAmount)) {
//     return res.status(400).json({ error: "Invalid claimAmount. Must be a valid number or decimal." });
//   }

//   console.log('claimAmount:', claimAmount, typeof claimAmount);
//   // If a file was uploaded, use its path; otherwise, use the value from the body
//   let supportingDocuments = req.body.supportingDocuments;
//   if (req.file) {
//     // Store relative path for portability
//     supportingDocuments = `/uploads/claims/${req.file.filename}`;
//   }
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request()
//       .input('companyName', sql.NVarChar, companyName)
//       .input('policyName', sql.NVarChar, policyName)
//       .input('claimType', sql.NVarChar, claimType)
//       .input('claimAmount', sql.Decimal(18,2), parsedClaimAmount)
//       .input('Description', sql.NVarChar, Description)
//       .input('incidentDate', sql.DateTime, incidentDate)
//       .input('supportingDocuments', sql.NVarChar, supportingDocuments)
//       .query(`INSERT INTO Claims (companyName,policyName,claimType, claimAmount, Description, incidentDate, supportingDocuments, createdAt, updatedAt)
//         VALUES (@policyName, @companyName, @claimType, @claimAmount, @Description, @incidentDate, @supportingDocuments, GETDATE(), GETDATE());
//         SELECT SCOPE_IDENTITY() AS claimId;`);
//     res.status(200).json({ message: "claim created successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.createClaim = async (req, res) => {
  try {
    const {
      claimType, claimAmount, companyName, policyName,
      Description, incidentDate
    } = req.body;

    const supportingDocuments = req.file ? req.file.filename : null;

    const pool = await poolPromise;

    // Insert into DB here...
    const result = await pool.request()
      .input('claimType', sql.VarChar, claimType)
      .input('claimAmount', sql.Decimal(10, 2), claimAmount)
      .input('companyName', sql.VarChar, companyName)
      .input('policyName', sql.VarChar, policyName)
      .input('Description', sql.VarChar, Description)
      .input('incidentDate', sql.Date, incidentDate)
      .input('supportingDocuments', sql.VarChar, supportingDocuments)
      .query(`INSERT INTO Claims 
              (claimType, claimAmount, companyName, policyName, Description, incidentDate, supportingDocuments) 
              OUTPUT INSERTED.claimID
              VALUES (@claimType, @claimAmount, @companyName, @policyName, @Description, @incidentDate, @supportingDocuments)`);

    const insertedId = result.recordset[0].id;

    res.status(201).json({
      message: 'Claim created successfully',
      claimId: insertedId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create claim' });
  }
};


// Update claim
exports.updateClaim = async (req, res) => {
  const { claimId } = req.params;
  const {
    companyId, policyId, claimType, claimAmount,
    Description, incidentDate, netClaimAmount, status, supportingDocuments
  } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('claimId', sql.Int, claimId)
      .input('companyId', sql.Int, companyId)
      .input('companyName', sql.NVarChar, companyName)
      .input('policyId', sql.Int, policyId)
      .input('policyName', sql.NVarChar, policyName)
      .input('claimType', sql.NVarChar, claimType)
      .input('claimAmount', sql.Decimal(18,2), claimAmount)
      .input('Description', sql.NVarChar, Description)
      .input('incidentDate', sql.DateTime, incidentDate)
      .input('netClaimAmount', sql.Decimal(18,2), netClaimAmount)
      .input('status', sql.NVarChar, status)
      .input('supportingDocuments', sql.NVarChar, supportingDocuments)
      .query(`UPDATE Claims SET companyId=@companyId, policyId=@policyId, companyName=@companyName, claimType=@claimType, claimAmount=@claimAmount, Description=@Description, incidentDate=@incidentDate, netClaimAmount=@netClaimAmount, status=@status, supportingDocuments=@supportingDocuments, updatedAt=GETDATE() WHERE claimId=@claimId`);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json({ message: 'Claim updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Delete claim
// exports.deleteClaim = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const pool = await poolPromise;
//     const result = await pool.request()
//       .input('claimId', sql.Int, id)
//       .query('DELETE FROM Claims WHERE claimId = @claimId');
//     if (result.rowsAffected[0] === 0) {
//       return res.status(404).json({ error: 'Claim not found' });
//     }
//     res.json({ message: 'Claim deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
