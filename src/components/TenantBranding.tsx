import { useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';

/** Keeps browser and iOS installed-app labels aligned with the active cafe. */
export function TenantBranding() {
  const { cafe } = useTenant();

  useEffect(() => {
    const cafeName = cafe?.cafeName?.trim();
    if (!cafeName) return;

    document.title = cafeName;

    let appleTitle = document.querySelector<HTMLMetaElement>(
      'meta[name="apple-mobile-web-app-title"]',
    );

    if (!appleTitle) {
      appleTitle = document.createElement('meta');
      appleTitle.name = 'apple-mobile-web-app-title';
      document.head.appendChild(appleTitle);
    }

    appleTitle.content = cafeName;
  }, [cafe?.cafeName]);

  return null;
}
