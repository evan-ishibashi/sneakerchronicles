import { useState, useEffect, useCallback } from 'react';
import { findSneakerBySlug, getSneakerById } from '../data/sneakers/index.js';

// Custom hook for lazy loading sneaker data
export const useSneakerData = (identifier) => {
  const [sneaker, setSneaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSneaker = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let sneakerData;
      if (isNaN(identifier)) {
        // It's a slug
        sneakerData = await findSneakerBySlug(identifier);
      } else {
        // It's a numeric ID
        sneakerData = await getSneakerById(parseInt(identifier));
      }

      // Fallback to sneaker 1 if not found (backward compatibility)
      if (!sneakerData) {
        sneakerData = await getSneakerById(1);
      }

      setSneaker(sneakerData);
    } catch (err) {
      setError(err);
      console.error('Error loading sneaker data:', err);
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    if (identifier) {
      loadSneaker();
    }
  }, [identifier, loadSneaker]);

  return { sneaker, loading, error, refetch: loadSneaker };
};
