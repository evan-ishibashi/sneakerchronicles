import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './components/HomePage'
import SneakerDetail from './components/SneakerDetail'

// Main App Component
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sneaker/:id" element={<SneakerDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
