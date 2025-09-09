import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSneakerData } from '../hooks/useSneakerData'
import { useDocumentHead } from '../hooks/useDocumentHead'
import TrackableLink from './TrackableLink'
import LazyImage from './LazyImage'

// Sneaker Detail Page Component
function SneakerDetail() {
  const { slug } = useParams()
  const { sneaker, loading, error } = useSneakerData(slug)

  // Memoize current date calculation
  const currentDate = useMemo(() => {
    const today = new Date()
    return today.toISOString().split('T')[0] // Returns YYYY-MM-DD format
  }, [])

  // Set up dynamic meta tags for SEO - MUST be called before any early returns
  useDocumentHead({
    title: sneaker ? `${sneaker.title} | Sneaker Chronicles` : 'Sneaker Chronicles',
    description: sneaker ? `${sneaker.description} - Discover the story behind this rare sneaker collaboration. Read our in-depth analysis of design, history, and cultural significance.` : 'Discover rare and exotic sneakers you\'ve never seen before',
    keywords: sneaker ? `${sneaker.title}, rare sneakers, Nike collaboration, limited edition sneakers, sneaker culture, ${sneaker.title.toLowerCase().replace(/\s+/g, ', ')}, exclusive sneakers, sneaker history` : 'sneakers, rare sneakers, limited edition, sneaker culture',
    image: sneaker?.image,
    url: sneaker ? `https://sneakerchronicles.com/sneaker/${sneaker.slug}` : 'https://sneakerchronicles.com'
  });

  // Show loading state
  if (loading) {
    return (
      <div className="sneaker-detail">
        <div className="container">
          <Link to="/" className="back-button">← Back to Home</Link>
          <div className="loading-message">
            <h1>Loading...</h1>
            <p>Fetching sneaker details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !sneaker) {
    return (
      <div className="sneaker-detail">
        <div className="container">
          <Link to="/" className="back-button">← Back to Home</Link>
          <div className="error-message">
            <h1>Sneaker Not Found</h1>
            <p>The sneaker you're looking for doesn't exist or couldn't be loaded.</p>
          </div>
        </div>
      </div>
    )
  }

  // Check if the post is published (including today)
  const isPublished = sneaker.releaseDate <= currentDate

  if (!isPublished) {
    return (
      <div className="sneaker-detail">
        <div className="container">
          <Link to="/" className="back-button">← Back to Home</Link>
          <div className="unpublished-message">
            <h1>Coming Soon</h1>
            <p>This post will be available on {sneaker.releaseDate}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sneaker-detail">
      <div className="container">
        <Link to="/" className="back-button">← Back to Home</Link>

        <div className="detail-content">
          <div className="detail-image">
            <LazyImage src={sneaker.image} alt={sneaker.title} />
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{sneaker.title}</h1>
            <p className="detail-description">{sneaker.description}</p>

            <div className="detail-links">
              {sneaker.instagramUrl && sneaker.instagramUrl !== "#" && (
                <TrackableLink
                  href={sneaker.instagramUrl}
                  eventCategory="social_media"
                  eventLabel="Instagram"
                  className="detail-link"
                >
                  📸 Instagram Post
                </TrackableLink>
              )}
              {sneaker.youtubeUrl && sneaker.youtubeUrl !== "#" && (
                <TrackableLink
                  href={sneaker.youtubeUrl}
                  eventCategory="social_media"
                  eventLabel="YouTube"
                  className="detail-link"
                >
                  🎥 YouTube Video
                </TrackableLink>
              )}
              {sneaker.ebayUrl && sneaker.ebayUrl !== "#" && (
                <TrackableLink
                  href={sneaker.ebayUrl}
                  eventCategory="ecommerce"
                  eventLabel="eBay"
                  className="detail-link"
                >
                  🛒 Find on eBay
                </TrackableLink>
              )}
            </div>
          </div>
        </div>

        {/* Blog Post Section */}
        <div className="blog-post-section">
          <div className="container">
            <h2 className="blog-title">Chronicle</h2>
            <div className="affiliate-disclosure">
              <p>This post may contain affiliate links. If you purchase through these links, I may earn a commission at no extra cost to you.</p>
            </div>
            <div className="blog-content">
              {sneaker.blogPost}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SneakerDetail
