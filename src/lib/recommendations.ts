import { MenuItem, UserProfile } from '@/types';

export function getRecommendedItems(cafeSlug: string | undefined, profile: UserProfile | null, allMenuItems: MenuItem[]) {
  // cafeSlug is retained in the public API for future tenant-aware ranking.
  void cafeSlug;
  const available = allMenuItems.filter(item => item.isAvailable === true);
  const preferences = profile?.categoryPreferences;
  const topCategory = preferences && Object.entries(preferences).reduce<string | undefined>(
    (best, [category, count]) => !best || count > (preferences[best] || 0) ? category : best,
    undefined,
  );
  if (topCategory) return available.filter(item => item.category === topCategory).slice(0, 4);
  const featured = available.filter(item => item.featured || item.popular);
  return (featured.length ? featured : available).slice(0, 4);
}
