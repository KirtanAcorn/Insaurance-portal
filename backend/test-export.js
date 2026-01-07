// Test script for the export functionality
const axios = require('axios');

const testExport = async () => {
  try {
    console.log('Testing export functionality...');
    
    // Test with a sample admin user ID (you'll need to replace with actual admin user ID)
    const response = await axios.get('http://localhost:5000/api/policies/export?userId=1&renewalYear=2025-2026', {
      responseType: 'arraybuffer'
    });
    
    console.log('Export test successful!');
    console.log('Response headers:', response.headers);
    console.log('Data length:', response.data.length);
    
  } catch (error) {
    console.error('Export test failed:', error.response?.data || error.message);
  }
};

// Uncomment to run the test
// testExport();