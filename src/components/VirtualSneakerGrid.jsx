import React, { useState, useEffect, useRef, useMemo } from 'react';
import LazyImage from './LazyImage';

// Virtual scrolling component for large sneaker lists
const VirtualSneakerGrid = ({
  sneakers,
  onSneakerClick,
  itemHeight = 300,
  containerHeight = 600,
  overscan = 5
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      sneakers.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, sneakers.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      if (sneakers[i]) {
        items.push({
          index: i,
          sneaker: sneakers[i],
          top: i * itemHeight
        });
      }
    }
    return items;
  }, [sneakers, visibleRange, itemHeight]);

  // Handle scroll
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  // Total height for the virtual container
  const totalHeight = sneakers.length * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      {/* Virtual container */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items */}
        {visibleItems.map(({ index, sneaker, top }) => (
          <div
            key={sneaker.id}
            style={{
              position: 'absolute',
              top: top,
              left: 0,
              right: 0,
              height: itemHeight,
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              boxSizing: 'border-box'
            }}
          >
            <div
              className="sneaker-card"
              onClick={() => onSneakerClick(sneaker)}
              style={{
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div className="sneaker-image" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <LazyImage
                  src={sneaker.image}
                  alt={sneaker.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="sneaker-info" style={{ padding: '10px 0' }}>
                <h3 className="sneaker-title" style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                  {sneaker.title}
                </h3>
                <p className="sneaker-description" style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                  {sneaker.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualSneakerGrid;
