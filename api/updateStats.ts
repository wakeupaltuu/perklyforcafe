import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from './firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const { cafeId, date } = req.body;

  // Validate required fields
  if (!cafeId || !date) {
    return res.status(400).json({
      error: 'Missing cafeId or date',
    });
  }

  // Validate YYYY-MM-DD format
  if (
    typeof date !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return res.status(400).json({
      error: 'Invalid date format. Expected YYYY-MM-DD',
    });
  }

  try {
    /*
     * NEW ANALYTICS STRUCTURE
     *
     * cafes/{cafeId}/dailyStats/{YYYY-MM-DD}
     *
     * Example:
     *
     * cafes/abc123/dailyStats/2026-08-13
     *
     * {
     *   date: "2026-08-13",
     *   visits: 5,
     *   updatedAt: ...
     * }
     */

    const dailyStatsRef = adminDb.doc(
      `cafes/${cafeId}/dailyStats/${date}`
    );

    await dailyStatsRef.set(
      {
        date,
        visits: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Daily stats updated successfully',
      cafeId,
      date,
    });

  } catch (error) {
    console.error('Error updating daily stats:', error);

    return res.status(500).json({
      error: 'Failed to update daily stats',
      details:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    });
  }
}