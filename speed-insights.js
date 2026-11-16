// Vercel Speed Insights - Standalone initialization script
// Based on @vercel/speed-insights v1.3.1

(function() {
  'use strict';
  
  // Initialize the queue for Speed Insights events
  function initQueue() {
    if (window.si) return;
    window.si = function() {
      (window.siq = window.siq || []).push(arguments);
    };
  }
  
  // Inject the Speed Insights script
  function injectSpeedInsights() {
    if (typeof window === 'undefined') return;
    
    initQueue();
    
    // Use Vercel's default script path
    const src = '/_vercel/speed-insights/script.js';
    
    // Check if script is already loaded
    if (document.head.querySelector(`script[src*="${src}"]`)) return;
    
    // Create and configure the script element
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.sdkn = '@vercel/speed-insights';
    script.dataset.sdkv = '1.3.1';
    
    script.onerror = function() {
      console.log(
        '[Vercel Speed Insights] Failed to load script from ' + src + 
        '. Please check if any content blockers are enabled and try again.'
      );
    };
    
    document.head.appendChild(script);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSpeedInsights);
  } else {
    injectSpeedInsights();
  }
})();
