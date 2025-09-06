// Google Analytics 4 Configuration
export const GA4_CONFIG = {
  // Your GA4 Measurement ID
  MEASUREMENT_ID: 'G-15LPF4XP8X',

  // Development mode - set to false in production
  DEBUG_MODE: process.env.NODE_ENV === 'development',
};

// Helper function to get the measurement ID
export const getMeasurementId = () => {
  return GA4_CONFIG.MEASUREMENT_ID;
};

// Helper function to check if GA4 is available
export const isGA4Available = () => {
  return typeof window !== 'undefined' && window.gtag;
};
