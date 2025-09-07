import { useParams, Link } from 'react-router-dom'
import { sneakerData } from '../data/sneakerData.jsx'
import TrackableLink from './TrackableLink'

// Sneaker Detail Page Component
function SneakerDetail() {
  const { id } = useParams()
  const sneakerId = parseInt(id)

  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0] // Returns YYYY-MM-DD format
  }

  const currentDate = getCurrentDate()
  const sneaker = sneakerData[sneakerId] || sneakerData[1]

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
            <img src={sneaker.image} alt={sneaker.title} />
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
              <p>This post contains affiliate links. If you purchase through these links, I may earn a commission at no extra cost to you.</p>
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
