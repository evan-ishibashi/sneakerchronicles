import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { sneakerPosts } from '../data/sneakers/index.js'
import { useGA4 } from '../hooks/useGA4'
import LazyImage from './LazyImage'
import sneakerImage from '../assets/nike-tom-sachs-overshoe-sfb-sole-swapped-side-2-optimized.jpg'

// Sneaker Card Component (memoized for performance)
const SneakerCard = React.memo(({ sneaker, onSneakerClick }) => (
  <Link
    to={`/sneaker/${sneaker.slug}`}
    className="sneaker-card"
    onClick={() => onSneakerClick(sneaker)}
  >
    <div className="sneaker-image">
      <LazyImage
        src={sneaker.image}
        alt={sneaker.title}
        width={600}
        quality={85}
        loading="lazy"
      />
    </div>
    <div className="sneaker-info">
      <h3 className="sneaker-title">{sneaker.title}</h3>
      <p className="sneaker-description">{sneaker.description}</p>
    </div>
  </Link>
));

// Homepage Component
function HomePage() {
  const { trackSneakerClick } = useGA4();

  // Memoize current date calculation
  const currentDate = useMemo(() => {
    const today = new Date()
    return today.toISOString().split('T')[0] // Returns YYYY-MM-DD format
  }, [])

  // Memoize published posts filtering
  const publishedPosts = useMemo(() => {
    return sneakerPosts.filter(sneaker => {
      return sneaker.releaseDate <= currentDate
    })
  }, [currentDate])

  // Memoize click handler
  const handleSneakerClick = useMemo(() => (sneaker) => {
    trackSneakerClick(sneaker.id, sneaker.title);
  }, [trackSneakerClick])

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <LazyImage
              src={sneakerImage}
              alt="Sneaker Chronicles Logo"
              className="brand-logo"
              width={400}
              quality={90}
              loading="eager"
            />
          </div>
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
              <SneakerCard
                key={sneaker.id}
                sneaker={sneaker}
                onSneakerClick={handleSneakerClick}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
