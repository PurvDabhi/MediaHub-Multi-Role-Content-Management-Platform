const axios = require('axios');

const API_URL = 'http://localhost:8000/api';

async function testAuth() {
  try {
    console.log('🔐 Testing login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@mediahub.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAuth();