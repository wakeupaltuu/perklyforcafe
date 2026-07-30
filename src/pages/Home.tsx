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

export function Home() {
  const { user, profile, cafeSlug, menuItems } = useTenant();
  
  const userName = profile?.name || user?.displayName || 'Coffee Lover';
  const firstName = userName.split(' ')[0];

  const currentDate = format(new Date(), 'EEEE, MMMM d');

  const recommendations = getRecommendedItems(cafeSlug, profile, menuItems);
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

          {/* Popular at Perkly */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <SectionHeader title="Popular at Perkly" action="See all" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <FeaturedDrinkCard 
                title="Dark Mocha"
                price="$5.20"
                imageUrl="https://images.unsplash.com/photo-1592663527144-3afb8d150556?auto=format&fit=crop&q=80&w=400"
                hasHeart={true}
              />
              <FeaturedDrinkCard 
                title="Matcha Latte"
                price="$4.80"
                imageUrl="https://images.unsplash.com/photo-1781229816087-3e3d8ec90f62?auto=format&fit=crop&q=80&w=400"
              />
            </div>
          </div>
        </div>
        
        <div className="h-6" />
      </div>
    </div>
  );
}
