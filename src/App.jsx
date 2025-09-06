import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './components/HomePage'
import SneakerDetail from './components/SneakerDetail'
import ScrollToTop from './components/ScrollToTop'
import { useGA4 } from './hooks/useGA4'

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
  useGA4();

  return (
    <>
      <ScrollToTop />
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sneaker/:id" element={<SneakerDetail />} />
        </Routes>
      </div>
    </>
  )
}

export default App
