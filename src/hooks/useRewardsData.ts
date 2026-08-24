import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Reward } from '@/types';

const rewardsCache = new Map<string, Reward[]>();
const rewardsRequests = new Map<string, Promise<Reward[]>>();

async function fetchRewardsData(cafeSlug: string): Promise<Reward[]> {
  const cached = rewardsCache.get(cafeSlug);
  if (cached) {
    return cached;
  }

  const existingRequest = rewardsRequests.get(cafeSlug);
  if (existingRequest) {
    return existingRequest;
  }

  if (!db) {
    return [];
  }

  const request = getDocs(collection(db, 'cafes', cafeSlug, 'rewards'))
    .then((rewardsSnap) => {
      const data = rewardsSnap.docs.map((rewardDoc) => ({
        id: rewardDoc.id,
        ...rewardDoc.data(),
      } as Reward));

      rewardsCache.set(cafeSlug, data);
      return data;
    })
    .finally(() => {
      rewardsRequests.delete(cafeSlug);
    });

  rewardsRequests.set(cafeSlug, request);
  return request;
}

export function useRewardsData(cafeSlug?: string) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cafeSlug || !db) {
      setRewards([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    const loadRewardsData = async () => {
      if (rewardsCache.has(cafeSlug)) {
        setRewards(rewardsCache.get(cafeSlug) ?? []);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchRewardsData(cafeSlug);

        if (!isActive) return;

        setRewards(data);
      } catch (err) {
        console.error('Error loading rewards data:', err);

        if (isActive) {
          setRewards([]);
          setError("Rewards couldn't be loaded right now.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadRewardsData();

    return () => {
      isActive = false;
    };
  }, [cafeSlug]);

  return {
    rewards,
    loading,
    error,
  };
}
