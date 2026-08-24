import { useTenant } from '@/context/TenantContext';
import { ProfileButton } from '@/components/ProfileButton';
import { HeroBanner } from '@/components/home/HeroBanner';
import { BrewPassCard } from '@/components/home/BrewPassCard';
import { SectionHeader } from '@/components/home/SectionHeader';
import { TodaysSpecialCard } from '@/components/home/TodaysSpecialCard';
import { ComboCard } from '@/components/home/ComboCard';
import { FeaturedDrinkCard } from '@/components/home/FeaturedDrinkCard';
import { format } from 'date-fns';
import { getRecommendedItems } from '@/lib/recommendations';
import { useMenuData } from '@/hooks/useMenuData';

export function Home() {
  const { user, profile, cafe, cafeSlug } = useTenant();
  const { menuItems } = useMenuData(cafeSlug);
  
  const userName = profile?.name || user?.displayName || 'Coffee Lover';
  const firstName = userName.split(' ')[0];

  const currentDate = format(new Date(), 'EEEE, MMMM d');

  const recommendations = getRecommendedItems(cafeSlug, profile, menuItems);
  const popularItems = menuItems.filter(item => item.isPopular === true);
  return (
    <div className="app-page flex w-full flex-col overflow-x-hidden pb-32 bg-coffee-50 min-h-screen">
      <div className="overflow-y-auto flex-1">
        
        {/* Header */}
        <div className="flex px-4 pt-10 pb-4 justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="type-eyebrow text-muted tracking-[0.12em]">
              {currentDate}
            </span>
            <h1 className="type-page-title text-ink">
              Good morning, {firstName}
            </h1>
          </div>
          <ProfileButton />
        </div>

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
