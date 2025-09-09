import React, { useState, useRef, useEffect } from 'react'
import TrackableLink from './TrackableLink'

const StoreLinksPopup = ({ storeUrls, sneakerContext }) => {
  const [isOpen, setIsOpen] = useState(false)
  const popupRef = useRef(null)

  // Filter out empty store URLs
  const availableStores = Object.entries(storeUrls).filter(([_, url]) => url && url.trim() !== '')

  // Don't render if no stores are available
  if (availableStores.length === 0) {
    return null
  }

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const storeLabels = {
    ebay: 'eBay',
    stockx: 'StockX',
    goat: 'GOAT',
    amazon: 'Amazon'
  }

  const storeIcons = {
    ebay: '🛒',
    stockx: '📈',
    goat: '🐐',
    amazon: '📦'
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="store-links-container" ref={popupRef}>
      <button
        className="store-links-button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        🛒 Buy This Shoe
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="store-links-popup">
          {availableStores.map(([store, url]) => (
            <TrackableLink
              key={store}
              href={url}
              eventCategory="ecommerce"
              eventLabel={storeLabels[store]}
              className="store-link"
              sneakerContext={sneakerContext}
            >
              {storeIcons[store]} {storeLabels[store]}
            </TrackableLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default StoreLinksPopup
