import React, { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSneakerData } from '../hooks/useSneakerData'
import { useDocumentHead } from '../hooks/useDocumentHead'
import { useGA4 } from '../hooks/useGA4'
import TrackableLink from './TrackableLink'
import LazyImage from './LazyImage'
import StoreLinksPopup from './StoreLinksPopup'

// Sneaker Detail Page Component
function SneakerDetail() {
  const { slug } = useParams()
  const { sneaker, loading, error } = useSneakerData(slug)
  const { trackSneakerDetailView, trackBackNavigation, trackSneakerEngagement, trackImageInteraction } = useGA4()

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

  // Track sneaker detail page view when sneaker data is loaded
  useEffect(() => {
    if (sneaker && !loading && !error) {
      trackSneakerDetailView(
        sneaker.id,
        sneaker.title,
        sneaker.slug,
        sneaker.releaseDate
      );
    }
  }, [sneaker, loading, error, trackSneakerDetailView]);

  // Track engagement metrics
  useEffect(() => {
    if (!sneaker) return;

    let startTime = Date.now();
    let scrollDepth = 0;
    let maxScrollDepth = 0;

    // Track time spent on page
    const trackTimeSpent = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 0) {
        trackSneakerEngagement(sneaker.id, sneaker.title, 'time_spent', timeSpent);
      }
    };

    // Track scroll depth
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        trackSneakerEngagement(sneaker.id, sneaker.title, 'scroll_depth', scrollPercent);
      }
    };

    // Set up scroll tracking
    const handleScroll = () => {
      requestAnimationFrame(trackScrollDepth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track time spent when user leaves the page
    const handleBeforeUnload = () => {
      trackTimeSpent();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackTimeSpent();
    };
  }, [sneaker, trackSneakerEngagement]);

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
        <Link
          to="/"
          className="back-button"
          onClick={() => trackBackNavigation(`/sneaker/${sneaker?.slug}`, '/')}
        >
          ← Back to Home
        </Link>

        <div className="detail-content">
          <div className="detail-image">
            <LazyImage
              src={sneaker.image}
              alt={sneaker.title}
              onLoad={() => trackImageInteraction(sneaker.id, sneaker.title, 'image_loaded')}
              onClick={() => trackImageInteraction(sneaker.id, sneaker.title, 'image_clicked')}
            />
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
                  sneakerContext={{
                    sneakerId: sneaker.id,
                    sneakerTitle: sneaker.title,
                    sneakerSlug: sneaker.slug
                  }}
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
                  sneakerContext={{
                    sneakerId: sneaker.id,
                    sneakerTitle: sneaker.title,
                    sneakerSlug: sneaker.slug
                  }}
                >
                  🎥 YouTube Video
                </TrackableLink>
              )}
              <StoreLinksPopup
                storeUrls={sneaker.storeUrls}
                sneakerContext={{
                  sneakerId: sneaker.id,
                  sneakerTitle: sneaker.title,
                  sneakerSlug: sneaker.slug
                }}
              />
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
