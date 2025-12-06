require('dotenv').config();
const { sendNewClaimNotificationEmail } = require('./services/emailService');

// Test data for new claim notification - matching Claims table structure
const testClaimData = {
  claimId: 999,
  companyId: 1,
  companyName: 'Test Company Ltd',
  policyId: 5,
  policyName: 'Commercial Liability',
  assignedToUserID: null,
  claimType: 'Property Damage',
  claimAmount: 15000.00,
  excess: 500.00,
  netAmount: 14500.00,
  description: 'Water damage occurred in the warehouse due to a burst pipe. Immediate repairs required.',
  status: 'Pending',
  incidentDate: new Date('2024-12-01'),
  supportingDocuments: 'claim_doc_12345.pdf',
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log('Testing new claim notification email...');
console.log('Sending to: facilities.uk@astutehealthcare.co.uk');
console.log('---');

sendNewClaimNotificationEmail(testClaimData)
  .then(result => {
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Failed to send email');
      console.error('Error:', result.error);
    }
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
