const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testLogin(email, password, role) {
    try {
        console.log(`Testing login for ${email} with expected role: ${role}...`);
        const res = await axios.post(`${API_URL}/auth/login`, { email, password, role });
        console.log(`✅ Login SUCCESS for ${role}\n`);
        return res.data.token;
    } catch (error) {
        console.log(`❌ Login FAILED as expected: ${error.response?.data?.message || error.message}\n`);
        return null;
    }
}

async function testProtectedRoute(token, route, roleName) {
    try {
        console.log(`Testing access to ${route} with ${roleName} token...`);
        await axios.get(`${API_URL}${route}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Access GRANTED to ${route}\n`);
    } catch (error) {
        console.log(`❌ Access DENIED to ${route}: ${error.response?.status} ${error.response?.data?.message || ''}\n`);
    }
}

async function runTests() {
    console.log('--- STARTING RESTRICTED LOGIN TESTS ---\n');

    // 1. Test Admin Login correctly
    const adminToken = await testLogin('admin@gym.com', 'admin123', 'admin');

    // 2. Test Admin Login with WRONG role (trying to login as member)
    await testLogin('admin@gym.com', 'admin123', 'member');

    // 3. Test Admin accessing Admin stats
    if (adminToken) {
        await testProtectedRoute(adminToken, '/admin/stats', 'Admin');
    }

    // 4. Test (Stub) Member Login - assuming existence or common pattern
    // If I don't have a member, I'll just skip or use a fake token to test 403
    
    // Test unauthorized access if possible
    await testProtectedRoute(adminToken, '/trainer/sessions', 'Admin (trying trainer route)');

    console.log('--- TESTS COMPLETED ---');
}

runTests();
