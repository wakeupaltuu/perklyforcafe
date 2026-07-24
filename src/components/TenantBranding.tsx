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

    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColor && cafe?.primaryColor) themeColor.content = cafe.primaryColor;

    const appleIcon = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    if (appleIcon && cafe?.logoUrl) appleIcon.href = cafe.logoUrl;
  }, [cafe?.cafeName, cafe?.logoUrl, cafe?.primaryColor]);

  return null;
}
