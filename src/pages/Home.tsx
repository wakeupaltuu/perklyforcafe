import { Bell } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { HeroBanner } from '@/components/home/HeroBanner';
import { BrewPassCard } from '@/components/home/BrewPassCard';
import { SectionHeader } from '@/components/home/SectionHeader';
import { TodaysSpecialCard } from '@/components/home/TodaysSpecialCard';
import { SeasonalCard } from '@/components/home/SeasonalCard';
import { FeaturedDrinkCard } from '@/components/home/FeaturedDrinkCard';
import { format } from 'date-fns';

export function Home() {
  const { user, profile } = useTenant();
  
  const userName = profile?.name || user?.displayName || 'Coffee Lover';
  const firstName = userName.split(' ')[0];

  const handleNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert('Push notifications enabled!');
        }
      });
    } else {
      alert('Push notifications simulate enabled!');
    }
  };

  const currentDate = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="app-page flex w-full flex-col overflow-x-hidden pb-32">
      <div className="overflow-y-auto flex-1">
        
        {/* Header */}
        <div className="flex px-5 pt-10 pb-5 sm:px-6 justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="type-eyebrow text-muted tracking-[0.12em]">
              {currentDate}
            </span>
            <h1 className="type-page-title text-ink">
              Good morning, {firstName}
            </h1>
          </div>
          <button 
            onClick={handleNotifications}
            className="icon-button mt-1"
          >
            <Bell className="size-5 text-[oklch(0.4_0.03_60)] stroke-[1.5]" />
          </button>
        </div>

        {/* Hero Section */}
        <HeroBanner />

        {/* Perk Pass Section */}
        <BrewPassCard />

        {/* Discovery content is grouped in an elevated, editorial surface. */}
        <div className="mx-5 mt-9 rounded-[28px] border border-line bg-surface p-4 shadow-[var(--shadow-card)] sm:mx-6 sm:p-5">
          {/* Today's Special */}
          <section>
            <SectionHeader title="Today's Special" action="See all" />
            <TodaysSpecialCard />
          </section>

          {/* Seasonal Collection replaces the reference's events placement. */}
          <section className="pt-8">
            <SectionHeader title="Seasonal Collection" action="See all" />
            <div className="grid grid-cols-2 mt-4 gap-3">
              <SeasonalCard 
                title="Autumn Spice"
                description="Warm & cozy"
                imageUrl="https://images.unsplash.com/photo-1632584125454-f48693ec9861?auto=format&fit=crop&q=80&w=400"
                overlayColor="bg-[#3c230f]/78"
              />
              <SeasonalCard 
                title="Cold Brew Co."
                description="Smooth & bold"
                imageUrl="https://images.unsplash.com/photo-1495221521568-8b714b2cb6fd?auto=format&fit=crop&q=80&w=400"
                overlayColor="bg-[#1e2837]/78"
              />
            </div>
          </section>

          {/* Featured drinks occupy the final discovery row. */}
          <section className="pt-8">
            <SectionHeader title="Featured Drinks" action="See all" />
            <div className="grid grid-cols-2 mt-4 gap-3">
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
          </section>
        </div>
        
        <div className="h-6" />
      </div>
    </div>
  );
}
