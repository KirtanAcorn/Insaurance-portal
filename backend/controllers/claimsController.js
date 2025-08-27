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

// Create a new claim
exports.createClaim = async (req, res) => {
  try {
    const {
      claimType, claimAmount, companyName, policyName,
      description, incidentDate, excess, netAmount, status
    } = req.body;

    // Handle file upload
    const supportingDocuments = req.file ? req.file.filename : null;

    // Validate and format incidentDate
    const incidentDateForDB = incidentDate ? new Date(incidentDate) : null;

    const pool = await poolPromise;

    // Insert into DB
    const result = await pool.request()
      .input('claimType', sql.VarChar, claimType)
      .input('claimAmount', sql.Decimal(10, 2), claimAmount)
      .input('companyName', sql.VarChar, companyName)
      .input('policyName', sql.VarChar, policyName)
      .input('description', sql.VarChar, description)
      .input('incidentDate', sql.Date, incidentDateForDB)
      .input('excess', sql.Decimal(10, 2), excess)
      .input('netAmount', sql.Decimal(10, 2), netAmount)
      .input('status', sql.VarChar, status)
      .input('supportingDocuments', sql.VarChar, supportingDocuments)
      .query(`INSERT INTO Claims
              (claimType, claimAmount, companyName, policyName, description, incidentDate, supportingDocuments, excess, netAmount, status)
              OUTPUT INSERTED.claimID
              VALUES (@claimType, @claimAmount, @companyName, @policyName, @description, @incidentDate, @supportingDocuments, @excess, @netAmount, @status)`);

    const insertedId = result.recordset[0].claimID;

    res.status(201).json({
      message: 'Claim created successfully',
      claimId: insertedId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create claim', details: err.message });
  }
};

// Update an existing claim
exports.updateClaim = async (req, res) => {
  const { claimId } = req.params;
  const {
    companyId, policyId, companyName, policyName, claimType, claimAmount,
    description, incidentDate, excess, netAmount, status
  } = req.body;

  // Handle file upload for supporting documents if present, otherwise keep the existing one
  const supportingDocuments = req.file ? req.file.filename : req.body.supportingDocuments;

  try {
    const pool = await poolPromise;
    
    // Validate and format incidentDate to prevent "Invalid date" error
    const incidentDateForDB = incidentDate ? new Date(incidentDate) : null;

    const request = pool.request()
      .input('claimId', sql.Int, claimId)
      .input('companyId', sql.Int, companyId)
      .input('companyName', sql.VarChar, companyName)
      .input('policyId', sql.Int, policyId)
      .input('policyName', sql.VarChar, policyName)
      .input('claimType', sql.VarChar, claimType)
      .input('claimAmount', sql.Decimal(10, 2), claimAmount)
      .input('description', sql.VarChar, description)
      .input('incidentDate', sql.Date, incidentDateForDB)
      .input('excess', sql.Decimal(10, 2), excess)
      .input('netAmount', sql.Decimal(10, 2), netAmount)
      .input('status', sql.VarChar, status)
      .input('supportingDocuments', sql.VarChar, supportingDocuments);

    const query = `
      UPDATE Claims
      SET
        companyId = @companyId,
        policyId = @policyId,
        companyName = @companyName,
        policyName = @policyName,
        claimType = @claimType,
        claimAmount = @claimAmount,
        description = @description,
        incidentDate = @incidentDate,
        excess = @excess,
        netAmount = @netAmount,
        status = @status,
        supportingDocuments = @supportingDocuments,
        updatedAt = GETDATE()
      WHERE claimId = @claimId;
    `;
    
    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json({ message: 'Claim updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update claim', details: err.message });
  }
};

// Delete a claim
exports.deleteClaim = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('claimId', sql.Int, id)
      .query('DELETE FROM Claims WHERE claimId = @claimId');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json({ message: 'Claim deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};