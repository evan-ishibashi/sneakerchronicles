import React, { useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './components/HomePage'
import SneakerDetail from './components/SneakerDetail'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import { useGA4 } from './hooks/useGA4'
import { useServiceWorker } from './hooks/useServiceWorker'
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor'

// Main App Component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

// App content component that uses GA4 hook inside Router context
function AppContent() {
  // Initialize GA4 tracking
  const { trackReferrer, trackUTMParameters } = useGA4();

  // Register service worker
  useServiceWorker();

  // Monitor performance metrics
  usePerformanceMonitor();

  // Track referrer and UTM parameters on app load
  useEffect(() => {
    trackReferrer();
    trackUTMParameters();
  }, [trackReferrer, trackUTMParameters]);

  return (
    <>
      <ScrollToTop />
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sneaker/:slug" element={<SneakerDetail />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
