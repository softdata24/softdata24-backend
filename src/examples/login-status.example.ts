/**
 * Example showing how to use the login status API
 * 
 * This example demonstrates how to check if a user is logged in or not
 * using the new /api/v1/users/current-user endpoint.
 */

import axios from 'axios';

// Example 1: Check login status when user is NOT logged in
async function checkLoginStatusWhenLoggedOut() {
  try {
    console.log('Checking login status when logged out...');
    
    const response = await axios.get('http://localhost:5000/api/v1/users/current-user');
    
    console.log('Response:', response.data);
    // Expected output: { isLoggedIn: false, message: "User is not logged in", ... }
  } catch (error: any) {
    console.error('Error checking login status:', error.message);
  }
}

// Example 2: Check login status when user IS logged in
async function checkLoginStatusWhenLoggedIn() {
  try {
    console.log('Checking login status when logged in...');
    
    // This assumes you have a valid access token in cookies
    const response = await axios.get('http://localhost:5000/api/v1/users/current-user', {
      withCredentials: true, // Important: includes cookies in the request
    });
    
    console.log('Response:', response.data);
    // Expected output: { isLoggedIn: true, user: { ...user_data... }, message: "User is logged in", ... }
  } catch (error: any) {
    console.error('Error checking login status:', error.message);
  }
}

// Example 3: Logout functionality
async function logoutUser() {
  try {
    console.log('Logging out user...');
    
    const response = await axios.post('http://localhost:5000/api/v1/users/logout', {}, {
      withCredentials: true, // Important: includes cookies in the request
    });
    
    console.log('Logout response:', response.data);
    // Expected output: { message: "Logged out successfully", ... }
  } catch (error: any) {
    console.error('Error logging out:', error.message);
  }
}

// Usage examples:
console.log('Login Status API Usage Examples:');
console.log('=================================');

// Check current login status
checkLoginStatusWhenLoggedOut();

// For checking when logged in, you would first need to:
// 1. Login using /api/v1/auth/login to get a cookie
// 2. Then call the current-user endpoint with cookies enabled