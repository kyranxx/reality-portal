/**
 * Firebase Connection Monitor
 * 
 * This module provides connection monitoring and reconnection handling.
 */

import { getDatabase, ref, onValue, off, serverTimestamp, set } from 'firebase/database';
import { app } from './index';
import { isClient } from './config';

// Connection state tracking
let isConnected = false;
let connectionMonitorInitialized = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const CONNECTION_CHECK_INTERVAL = 10000; // 10 seconds
let connectionListeners: Array<(connected: boolean) => void> = [];
let connectionCheckInterval: NodeJS.Timeout | null = null;

/**
 * Initialize the connection monitor
 */
export function initializeConnection(): void {
  if (connectionMonitorInitialized || !isClient || !app) return;
  
  try {
    const db = getDatabase(app);
    const connectedRef = ref(db, '.info/connected');
    
    // Listen for connection state changes
    onValue(connectedRef, (snapshot) => {
      isConnected = !!snapshot.val();
      
      // Notify all listeners of connection state change
      notifyConnectionListeners();
      
      if (isConnected) {
        console.log('Firebase connection established');
        reconnectAttempts = 0;
        updateLastSeen();
      } else {
        console.log('Firebase connection lost');
        attemptReconnect();
      }
    });
    
    // Set up periodic connection check
    connectionCheckInterval = setInterval(checkConnection, CONNECTION_CHECK_INTERVAL);
    
    connectionMonitorInitialized = true;
    console.log('Firebase connection monitor initialized');
  } catch (error) {
    console.error('Failed to initialize Firebase connection monitor:', error);
  }
}

/**
 * Attempt to reconnect to Firebase
 */
function attemptReconnect(): void {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('Failed to reconnect to Firebase after maximum attempts');
    return;
  }
  
  reconnectAttempts++;
  console.log(`Attempting to reconnect to Firebase (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
  
  // Force refresh of Firebase connections
  try {
    const db = getDatabase(app);
    const testRef = ref(db, `connection-test/${new Date().getTime()}`);
    set(testRef, { timestamp: serverTimestamp() })
      .then(() => {
        console.log('Reconnection test successful');
        isConnected = true;
        notifyConnectionListeners();
      })
      .catch((error) => {
        console.error('Reconnection test failed:', error);
        // Schedule another reconnection attempt with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        setTimeout(attemptReconnect, delay);
      });
  } catch (error) {
    console.error('Error during reconnection attempt:', error);
  }
}

/**
 * Check current Firebase connection status
 */
function checkConnection(): void {
  if (!isConnected && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    attemptReconnect();
  }
}

/**
 * Update last seen timestamp
 */
function updateLastSeen(): void {
  if (!isConnected || !app) return;
  
  try {
    const db = getDatabase(app);
    const userId = getUserIdentifier();
    if (!userId) return;
    
    const lastSeenRef = ref(db, `client-status/${userId}`);
    set(lastSeenRef, { 
      lastSeen: serverTimestamp(),
      userAgent: navigator.userAgent,
      appVersion: '1.0.0'
    }).catch(error => {
      console.warn('Failed to update last seen status:', error);
    });
  } catch (error) {
    console.warn('Error updating last seen:', error);
  }
}

/**
 * Get a unique identifier for the current user
 */
function getUserIdentifier(): string {
  // Try to get the user's ID if authenticated
  try {
    const userId = localStorage.getItem('userId');
    if (userId) return userId;
  } catch (e) {
    // Ignore localStorage errors
  }
  
  // Generate and store a session ID if not available
  let sessionId = '';
  try {
    sessionId = localStorage.getItem('firebase_session_id') || '';
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('firebase_session_id', sessionId);
    }
  } catch (e) {
    // If localStorage fails, generate a temporary session ID
    sessionId = 'temp_' + Math.random().toString(36).substring(2, 15);
  }
  
  return sessionId;
}

/**
 * Register a listener for connection state changes
 */
export function onConnectionChange(listener: (connected: boolean) => void): () => void {
  connectionListeners.push(listener);
  
  // Call immediately with current state
  listener(isConnected);
  
  return () => {
    connectionListeners = connectionListeners.filter(l => l !== listener);
  };
}

/**
 * Notify all listeners of connection state change
 */
function notifyConnectionListeners(): void {
  connectionListeners.forEach(listener => {
    try {
      listener(isConnected);
    } catch (error) {
      console.error('Error in connection listener:', error);
    }
  });
}

/**
 * Clean up connection monitor
 */
export function cleanupConnectionMonitor(): void {
  if (!connectionMonitorInitialized) return;
  
  try {
    // Clear connection check interval
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval);
      connectionCheckInterval = null;
    }
    
    // Remove Firebase connection listener
    if (app) {
      const db = getDatabase(app);
      const connectedRef = ref(db, '.info/connected');
      off(connectedRef);
    }
    
    connectionListeners = [];
    connectionMonitorInitialized = false;
    console.log('Firebase connection monitor cleaned up');
  } catch (error) {
    console.error('Error cleaning up connection monitor:', error);
  }
}

/**
 * Get current connection state
 */
export function isFirebaseConnected(): boolean {
  return isConnected;
}
