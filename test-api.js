// Simple test script to verify API is working
// Run with: node test-api.js

const API_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Review Plugin API...\n');
  
  // Test 1: Health Check
  console.log('Test 1: Health Check');
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    if (data.success) {
      console.log('✅ PASS - Backend is running\n');
    } else {
      console.log('❌ FAIL - Backend returned error\n');
      return;
    }
  } catch (error) {
    console.log('❌ FAIL - Cannot connect to backend');
    console.log('   Make sure backend is running: node index.js\n');
    return;
  }
  
  // Test 2: Create Product
  console.log('Test 2: Create Product');
  try {
    const response = await fetch(`${API_URL}/api/products/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle: 'test-product-' + Date.now(),
        title: 'Test Product',
        image: 'https://example.com/image.jpg'
      })
    });
    const data = await response.json();
    if (data.success) {
      console.log('✅ PASS - Product created\n');
    } else {
      console.log('❌ FAIL - Product creation failed:', data.message, '\n');
    }
  } catch (error) {
    console.log('❌ FAIL - Product test error:', error.message, '\n');
  }
  
  // Test 3: Create User
  console.log('Test 3: Create User');
  try {
    const response = await fetch(`${API_URL}/api/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test' + Date.now() + '@example.com',
        name: 'Test User',
        password: 'test123',
        phoneNo: '1234567890'
      })
    });
    const data = await response.json();
    if (data.success) {
      console.log('✅ PASS - User created\n');
    } else {
      console.log('❌ FAIL - User creation failed:', data.message, '\n');
    }
  } catch (error) {
    console.log('❌ FAIL - User test error:', error.message, '\n');
  }
  
  // Test 4: Get All Reviews
  console.log('Test 4: Get Reviews');
  try {
    const response = await fetch(`${API_URL}/api/reviews/all`);
    const data = await response.json();
    if (data.success) {
      console.log(`✅ PASS - Found ${data.reviews.length} reviews\n`);
    } else {
      console.log('❌ FAIL - Reviews fetch failed\n');
    }
  } catch (error) {
    console.log('❌ FAIL - Reviews test error:', error.message, '\n');
  }
  
  console.log('✅ All tests completed!');
  console.log('\nIf all tests passed, your backend is ready!');
  console.log('Next: Start your frontend with "pnpm dev"\n');
}

testAPI();

