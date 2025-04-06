/**
 * Firebase Connection Test Script
 * 
 * This script tests connections to both Firestore and Realtime Database
 * to verify configuration and permissions are working correctly.
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { getDatabase, ref, onValue } = require('firebase/database');
require('dotenv').config({ path: '.env.local' });

// Use the environment variables or fallback to the correct regional URL
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 
               'https://realitny-portal-default-rtdb.europe-west1.firebasedatabase.app',
};

console.log('Initializing Firebase with config:', JSON.stringify(firebaseConfig, null, 2));
console.log('Database URL being used:', firebaseConfig.databaseURL);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Test Firestore Connection
async function testFirestore() {
  console.log('\n--- Testing Firestore Connection ---');
  try {
    const db = getFirestore(app);
    console.log('Firestore initialized successfully');
    
    try {
      const querySnapshot = await getDocs(collection(db, "properties"));
      console.log(`Successfully fetched ${querySnapshot.size} properties from Firestore`);
      
      if (querySnapshot.size > 0) {
        console.log('First property data:');
        console.log(JSON.stringify(querySnapshot.docs[0].data(), null, 2));
      }
    } catch (error) {
      console.error('Error fetching Firestore data:', error);
    }
  } catch (error) {
    console.error('Error initializing Firestore:', error);
  }
}

// Test Realtime Database Connection
function testRealtimeDB() {
  console.log('\n--- Testing Realtime Database Connection ---');
  try {
    const db = getDatabase(app);
    console.log('Realtime Database initialized successfully');
    
    const connectedRef = ref(db, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      const connected = !!snapshot.val();
      console.log(`Realtime Database connection status: ${connected ? 'CONNECTED' : 'DISCONNECTED'}`);
      
      if (connected) {
        console.log('Successfully connected to Realtime Database');
      } else {
        console.error('Failed to connect to Realtime Database');
      }
    });
  } catch (error) {
    console.error('Error initializing Realtime Database:', error);
  }
}

// Run tests
(async () => {
  try {
    await testFirestore();
    testRealtimeDB();
    
    // Keep process alive to see Realtime Database connection
    console.log('\nWaiting for Realtime Database connection...');
    setTimeout(() => {
      console.log('Test completed');
      process.exit(0);
    }, 5000);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
})();
