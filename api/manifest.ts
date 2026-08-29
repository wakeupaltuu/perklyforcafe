// this is manifest.ts stored in api folder

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminDb } from './firebaseAdmin.js';

const MAIN_DOMAIN = 'cafeperkly.space';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const host = (req.headers.host || '').toLowerCase();

    let slug = 'perkly';

    if (
      host !== MAIN_DOMAIN &&
      
      host !== `www.${MAIN_DOMAIN}` &&
      host.endsWith(`.${MAIN_DOMAIN}`)
    ) {
      slug = host.replace(`.${MAIN_DOMAIN}`, '');
    }

    const snap = await adminDb.collection('cafes').doc(slug).get();

    if (!snap.exists) {
      return res.status(404).json({
        error: 'Cafe not found',
      });
    }

    const cafe = snap.data()!;

    const icon192 = cafe.icon192Url || cafe.logoUrl;
    const icon512 = cafe.icon512Url || cafe.logoUrl;

    res.setHeader(
      'Content-Type',
      'application/manifest+json'
    );

    res.setHeader(
      'Cache-Control',
      'public, max-age=300'
    );

    return res.status(200).json({
      name: cafe.cafeName,
      short_name: cafe.cafeName,
      description: cafe.description || '',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      background_color: '#ffffff',
      theme_color: cafe.primaryColor,

      icons: [
        {
          src: icon192,
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: icon512,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}