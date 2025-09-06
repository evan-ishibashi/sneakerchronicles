import { useParams, Link } from 'react-router-dom'
import { sneakerData } from '../data/sneakerData'

// Sneaker Detail Page Component
function SneakerDetail() {
  const { id } = useParams()
  const sneakerId = parseInt(id)

  const sneaker = sneakerData[sneakerId] || sneakerData[1]

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
              <a href={sneaker.instagramUrl} target="_blank" rel="noopener noreferrer" className="detail-link">
                📸 Instagram Post
              </a>
              <a href={sneaker.youtubeUrl} target="_blank" rel="noopener noreferrer" className="detail-link">
                🎥 YouTube Review
              </a>
              <a href={sneaker.ebayUrl} target="_blank" rel="noopener noreferrer" className="detail-link">
                🛒 Find on eBay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SneakerDetail
