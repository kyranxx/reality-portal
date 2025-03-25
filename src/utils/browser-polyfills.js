/**
 * Comprehensive Browser Globals Polyfill for Server Environment
 * 
 * This file provides safe fallbacks for all common browser-specific globals
 * that might be referenced in code running on the server.
 */

// Only apply polyfills in a Node.js environment (server-side)
if (typeof window === 'undefined') {
  // Create a minimal window-like object for browser code
  const noop = () => {};
  const noopObject = () => ({});
  
  // Provide 'self' and 'window' globals
  if (typeof global.self === 'undefined') {
    global.self = global;
  }
  
  if (typeof global.window === 'undefined') {
    global.window = global;
  }
  
  // Document object
  if (typeof global.document === 'undefined') {
    global.document = {
      createElement: () => ({}),
      getElementsByTagName: () => [],
      querySelector: () => null,
      querySelectorAll: () => [],
      documentElement: {},
      head: {},
      body: {},
      createTextNode: () => ({}),
      addEventListener: noop,
      removeEventListener: noop,
      // Add more document properties as needed
    };
  }
  
  // Navigator object
  if (typeof global.navigator === 'undefined') {
    global.navigator = {
      userAgent: 'Node.js Server Environment',
      language: 'en-US',
      languages: ['en-US'],
      platform: 'server',
      // Add more navigator properties as needed
    };
  }
  
  // LocalStorage and SessionStorage
  if (typeof global.localStorage === 'undefined') {
    const createStorage = () => {
      const storage = {};
      return {
        getItem: (key) => storage[key] || null,
        setItem: (key, value) => { storage[key] = String(value); },
        removeItem: (key) => { delete storage[key]; },
        clear: () => { Object.keys(storage).forEach(key => { delete storage[key]; }); },
        key: (index) => Object.keys(storage)[index] || null,
        get length() { return Object.keys(storage).length; }
      };
    };
    
    global.localStorage = createStorage();
    global.sessionStorage = createStorage();
  }
  
  // Other common browser globals
  if (typeof global.fetch === 'undefined') {
    global.fetch = () => Promise.resolve({
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      ok: true,
      status: 200,
      headers: new Map()
    });
  }
  
  // Add any other browser globals that might be referenced in your code
  global.requestAnimationFrame = noop;
  global.cancelAnimationFrame = noop;
}

// Export a dummy function so this can be imported in any file
export default function ensurePolyfills() {
  // This function doesn't need to do anything
  // The polyfills are applied when the file is imported
  return true;
}
