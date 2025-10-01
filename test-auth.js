// Simple test script to verify authentication
const axios = require('axios');

const API_URL = 'http://localhost:8000/api';

async function testAuth() {
  try {
    // Test server connection
    console.log('🔍 Testing server connection...');
    const testResponse = await axios.get(`${API_URL}/test`);
    console.log('✅ Server is running:', testResponse.data.message);

    // Test login
    console.log('\n🔐 Testing login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@mediahub.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user);
    console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');

    // Test protected route
    console.log('\n🛡️ Testing protected route...');
    const contentResponse = await axios.get(`${API_URL}/content`, {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`
      }
    });
    
    console.log('✅ Protected route accessible!');
    console.log('Content count:', contentResponse.data.length);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAuth();