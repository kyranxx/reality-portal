// Firebase Connection Test Script
// This script tests Firebase connectivity, authentication, and Firestore permissions

const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} = require('firebase/auth');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc 
} = require('firebase/firestore');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
let envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  envPath = path.resolve(process.cwd(), '.env');
}

if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.error('No .env or .env.local file found!');
  process.exit(1);
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if configuration is valid
function validateConfig() {
  console.log('\n=== Firebase Configuration Validation ===');
  
  let isValid = true;
  
  // Check required fields
  const requiredFields = ['apiKey', 'authDomain', 'projectId'];
  for (const field of requiredFields) {
    if (!firebaseConfig[field]) {
      console.error(`❌ Missing required field: ${field}`);
      isValid = false;
    } else {
      console.log(`✓ ${field}: ${firebaseConfig[field]}`);
    }
  }
  
  // Check if project ID matches the domain
  if (firebaseConfig.authDomain && firebaseConfig.projectId) {
    const expectedDomain = `${firebaseConfig.projectId}.firebaseapp.com`;
    if (firebaseConfig.authDomain !== expectedDomain) {
      console.warn(`⚠️ Project ID mismatch warning:`);
      console.warn(`  - Auth Domain: ${firebaseConfig.authDomain}`);
      console.warn(`  - Project ID: ${firebaseConfig.projectId}`);
      console.warn(`  - Expected Domain: ${expectedDomain}`);
    } else {
      console.log(`✓ Project ID matches Auth Domain`);
    }
  }
  
  if (!isValid) {
    console.error('❌ Firebase configuration validation failed!');
    process.exit(1);
  }
  
  console.log('✓ Firebase configuration is valid');
  return true;
}

async function testFirebaseConnection() {
  console.log('\n=== Firebase Connection Test ===');
  
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✓ Firebase app initialized');
    
    // Test authentication
    const auth = getAuth(app);
    console.log('✓ Auth service initialized');
    
    // Test Firestore
    const db = getFirestore(app);
    console.log('✓ Firestore service initialized');
    
    // Test anonymous authentication
    console.log('\n=== Testing Anonymous Authentication ===');
    let user = null;
    
    try {
      const userCred = await signInAnonymously(auth);
      user = userCred.user;
      console.log(`✓ Anonymous authentication successful (UID: ${user.uid})`);
    } catch (authError) {
      console.error('❌ Anonymous authentication failed:', authError.message);
      console.error('  Code:', authError.code);
      console.log('Continuing tests without authentication (using public access rules)...');
    }
    
    // Test Firestore access
    console.log('\n=== Testing Firestore Access ===');
    
    try {
      // Try to get properties collection
      console.log('- Testing "properties" collection access...');
      const propertiesSnapshot = await getDocs(collection(db, 'properties'));
      console.log(`✓ Successfully accessed "properties" collection (${propertiesSnapshot.docs.length} documents found)`);
    } catch (firestoreError) {
      console.error(`❌ Failed to access "properties" collection:`, firestoreError.message);
      console.error('  Code:', firestoreError.code);
      console.log('\n=== Firestore Rules Troubleshooting ===');
      console.log('1. Verify your Firebase project ID is correct in .env.local');
      console.log('2. Check that your rules have been deployed correctly');
      console.log('3. If using the Firebase console, ensure you are in the correct project');
      return false;
    }
    
    console.log('\n✅ All tests passed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase general error:', error);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Firebase Connection Test');
  console.log('=======================');
  console.log(`Time: ${new Date().toLocaleString()}`);
  
  if (validateConfig()) {
    await testFirebaseConnection();
  }
}

runTests().catch(console.error);
