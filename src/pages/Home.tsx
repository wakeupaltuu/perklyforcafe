import { Bell } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { HeroBanner } from '@/components/home/HeroBanner';
import { BrewPassCard } from '@/components/home/BrewPassCard';
import { SectionHeader } from '@/components/home/SectionHeader';
import { TodaysSpecialCard } from '@/components/home/TodaysSpecialCard';
import { ComboCard } from '@/components/home/ComboCard';
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

  const combos = [
    {
      title: 'Morning Combo',
      description: 'Latte + Butter Croissant',
      rating: 4.8,
      price: 399,
      originalPrice: 459,
      imageUrl: 'https://images.unsplash.com/photo-1495474472207-464a8d4402b8?auto=format&fit=crop&q=80&w=400',
    },
    {
      title: 'Sweet Break',
      description: 'Chocolate Cake + Cold Brew',
      rating: 4.7,
      price: 349,
      originalPrice: 399,
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f839aa4c3e85?auto=format&fit=crop&q=80&w=400',
    },
    {
      title: 'Lunch Combo',
      description: 'Chicken Sandwich + Iced Tea',
      rating: 4.6,
      price: 449,
      originalPrice: 499,
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400',
    },
    {
      title: 'Evening Delight',
      description: 'Mocha + Chocolate Muffin',
      rating: 4.5,
      price: 379,
      originalPrice: 429,
      imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400',
    },
    {
      title: 'Vegan Combo',
      description: 'Oat Latte + Avocado Toast',
      rating: 4.9,
      price: 499,
      originalPrice: 559,
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400',
    },
    {
      title: 'Breakfast Stack',
      description: 'Coffee + Pancakes + Syrup',
      rating: 4.4,
      price: 449,
      originalPrice: 499,
      imageUrl: 'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?auto=format&fit=crop&q=80&w=400',
    },
  ];

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
          <button 
            onClick={handleNotifications}
            className="icon-button mt-1"
          >
            <Bell className="size-5 text-[oklch(0.4_0.03_60)] stroke-[1.5]" />
          </button>
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
                {combos.map((combo, idx) => (
                  <div key={idx} className="min-w-[180px] max-w-[180px]">
                    <ComboCard {...combo} />
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