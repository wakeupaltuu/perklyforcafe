import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CafeDetails } from '@/types';

const cafeDetailsCache = new Map<string, CafeDetails | null>();
const cafeDetailsRequests = new Map<string, Promise<CafeDetails | null>>();

async function fetchCafeDetails(cafeSlug: string): Promise<CafeDetails | null> {
  if (cafeDetailsCache.has(cafeSlug)) {
    return cafeDetailsCache.get(cafeSlug) ?? null;
  }

  const existingRequest = cafeDetailsRequests.get(cafeSlug);
  if (existingRequest) {
    return existingRequest;
  }

  if (!db) {
    cafeDetailsCache.set(cafeSlug, null);
    return null;
  }

  const request = getDoc(doc(db, 'cafes', cafeSlug, 'details', 'info'))
    .then((detailsSnap) => {
      const details = detailsSnap.exists() ? (detailsSnap.data() as CafeDetails) : null;
      cafeDetailsCache.set(cafeSlug, details);
      return details;
    })
    .finally(() => {
      cafeDetailsRequests.delete(cafeSlug);
    });

  cafeDetailsRequests.set(cafeSlug, request);
  return request;
}

export function useCafeDetails(cafeSlug?: string) {
  const [cafeDetails, setCafeDetails] = useState<CafeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cafeSlug || !db) {
      setCafeDetails(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    const loadCafeDetails = async () => {
      if (cafeDetailsCache.has(cafeSlug)) {
        setCafeDetails(cafeDetailsCache.get(cafeSlug) ?? null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const details = await fetchCafeDetails(cafeSlug);

        if (!isActive) return;

        setCafeDetails(details);
      } catch (err) {
        console.error('Error loading cafe details:', err);

        if (isActive) {
          setCafeDetails(null);
          setError("Cafe details couldn't be loaded right now.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadCafeDetails();

    return () => {
      isActive = false;
    };
  }, [cafeSlug]);

  return {
    cafeDetails,
    loading,
    error,
  };
}
