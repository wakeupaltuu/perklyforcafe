import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from './firebaseAdmin.js';

// Invoked by the Vercel cron below. It never changes balances: it only closes
// vouchers whose server-stored expiry has passed.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const cafes = await adminDb.collection('cafes').get();
    const now = Timestamp.now();
    let expired = 0;
    for (const cafe of cafes.docs) {
      const stale = await cafe.ref.collection('redemptions').where('expiresAt', '<=', now).get();
      const batch = adminDb.batch();
      const pending = stale.docs.filter(item => item.data().status === 'pending');
      pending.forEach(item => {
        batch.update(item.ref, { status: 'expired' });
        expired += 1;
      });
      if (pending.length) await batch.commit();
    }
    return res.status(200).json({ expired });
  } catch (error) {
    console.error('Unable to expire redemptions', error);
    return res.status(500).json({ error: 'Expiry job failed' });
  }
}
