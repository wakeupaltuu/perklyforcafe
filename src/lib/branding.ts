import type { Cafe } from '@/types';

type MetaName = 'description' | 'theme-color' | 'apple-mobile-web-app-title' | 'og:title' | 'og:image' | 'twitter:title' | 'twitter:image';

const upsertMeta = (name: MetaName, content: string, property = false) => {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.querySelector<HTMLMetaElement>(selector);

  if (!meta) {
    meta = document.createElement('meta');
    if (property) meta.setAttribute('property', name);
    else meta.name = name;
    document.head.appendChild(meta);
  }

  meta.content = content;
};

const upsertIcon = (rel: 'icon' | 'apple-touch-icon', href: string) => {
  let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }

  link.href = href;
};

/** Applies all tenant branding metadata in one place after Firestore loads a cafe. */
export const applyBranding = (cafe: Cafe) => {
  const name = cafe.cafeName?.trim();
  if (!name) return;

  const icon = cafe.faviconUrl || cafe.logoUrl;
  const appleIcon = cafe.appleIconUrl || cafe.icon192Url || icon;
  const socialImage = cafe.socialImage || cafe.heroImageUrl || icon;

  document.title = name;
  upsertMeta('apple-mobile-web-app-title', name);
  upsertMeta('theme-color', cafe.primaryColor);
  upsertMeta('og:title', name, true);
  upsertMeta('twitter:title', name);

  if (cafe.description) upsertMeta('description', cafe.description);
  if (socialImage) {
    upsertMeta('og:image', socialImage, true);
    upsertMeta('twitter:image', socialImage);
  }
  if (icon) upsertIcon('icon', icon);
  if (appleIcon) upsertIcon('apple-touch-icon', appleIcon);
};
