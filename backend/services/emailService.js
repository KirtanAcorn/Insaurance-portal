const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.office365.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

// Send claim assignment email
const sendClaimAssignmentEmail = async (userEmail, userName, claimDetails) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Insurance Portal" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `New Claim Assigned - Claim #${claimDetails.claimId}`,
      html: generateClaimAssignmentEmailTemplate(userName, claimDetails),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email template for claim assignment - Simple and Clean (matching new claim format)
const generateClaimAssignmentEmailTemplate = (userName, claimDetails) => {
  const {
    claimId,
    companyId,
    companyName,
    policyId,
    policyName,
    claimType,
    claimAmount,
    excess,
    netAmount,
    status,
    incidentDate,
    description,
    supportingDocuments,
    createdAt,
  } = claimDetails;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Claim Assigned</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border: 1px solid #ddd;
        }
        .header {
          background-color: #0066cc;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 15px;
          color: #333;
        }
        .message {
          font-size: 15px;
          margin-bottom: 25px;
          color: #555;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background-color: #f0f0f0;
          padding: 10px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #ddd;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        .label {
          font-weight: 600;
          color: #666;
          width: 40%;
        }
        .value {
          color: #333;
        }
        .description-box {
          background-color: #f9f9f9;
          border-left: 3px solid #0066cc;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          background-color: #f0f0f0;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
        }
        .footer p {
          margin: 6px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>Claim Assigned to You</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="greeting">
            Hello ${userName},
          </div>

          <p class="message">
            A claim has been assigned to you for review and processing. Please review the details below.
          </p>

          <!-- Claim Details Table -->
          <table>
            <tr>
              <th colspan="2">Claim Information</th>
            </tr>
            <tr>
              <td class="label">Claim ID:</td>
              <td class="value"><strong>${claimId || 'N/A'}</strong></td>
            </tr>
            ${companyId ? `
            <tr>
              <td class="label">Company ID:</td>
              <td class="value">${companyId}</td>
            </tr>
            ` : ''}
            <tr>
              <td class="label">Company Name:</td>
              <td class="value">${companyName || 'N/A'}</td>
            </tr>
            ${policyId ? `
            <tr>
              <td class="label">Policy ID:</td>
              <td class="value">${policyId}</td>
            </tr>
            ` : ''}
            <tr>
              <td class="label">Policy Name:</td>
              <td class="value">${policyName || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">Claim Type:</td>
              <td class="value">${claimType || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">Status:</td>
              <td class="value">${status || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">Incident Date:</td>
              <td class="value">${incidentDate ? new Date(incidentDate).toLocaleDateString('en-GB') : 'N/A'}</td>
            </tr>
            ${createdAt ? `
            <tr>
              <td class="label">Created At:</td>
              <td class="value">${new Date(createdAt).toLocaleString('en-GB')}</td>
            </tr>
            ` : ''}
          </table>

          <!-- Financial Details Table -->
          <table>
            <tr>
              <th colspan="2">Financial Details</th>
            </tr>
            <tr>
              <td class="label">Claim Amount:</td>
              <td class="value"><strong>£${parseFloat(claimAmount || 0).toFixed(2)}</strong></td>
            </tr>
            ${excess ? `
            <tr>
              <td class="label">Excess:</td>
              <td class="value">£${parseFloat(excess || 0).toFixed(2)}</td>
            </tr>
            ` : ''}
            ${netAmount ? `
            <tr>
              <td class="label">Net Amount:</td>
              <td class="value"><strong>£${parseFloat(netAmount || 0).toFixed(2)}</strong></td>
            </tr>
            ` : ''}
          </table>

          ${description ? `
          <div class="description-box">
            <strong>Description:</strong><br>
            ${description}
          </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>Insurance Portal</strong></p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send new claim creation notification email
const sendNewClaimNotificationEmail = async (claimDetails) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Insurance Portal" <${process.env.EMAIL_USER}>`,
      to: 'facilities.uk@astutehealthcare.co.uk',
      subject: `New Claim Created - Claim #${claimDetails.claimId} | ${claimDetails.companyName}`,
      html: generateNewClaimEmailTemplate(claimDetails),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('New claim notification email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending new claim notification email:', error);
    return { success: false, error: error.message };
  }
};

// Email template for new claim creation - Simple and Clean
const generateNewClaimEmailTemplate = (claimDetails) => {
  const {
    claimId,
    companyId,
    companyName,
    policyId,
    policyName,
    assignedToUserID,
    claimType,
    claimAmount,
    excess,
    netAmount,
    description,
    status,
    incidentDate,
    supportingDocuments,
    createdAt,
  } = claimDetails;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Claim Created</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border: 1px solid #ddd;
        }
        .header {
          background-color: #0066cc;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
        }
        .content {
          padding: 30px;
        }
        .message {
          font-size: 15px;
          margin-bottom: 25px;
          color: #555;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th {
          background-color: #f0f0f0;
          padding: 10px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #ddd;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        .label {
          font-weight: 600;
          color: #666;
          width: 40%;
        }
        .value {
          color: #333;
        }
        .description-box {
          background-color: #f9f9f9;
          border-left: 3px solid #0066cc;
          padding: 15px;
          margin: 20px 0;
        }
        .footer {
          background-color: #f0f0f0;
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>New Claim Created</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <p class="message">
            A new insurance claim has been submitted. Please review the details below.
          </p>

          <!-- Claim Details Table -->
          <table>
            <tr>
              <th colspan="2">Claim Information</th>
            </tr>
            <tr>
              <td class="label">Claim ID:</td>
              <td class="value"><strong>${claimId || 'N/A'}</strong></td>
            </tr>
            ${companyId ? `
            <tr>
              <td class="label">Company ID:</td>
              <td class="value">${companyId}</td>
            </tr>
            ` : ''}
            <tr>
              <td class="label">Company Name:</td>
              <td class="value">${companyName || 'N/A'}</td>
            </tr>
            ${policyId ? `
            <tr>
              <td class="label">Policy ID:</td>
              <td class="value">${policyId}</td>
            </tr>
            ` : ''}
            <tr>
              <td class="label">Policy Name:</td>
              <td class="value">${policyName || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">Claim Type:</td>
              <td class="value">${claimType || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">Status:</td>
              <td class="value">${status || 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">Incident Date:</td>
              <td class="value">${incidentDate ? new Date(incidentDate).toLocaleDateString('en-GB') : 'N/A'}</td>
            </tr>
            <tr>
              <td class="label">Created At:</td>
              <td class="value">${createdAt ? new Date(createdAt).toLocaleString('en-GB') : new Date().toLocaleString('en-GB')}</td>
            </tr>
            ${assignedToUserID ? `
            <tr>
              <td class="label">Assigned To User ID:</td>
              <td class="value">${assignedToUserID}</td>
            </tr>
            ` : ''}
          </table>

          <!-- Financial Details Table -->
          <table>
            <tr>
              <th colspan="2">Financial Details</th>
            </tr>
            <tr>
              <td class="label">Claim Amount:</td>
              <td class="value"><strong>£${parseFloat(claimAmount || 0).toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td class="label">Excess:</td>
              <td class="value">£${parseFloat(excess || 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label">Net Amount:</td>
              <td class="value"><strong>£${parseFloat(netAmount || 0).toFixed(2)}</strong></td>
            </tr>
          </table>

          ${description ? `
          <div class="description-box">
            <strong>Description:</strong><br>
            ${description}
          </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>Insurance Portal</strong></p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendClaimAssignmentEmail,
  sendNewClaimNotificationEmail,
};
