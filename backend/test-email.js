require('dotenv').config();
const { sendClaimAssignmentEmail } = require('./services/emailService');

// Test email configuration
const testEmail = async () => {
  console.log('🧪 Testing Email Configuration...\n');
  console.log('Email Settings:');
  console.log('- Host:', process.env.EMAIL_HOST);
  console.log('- Port:', process.env.EMAIL_PORT);
  console.log('- User:', process.env.EMAIL_USER);
  console.log('- Password:', process.env.EMAIL_PASSWORD ? '***configured***' : '❌ NOT SET');
  console.log('\n');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Error: EMAIL_USER or EMAIL_PASSWORD not configured in .env file');
    console.log('\nPlease update your .env file with:');
    console.log('EMAIL_HOST=smtp.office365.com');
    console.log('EMAIL_PORT=587');
    console.log('EMAIL_USER=your-email@outlook.com');
    console.log('EMAIL_PASSWORD=your-password');
    return;
  }

  // Replace this with your test recipient email
  const testRecipientEmail = process.env.EMAIL_USER; // Sending to yourself for testing
  
  console.log(`📧 Sending test email to: ${testRecipientEmail}\n`);

  try {
    const result = await sendClaimAssignmentEmail(
      testRecipientEmail,
      'Test User',
      {
        claimId: 999,
        companyName: 'Test Company Ltd',
        policyName: 'Property Insurance',
        claimType: 'Fire Damage',
        claimAmount: 50000,
        status: 'Approved',
        incidentDate: new Date(),
        description: 'This is a test claim to verify email functionality. If you receive this email, your email configuration is working correctly!',
      }
    );

    if (result.success) {
      console.log('✅ SUCCESS! Email sent successfully!');
      console.log('📬 Message ID:', result.messageId);
      console.log('\n✨ Check your inbox at:', testRecipientEmail);
      console.log('💡 If you don\'t see it, check your spam/junk folder');
    } else {
      console.error('❌ FAILED! Email could not be sent');
      console.error('Error:', result.error);
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Verify your EMAIL_USER and EMAIL_PASSWORD are correct');
      console.log('2. If using 2FA, make sure you\'re using an App Password');
      console.log('3. Check if SMTP AUTH is enabled in Office 365 settings');
      console.log('4. Verify your firewall isn\'t blocking port 587');
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('\n🔧 Common issues:');
    console.log('- Invalid credentials: Check EMAIL_USER and EMAIL_PASSWORD');
    console.log('- Authentication failed: Use App Password if 2FA is enabled');
    console.log('- Connection timeout: Check firewall or try different port');
    console.log('- SMTP not enabled: Enable SMTP AUTH in Office 365 admin');
  }
};

// Run the test
testEmail();
