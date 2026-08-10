import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { adminDb } from './firebaseAdmin.js';

/**
 * Staff-facing confirmation endpoint. The dashboard can call this with the
 * staff member's Firebase ID token; the customer app never calls it.
 */

// CORS configuration: Allowed origins for the dashboard
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  // Add production dashboard URLs here when deployed
  'https://admin.cafeperkly.space',
  'https://cafeperkly.space',
];

const setCorsHeaders = (res: VercelResponse, origin?: string) => {
  // Allow any localhost origin for development
  const isLocalhost = origin?.startsWith('http://localhost:') ||
                      origin?.startsWith('http://127.0.0.1:');

  if (origin && (ALLOWED_ORIGINS.includes(origin) || isLocalhost)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours cache for preflight
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;

  // Handle CORS preflight request before any other logic
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res, origin);
    return res.status(200).end();
  }

  // Set CORS headers on all responses
  setCorsHeaders(res, origin);

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const { cafeId, redemptionId } = req.body || {};

  if (!token || typeof cafeId !== 'string' || typeof redemptionId !== 'string') {
    return res.status(400).json({ error: 'Missing confirmation details' });
  }

  try {
    // Verify staff Firebase token
    const staff = await getAuth().verifyIdToken(token);

    // A staff identity must be explicitly scoped to the target cafe.
    const allowedCafes = Array.isArray(staff.cafeIds)
      ? staff.cafeIds
      : staff.cafeId
        ? [staff.cafeId]
        : [];

    if (!staff.staff || !allowedCafes.includes(cafeId)) {
      return res.status(403).json({ error: 'Not authorised for this cafe' });
    }

    const result = await adminDb.runTransaction(async transaction => {
      // Get redemption document
      const redemptionRef = adminDb.doc(`cafes/${cafeId}/redemptions/${redemptionId}`);
      const redemptionSnap = await transaction.get(redemptionRef);

      if (!redemptionSnap.exists) {
        throw new Error('REDEMPTION_NOT_FOUND');
      }

      const redemption = redemptionSnap.data()!;

      // Check if redemption is pending
      if (redemption.status !== 'pending') {
        throw new Error('REDEMPTION_UNAVAILABLE');
      }

      // Check if redemption has expired
      if (!(redemption.expiresAt instanceof Timestamp) ||
          redemption.expiresAt.toMillis() <= Timestamp.now().toMillis()) {
        transaction.update(redemptionRef, { status: 'expired' });
        return { expired: true, pointsRequired: 0 };
      }

      // Get reward and user data
      const rewardRef = adminDb.doc(`cafes/${cafeId}/rewards/${redemption.rewardId}`);
      const userRef = adminDb.doc(`users_${cafeId}/${redemption.userId}`);

      const [rewardSnap, userSnap] = await Promise.all([
        transaction.get(rewardRef),
        transaction.get(userRef)
      ]);

      if (!rewardSnap.exists || !userSnap.exists) {
        throw new Error('REDEMPTION_INVALID');
      }

      const reward = rewardSnap.data()!;

      // Check if reward is active
      if (reward.isActive !== true) {
        throw new Error('REWARD_UNAVAILABLE');
      }

      // Check if user has enough points
      const pointsRequired = Number(reward.pointsRequired || 0);
      const userPoints = Number(userSnap.data()!.points || 0);

      if (userPoints < pointsRequired) {
        throw new Error('INSUFFICIENT_POINTS');
      }

      // Check redemption limit per customer
      if (reward.maxRedemptionsPerCustomer !== undefined) {
        const used = await transaction.get(
          adminDb.collection(`cafes/${cafeId}/redemptions`)
            .where('userId', '==', redemption.userId)
            .where('rewardId', '==', redemption.rewardId)
            .where('status', '==', 'completed')
        );

        if (used.size >= Number(reward.maxRedemptionsPerCustomer)) {
          throw new Error('REDEMPTION_LIMIT_REACHED');
        }
      }

      // Deduct points from user
      transaction.update(userRef, {
        points: FieldValue.increment(-pointsRequired)
      });

      // Update redemption to completed
      transaction.update(redemptionRef, {
        status: 'completed',
        completedAt: FieldValue.serverTimestamp(),
        verifiedBy: staff.uid,
        pointsRequired: pointsRequired,
        rewardTitle: reward.title,
        rewardType: reward.type,
      });

      return { expired: false, pointsRequired };
    });

    if (result.expired) {
      return res.status(409).json({ error: 'REDEMPTION_EXPIRED' });
    }

    return res.status(200).json({
      success: true,
      status: 'completed',
      pointsDeducted: result.pointsRequired,
    });

  } catch (error) {
    const code = error instanceof Error ? error.message : 'CONFIRMATION_FAILED';
    const status = [
      'REDEMPTION_NOT_FOUND',
      'REDEMPTION_UNAVAILABLE',
      'REDEMPTION_EXPIRED',
      'REDEMPTION_INVALID',
      'REWARD_UNAVAILABLE',
      'INSUFFICIENT_POINTS',
      'REDEMPTION_LIMIT_REACHED'
    ].includes(code) ? 409 : 500;

    return res.status(status).json({
      success: false,
      error: code,
      message: code.replace(/_/g, ' ').toLowerCase()
    });
  }
}