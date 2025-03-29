/**
 * Auth Cookie Handler
 * 
 * Utilities for handling authentication with first-party cookies
 * to work with browsers that block third-party cookies
 */

// Handle cookie manipulation in a safe manner
export function setCookie(name: string, value: string, days: number = 30): void {
  // Only run on client
  if (typeof document === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  const sameSite = '; SameSite=Strict'; // Use Strict to ensure cookie only sent in first-party context
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  
  document.cookie = `${name}=${value}${expires}${sameSite}${secure}; path=/`;
}

export function getCookie(name: string): string | null {
  // Only run on client
  if (typeof document === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

export function deleteCookie(name: string): void {
  // Only run on client
  if (typeof document === 'undefined') return;
  
  // Set expiration to past date to delete
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Store auth tokens in first-party cookies and localStorage for redundancy
 * This ensures we maintain authentication even when third-party cookies are blocked
 */
export function storeAuthToken(token: string, refreshToken?: string): void {
  if (!token) return;
  
  // Store in first-party cookies
  setCookie('auth_token', token, 7); // 7 days expiry for main token
  
  if (refreshToken) {
    setCookie('refresh_token', refreshToken, 30); // 30 days for refresh token
  }
  
  // Redundant storage in localStorage (some browsers may clear this)
  try {
    localStorage.setItem('auth_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  } catch (e) {
    console.warn('Failed to store auth token in localStorage', e);
  }
}

/**
 * Get auth token from cookies or localStorage
 */
export function getAuthToken(): string | null {
  // First try to get from cookie (preferred)
  const cookieToken = getCookie('auth_token');
  if (cookieToken) return cookieToken;
  
  // Fall back to localStorage if cookie not found
  try {
    return localStorage.getItem('auth_token');
  } catch (e) {
    console.warn('Failed to read auth token from localStorage', e);
    return null;
  }
}

/**
 * Get refresh token from cookies or localStorage
 */
export function getRefreshToken(): string | null {
  // First try to get from cookie (preferred)
  const cookieToken = getCookie('refresh_token');
  if (cookieToken) return cookieToken;
  
  // Fall back to localStorage if cookie not found
  try {
    return localStorage.getItem('refresh_token');
  } catch (e) {
    console.warn('Failed to read refresh token from localStorage', e);
    return null;
  }
}

/**
 * Clear all auth tokens from cookies and localStorage
 */
export function clearAuthTokens(): void {
  // Clear from cookies
  deleteCookie('auth_token');
  deleteCookie('refresh_token');
  
  // Clear from localStorage
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  } catch (e) {
    console.warn('Failed to clear auth tokens from localStorage', e);
  }
}

/**
 * Configure Firebase Auth to use first-party cookies
 * This should be called before initializing Firebase
 */
export function configureAuthForFirstPartyCookies(): void {
  if (typeof window === 'undefined') return;
  
  // Set up custom persistence for Firebase Auth based on our first-party cookie handling
  try {
    const authTokens = {
      token: getAuthToken(),
      refreshToken: getRefreshToken()
    };
    
    // Store these for Firebase initialization to use
    (window as any).__auth_tokens = authTokens;
    
    // Also set a flag to configure Firebase Auth to use first-party cookies
    (window as any).__use_first_party_cookies = true;
  } catch (e) {
    console.error('Failed to configure auth for first-party cookies', e);
  }
}
