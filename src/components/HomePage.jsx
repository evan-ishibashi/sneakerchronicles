import { Link } from 'react-router-dom'
import { sneakerPosts } from '../data/sneakerData'

// Homepage Component
function HomePage() {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="brand-title">SneakerChronicles</h1>
          <p className="brand-subtitle">Discover. Review. Collect.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <h2 className="section-title">Latest Drops</h2>
          <div className="sneaker-grid">
            {sneakerPosts.map((sneaker) => (
              <Link key={sneaker.id} to={`/sneaker/${sneaker.id}`} className="sneaker-card">
                <div className="sneaker-image">
                  <img src={sneaker.image} alt={sneaker.title} />
                </div>
                <div className="sneaker-info">
                  <h3 className="sneaker-title">{sneaker.title}</h3>
                  <p className="sneaker-date">{sneaker.releaseDate}</p>
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
