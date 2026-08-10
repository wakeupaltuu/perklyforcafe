import { useCallback, useEffect, useState } from 'react';
import { addDoc, collection, doc, getDocs, limit, onSnapshot, query, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Redemption, Reward } from '@/types';

const EXPIRY_MINUTES = 10;

const createCode = () => String(Math.floor(100000 + Math.random() * 900000));

const requirementsFor = (reward: Reward): Record<string, unknown> | undefined => {
  if (reward.requirements) return reward.requirements;
  if (reward.type !== 'buy_x_get_y') return undefined;
  return {
    buyQuantity: reward.buyQuantity,
    buyItemName: reward.buyItemName,
    getQuantity: reward.getQuantity,
    getItemName: reward.getItemName,
  };
};

export function useRewardRedemption(cafeSlug?: string, userId?: string, points = 0) {
  const [redemption, setRedemption] = useState<Redemption | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen only to the voucher the customer is currently showing.
  useEffect(() => {
    if (!cafeSlug || !redemption?.id) return;
    const unsubscribe = onSnapshot(doc(db, 'cafes', cafeSlug, 'redemptions', redemption.id), snapshot => {
      if (snapshot.exists()) setRedemption({ id: snapshot.id, ...snapshot.data() } as Redemption);
    });
    return unsubscribe;
  }, [cafeSlug, redemption?.id]);

  const createRedemption = useCallback(async (reward: Reward) => {
    if (!cafeSlug || !userId) {
      setError('Please sign in to redeem this reward.');
      return;
    }
    if (reward.pointsRequired > 0 && points < reward.pointsRequired) {
      setError(`You need ${reward.pointsRequired - points} more points for this reward.`);
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const redemptions = collection(db, 'cafes', cafeSlug, 'redemptions');
      const existing = await getDocs(query(redemptions, where('userId', '==', userId), where('rewardId', '==', reward.id), where('status', '==', 'pending'), limit(1)));
      if (!existing.empty) {
        const active = existing.docs[0];
        setRedemption({ id: active.id, ...active.data() } as Redemption);
        return;
      }
      // If there's an expired redemption, allow creating a new one (points were never deducted)
      const expiredCheck = await getDocs(query(redemptions, where('userId', '==', userId), where('rewardId', '==', reward.id), where('status', '==', 'expired'), limit(1)));
      if (!expiredCheck.empty) {
        // Expired redemption exists but wasn't used, so customer can try again
        // Fall through to create a new redemption
      }
      if (reward.maxRedemptionsPerCustomer !== undefined) {
        const prior = await getDocs(query(redemptions, where('userId', '==', userId), where('rewardId', '==', reward.id)));
        const completedCount = prior.docs.filter(item => item.data().status === 'completed').length;
        if (completedCount >= reward.maxRedemptionsPerCustomer) {
          setError('You have already used all available redemptions for this reward.');
          return;
        }
      }
      const expiresAt = Timestamp.fromMillis(Date.now() + EXPIRY_MINUTES * 60_000);
      const redemptionCode = createCode();
      const docRef = await addDoc(redemptions, {
        userId,
        rewardId: reward.id,
        rewardTitle: reward.title,
        rewardType: reward.type,
        pointsRequired: reward.pointsRequired || 0,
        status: 'pending',
        createdAt: serverTimestamp(),
        expiresAt,
        redemptionCode,
        requirements: requirementsFor(reward) || null,
      });
      setRedemption({ id: docRef.id, userId, rewardId: reward.id, rewardTitle: reward.title, rewardType: reward.type, pointsRequired: reward.pointsRequired || 0, status: 'pending', expiresAt, redemptionCode });
    } catch (cause) {
      console.error('Unable to create redemption:', cause);
      setError('Unable to create your voucher. Please try again.');
    } finally {
      setCreating(false);
    }
  }, [cafeSlug, points, userId]);

  return { redemption, creating, error, clearError: () => setError(null), closeRedemption: () => setRedemption(null), createRedemption };
}
