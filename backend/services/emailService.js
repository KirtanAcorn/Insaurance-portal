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

// Email template for claim assignment
const generateClaimAssignmentEmailTemplate = (userName, claimDetails) => {
  const {
    claimId,
    companyName,
    policyName,
    claimType,
    claimAmount,
    status,
    incidentDate,
    description,
  } = claimDetails;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Claim Assignment Notification</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px 20px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #555;
          margin-bottom: 25px;
          line-height: 1.8;
        }
        .claim-details {
          background-color: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .claim-details h2 {
          margin: 0 0 15px;
          font-size: 18px;
          color: #333;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #555;
          flex: 0 0 40%;
        }
        .detail-value {
          color: #333;
          flex: 0 0 60%;
          text-align: right;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-approved {
          background-color: #d4edda;
          color: #155724;
        }
        .status-pending {
          background-color: #fff3cd;
          color: #856404;
        }
        .status-review {
          background-color: #d1ecf1;
          color: #0c5460;
        }
        .description-box {
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
          padding: 15px;
          margin: 15px 0;
          border-radius: 4px;
          font-size: 14px;
          color: #555;
          line-height: 1.6;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        .cta-button:hover {
          opacity: 0.9;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #777;
          border-top: 1px solid #e0e0e0;
        }
        .footer p {
          margin: 5px 0;
        }
        .divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🔔 New Claim Assignment</h1>
          <p>Insurance Portal - Claims Management System</p>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="greeting">
            Hello ${userName},
          </div>

          <div class="message">
            A new insurance claim has been assigned to you for review and processing. Please review the details below and take appropriate action.
          </div>

          <!-- Claim Details -->
          <div class="claim-details">
            <h2>📋 Claim Details</h2>
            
            <div class="detail-row">
              <span class="detail-label">Claim ID:</span>
              <span class="detail-value"><strong>#${claimId}</strong></span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Company Name:</span>
              <span class="detail-value">${companyName || 'N/A'}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Policy Type:</span>
              <span class="detail-value">${policyName || 'N/A'}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Claim Type:</span>
              <span class="detail-value">${claimType || 'N/A'}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Claim Amount:</span>
              <span class="detail-value"><strong>£${parseFloat(claimAmount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value">
                <span class="status-badge ${status === 'Approved' ? 'status-approved' : status === 'Pending' ? 'status-pending' : 'status-review'}">
                  ${status || 'Under Review'}
                </span>
              </span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Incident Date:</span>
              <span class="detail-value">${incidentDate ? new Date(incidentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span>
            </div>
          </div>

          ${description ? `
          <div class="description-box">
            <strong>Incident Description:</strong><br>
            ${description}
          </div>
          ` : ''}

          <div class="divider"></div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/claims" class="cta-button">
              View Claim Details
            </a>
          </div>

          <div class="message" style="margin-top: 25px; font-size: 14px; color: #777;">
            <strong>Next Steps:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Review the claim details thoroughly</li>
              <li>Verify all supporting documents</li>
              <li>Contact the claimant if additional information is needed</li>
              <li>Update the claim status once processed</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>Insurance Portal</strong> - Next-Gen Insurance Management</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
          <p>If you have any questions, please contact your system administrator.</p>
          <p style="margin-top: 15px; color: #999;">
            © ${new Date().getFullYear()} Insurance Portal. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendClaimAssignmentEmail,
};
