import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { ProfileButton } from '@/components/ProfileButton';
import { HeroBanner } from '@/components/home/HeroBanner';
import { BrewPassCard } from '@/components/home/BrewPassCard';
import { SectionHeader } from '@/components/home/SectionHeader';
import { TodaysSpecialCard } from '@/components/home/TodaysSpecialCard';
import { ComboCard } from '@/components/home/ComboCard';
import { FeaturedDrinkCard } from '@/components/home/FeaturedDrinkCard';
import { getRecommendedItems } from '@/lib/recommendations';
import { useMenuData } from '@/hooks/useMenuData';

function HomeHeader() {
  const { cafe } = useTenant();
  const [failedLogoUrls, setFailedLogoUrls] = useState<string[]>([]);
  const cafeName = cafe?.cafeName || 'Perkly';
  const logoUrls = [cafe?.headerLogoUrl?.trim(), cafe?.logoUrl?.trim()]
    .filter((url): url is string => Boolean(url))
    .filter((url, index, urls) => urls.indexOf(url) === index);
  const logoUrl = logoUrls.find(url => !failedLogoUrls.includes(url));

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 sm:px-6">
      <div className="relative flex h-10 items-center justify-between">
        <button type="button" disabled aria-label="Menu" className="relative z-10 flex size-11 items-center justify-center text-[var(--color-text)] disabled:opacity-100">
          <Menu className="size-[22px] stroke-[1.5]" />
        </button>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-12 text-center">
          {logoUrl ? (
            <img src={logoUrl} alt={cafeName} onError={() => setFailedLogoUrls(urls => [...urls, logoUrl])} className="h-9 max-w-[145px] object-contain" />
          ) : (
            <p className="max-w-full truncate font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text)]">{cafeName}</p>
          )}
        </div>

        <ProfileButton iconOnly className="relative z-10 size-11 rounded-none border-transparent bg-transparent text-[var(--color-text)] shadow-none [&>svg]:size-[22px]" />
      </div>
    </header>
  );
}

export function Home() {
  const { profile, cafe, cafeSlug } = useTenant();
  const { menuItems } = useMenuData(cafeSlug);

  const recommendations = getRecommendedItems(cafeSlug, profile, menuItems);
  const popularItems = menuItems.filter(item => item.isPopular === true);
  return (
    <div className="app-page flex w-full flex-col overflow-x-hidden pb-32 min-h-screen">
      <div className="overflow-y-auto flex-1">
        
        <HomeHeader />

        {/* Hero Section */}
        <HeroBanner />

        {/* Brew Pass */}
        <BrewPassCard />

        {/* Discovery content */}
        <div className="mt-6 space-y-5 px-4">
          
          {/* Today's Special */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <SectionHeader title="Today's Special" action="See all" />
            <div className="mt-3">
              <TodaysSpecialCard />
            </div>
          </div>

          {/* Recommended For You — Horizontal Scroll */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <SectionHeader title="Recommended For You" action="See all" />
            <div className="mt-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-4">
                {recommendations.map(item => (
                  <div key={item.id} className="min-w-[180px] max-w-[180px]">
                    <ComboCard title={item.title || item.name || 'Menu item'} description={item.description || ''} rating={4.8} price={typeof item.price === 'number' ? item.price : Number(item.price) || 0} originalPrice={typeof item.price === 'number' ? item.price : Number(item.price) || 0} imageUrl={item.imageUrl || item.image || ''} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {popularItems.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <SectionHeader title={`Popular at ${cafe?.cafeName || 'Cafe'}`} action="See all" />
              <div className="grid grid-cols-2 gap-3 mt-4">
                {popularItems.map(item => (
                  <FeaturedDrinkCard
                    key={item.id}
                    title={item.title || item.name || 'Menu item'}
                    price={typeof item.price === 'number' ? `₹${item.price.toFixed(0)}` : item.price ? (String(item.price).startsWith('₹') ? String(item.price) : `₹${item.price}`) : 'Price on request'}
                    imageUrl={item.imageUrl || item.image || ''}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="h-6" />
      </div>
    </div>
  );
}
