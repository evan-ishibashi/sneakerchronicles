import { Link } from 'react-router-dom'
import { sneakerPosts } from '../data/sneakerData.jsx'

// Homepage Component
function HomePage() {
  // Filter posts to only show those that have been released (including today)
  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0] // Returns YYYY-MM-DD format
  }

  const currentDate = getCurrentDate()

  const publishedPosts = sneakerPosts.filter(sneaker => {
    // Show posts that are released today or earlier
    return sneaker.releaseDate <= currentDate
  })

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="brand-title">Sneaker Chronicles</h1>
          <p className="brand-subtitle">Discover. Research. Collect.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <h2 className="section-title">Latest Features</h2>
          <div className="sneaker-grid">
            {publishedPosts.map((sneaker) => (
              <Link key={sneaker.id} to={`/sneaker/${sneaker.id}`} className="sneaker-card">
                <div className="sneaker-image">
                  <img src={sneaker.image} alt={sneaker.title} />
                </div>
                <div className="sneaker-info">
                  <h3 className="sneaker-title">{sneaker.title}</h3>
                  <p className="sneaker-description">{sneaker.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
