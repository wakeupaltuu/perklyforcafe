import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from './firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cafeId, date } = req.body;
  
  if (!cafeId || !date) {
    return res.status(400).json({ error: 'Missing cafeId or date' });
  }

  try {
    const statsRef = adminDb.doc(`cafes/${cafeId}/stats/daily`);
    
    await statsRef.set({
      date: date,
      totalVisits: FieldValue.increment(1),
      [`dailyVisits.${date}`]: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    return res.status(200).json({ 
      success: true,
      message: 'Stats updated successfully'
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    return res.status(500).json({ 
      error: 'Failed to update stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}