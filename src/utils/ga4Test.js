// GA4 Testing Utilities
// Use these functions to test GA4 implementation in development

import { isGA4Available } from '../config/ga4';

// Test if GA4 is properly loaded
export const testGA4Connection = () => {
  console.log('🔍 Testing GA4 Connection...');

  if (isGA4Available()) {
    console.log('✅ GA4 is available and ready');
    console.log('📊 gtag function:', typeof window.gtag);
    console.log('📈 dataLayer:', window.dataLayer);
    return true;
  } else {
    console.log('❌ GA4 is not available');
    console.log('💡 Make sure to replace GA_MEASUREMENT_ID with your actual ID');
    return false;
  }
};

// Test event tracking
export const testEventTracking = () => {
  if (!isGA4Available()) {
    console.log('❌ Cannot test events - GA4 not available');
    return;
  }

  console.log('🧪 Testing GA4 Event Tracking...');

  // Test a simple event
  window.gtag('event', 'test_event', {
    event_category: 'testing',
    event_label: 'manual_test',
    test_value: 'success'
  });

  console.log('✅ Test event sent to GA4');
  console.log('📊 Check GA4 DebugView to see the event');
};

// Test page view tracking
export const testPageView = (pagePath = '/test-page') => {
  if (!isGA4Available()) {
    console.log('❌ Cannot test page view - GA4 not available');
    return;
  }

  console.log('🧪 Testing GA4 Page View...');

  window.gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: pagePath,
  });

  console.log('✅ Test page view sent to GA4');
  console.log('📊 Check GA4 DebugView to see the page view');
};

// Run all tests
export const runAllTests = () => {
  console.log('🚀 Running GA4 Implementation Tests');
  console.log('=====================================');

  const isConnected = testGA4Connection();

  if (isConnected) {
    testEventTracking();
    testPageView();
    console.log('=====================================');
    console.log('✅ All tests completed!');
    console.log('📊 Check your GA4 DebugView for real-time results');
  } else {
    console.log('=====================================');
    console.log('❌ Tests failed - fix GA4 setup first');
  }
};

// Make functions available in browser console for testing
if (typeof window !== 'undefined') {
  window.ga4Test = {
    testConnection: testGA4Connection,
    testEvents: testEventTracking,
    testPageView: testPageView,
    runAll: runAllTests
  };

  console.log('🧪 GA4 Test utilities loaded!');
  console.log('💡 Use window.ga4Test.runAll() to test your implementation');
}
