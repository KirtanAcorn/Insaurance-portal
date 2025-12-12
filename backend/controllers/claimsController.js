const sql = require('mssql');
const { poolPromise } = require('../db');
const path = require('path');
const fs = require('fs');
const { sendClaimAssignmentEmail, sendNewClaimNotificationEmail } = require('../services/emailService');

// Get all claims
exports.getAllClaims = async (req, res) => {
  try {
    const { userRole, userEmail } = req.query;
    const pool = await poolPromise;
    
    let query = 'SELECT * FROM Claims';
    let request = pool.request();
    
    // Filter claims based on user role
    if (userRole === 'Client') {
      // Clients can only see their own claims
      query += ' WHERE createdByEmail = @userEmail';
      request.input('userEmail', sql.VarChar, userEmail);
    }
    // Admin and Team Member can see all claims (no WHERE clause needed)
    
    const result = await request.query(query);
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
    // For form-data, we need to parse the fields from req.body
    const {
      claimType, claimAmount, companyName, policyName,
      description, incidentDate, excess, netAmount, status,
      assignedToUserID, createdByEmail
    } = req.body;
    
    // Handle file upload
    const supportingDocuments = req.file ? req.file.filename : null;
    
    console.log('Form data received:', {
      claimType, claimAmount, companyName, policyName,
      description, incidentDate, excess, netAmount, status,
      hasFile: !!req.file
    });

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
      .input('assignedToUserID', sql.Int, assignedToUserID || null)
      .input('createdByEmail', sql.VarChar, createdByEmail)
      .query(`INSERT INTO Claims
              (claimType, claimAmount, companyName, policyName, description, incidentDate, supportingDocuments, excess, netAmount, status, assignedToUserID, createdByEmail)
              OUTPUT INSERTED.claimID
              VALUES (@claimType, @claimAmount, @companyName, @policyName, @description, @incidentDate, @supportingDocuments, @excess, @netAmount, @status, @assignedToUserID, @createdByEmail)`);

    const insertedId = result.recordset[0].claimID;

    // Fetch the complete claim record to send in email
    const claimRecord = await pool.request()
      .input('claimId', sql.Int, insertedId)
      .query('SELECT * FROM Claims WHERE claimId = @claimId');

    // Send email notification for new claim creation
    try {
      if (claimRecord.recordset.length > 0) {
        const claim = claimRecord.recordset[0];
        const emailResult = await sendNewClaimNotificationEmail({
          claimId: claim.claimId,
          companyId: claim.companyId,
          companyName: claim.companyName,
          policyId: claim.policyId,
          policyName: claim.policyName,
          assignedToUserID: claim.assignedToUserID,
          claimType: claim.claimType,
          claimAmount: claim.claimAmount,
          excess: claim.excess,
          netAmount: claim.netAmount,
          description: claim.description,
          status: claim.status,
          incidentDate: claim.incidentDate,
          supportingDocuments: claim.supportingDocuments,
          createdAt: claim.createdAt,
        });

        if (emailResult.success) {
          console.log(`New claim notification email sent successfully for Claim #${insertedId}`);
        } else {
          console.error(`Failed to send new claim notification email: ${emailResult.error}`);
        }
      }
    } catch (emailError) {
      // Log error but don't fail the claim creation
      console.error('Error sending new claim notification email:', emailError);
    }

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
  try {
    const { claimId } = req.params;
    const updateFields = [];
    const request = (await poolPromise).request();

    // Add claimId to inputs
    request.input('claimId', sql.Int, claimId);

    // Handle file upload for supporting documents if present, otherwise keep the existing one
    if (req.file) {
      updateFields.push('supportingDocuments = @supportingDocuments');
      request.input('supportingDocuments', sql.VarChar, req.file.filename);
    } else if (req.body.supportingDocuments !== undefined) {
      updateFields.push('supportingDocuments = @supportingDocuments');
      request.input('supportingDocuments', sql.VarChar, req.body.supportingDocuments);
    }

    // Helper function to add field to update
    const addField = (field, type, value) => {
      if (value !== undefined && value !== null) {
        updateFields.push(`${field} = @${field}`);
        request.input(field, type, value);
      }
    };

    // Add fields that are present in the request body
    if (req.body.companyId !== undefined) addField('companyId', sql.Int, parseInt(req.body.companyId));
    if (req.body.policyId !== undefined) addField('policyId', sql.Int, parseInt(req.body.policyId));
    if (req.body.companyName !== undefined) addField('companyName', sql.VarChar, req.body.companyName);
    if (req.body.policyName !== undefined) addField('policyName', sql.VarChar, req.body.policyName);
    if (req.body.claimType !== undefined) addField('claimType', sql.VarChar, req.body.claimType);
    if (req.body.claimAmount !== undefined) addField('claimAmount', sql.Decimal(10, 2), parseFloat(req.body.claimAmount));
    if (req.body.description !== undefined) addField('description', sql.VarChar, req.body.description);
    if (req.body.incidentDate !== undefined) {
      const dateValue = req.body.incidentDate ? new Date(req.body.incidentDate) : null;
      addField('incidentDate', sql.Date, dateValue);
    }
    if (req.body.excess !== undefined) addField('excess', sql.Decimal(10, 2), parseFloat(req.body.excess) || 0);
    if (req.body.netAmount !== undefined) addField('netAmount', sql.Decimal(10, 2), parseFloat(req.body.netAmount) || 0);
    if (req.body.status !== undefined) addField('status', sql.VarChar, req.body.status);
    if (req.body.assignedToUserID !== undefined) {
      // Convert empty string to null for the database
      const assignedToValue = req.body.assignedToUserID === '' ? null : parseInt(req.body.assignedToUserID);
      addField('assignedToUserID', sql.Int, assignedToValue);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add updatedAt
    updateFields.push('updatedAt = GETDATE()');

    const query = `
      UPDATE Claims
      SET ${updateFields.join(', ')}
      WHERE claimId = @claimId;
    `;

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Send email notification if a user is assigned (regardless of status)
    if (req.body.assignedToUserID && req.body.assignedToUserID !== '') {
      try {
        // Fetch user details - using SELECT * to get all columns
        const userResult = await (await poolPromise).request()
          .input('userId', sql.Int, parseInt(req.body.assignedToUserID))
          .query('SELECT * FROM Users_ WHERE id = @userId');

        if (userResult.recordset.length > 0) {
          const user = userResult.recordset[0];
          
          // Fetch complete claim details
          const claimResult = await (await poolPromise).request()
            .input('claimId', sql.Int, claimId)
            .query('SELECT * FROM Claims WHERE claimId = @claimId');

          if (claimResult.recordset.length > 0) {
            const claim = claimResult.recordset[0];
            
            // Build user name from available fields (handle different possible column names)
            const userName = user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.name || user.email || 'User';
            
            // Send email notification with all claim details
            const emailResult = await sendClaimAssignmentEmail(
              user.email,
              userName,
              {
                claimId: claim.claimId,
                companyId: claim.companyId,
                companyName: claim.companyName,
                policyId: claim.policyId,
                policyName: claim.policyName,
                claimType: claim.claimType,
                claimAmount: claim.claimAmount,
                excess: claim.excess,
                netAmount: claim.netAmount,
                status: claim.status,
                incidentDate: claim.incidentDate,
                description: claim.description,
                supportingDocuments: claim.supportingDocuments,
                createdAt: claim.createdAt,
              }
            );

            if (emailResult.success) {
              console.log(`Email sent successfully to ${user.email}`);
            } else {
              console.error(`Failed to send email: ${emailResult.error}`);
            }
          }
        }
      } catch (emailError) {
        // Log error but don't fail the update
        console.error('Error sending assignment email:', emailError);
      }
    }
    
    res.json({ message: 'Claim updated successfully' });
  } catch (err) {
    console.error('Error updating claim:', err);
    res.status(500).json({ error: 'Failed to update claim', details: err.message });
  }
};

// Delete a claim
exports.deleteClaim = async (req, res) => {
  const { claimId } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('claimId', sql.Int, claimId)
      .query('DELETE FROM Claims WHERE claimId = @claimId');
    
    res.json({ message: 'Claim deleted successfully' });
  } catch (err) {
    console.error('Error deleting claim:', err);
    res.status(500).json({ error: 'Failed to delete claim', details: err.message });
  }
};

// Serve document file
exports.serveDocument = (req, res) => {
  const { filename } = req.params;
  const { preview } = req.query;
  
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }
    
  const documentsPath = 'C:\\Users\\Priyal.Makwana\\Acorn Solution\\Facilities - Insurance_portal Claims';
  const filePath = path.join(documentsPath, filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Get file extension
  const ext = path.extname(filename).toLowerCase();
  
  // Define MIME types for different file extensions
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.csv': 'text/csv'
  };

  // Get the appropriate content type or default to octet-stream
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  if (preview === 'true' && ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(contentType)) {
    // For preview, send the file with appropriate headers for inline viewing
    const fileStream = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);
    
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);
    
    fileStream.pipe(res);
  } else {
    // For non-preview or unsupported preview types, force download
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error downloading file' });
        }
      }
    });
  }
};