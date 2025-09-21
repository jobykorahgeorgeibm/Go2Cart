// App configuration
// This script dynamically loads the app version from package.json

// Initialize with a default version in case fetch fails
let APP_VERSION = '1.0.7';

// Function to initialize Instana with the correct version
function initInstana() {
  if (typeof ineum === 'function') {
    ineum('meta', 'app-version', APP_VERSION);
  }
}

// Try to fetch the version from the server
fetch('package.json')
  .then(response => response.json())
  .then(data => {
    // Update version if package.json was successfully loaded
    if (data && data.version) {
      APP_VERSION = data.version;
      // Re-initialize Instana with the updated version if ineum is available
      if (typeof ineum === 'function') {
        initInstana();
      }
    }
  })
  .catch(error => {
    console.warn('Could not load version from package.json:', error);
  });

// Export configuration
window.APP_CONFIG = {
  version: APP_VERSION,
  initInstana: initInstana
};

// Made with Bob
