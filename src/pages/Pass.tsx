import { useState } from 'react';
import { 
  Coffee, 
  Star, 
  Gift, 
  Sparkles, 
  Cake, 
  Percent
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { cn } from '@/lib/utils';
import BorderGlow from '@/components/BorderGlow';
import { ProfileButton } from '@/components/ProfileButton';

export function Pass() {
  const navigate = useNavigate();
  const { profile, cafe, user } = useTenant();
  
  const visits = profile?.visits || 0;
  const TOTAL_STAMPS = 7;
  const currentProgress = visits % TOTAL_STAMPS;

  const userName = profile?.name || user?.displayName || 'Coffee Lover';
  const userId = user?.uid?.substring(0, 8).toUpperCase() || '48210093';
  
  const points = visits * 124;
  const freeDrinks = Math.floor(visits / 6);
  const nextReward = Math.max(0, 200 - (points % 200));

  // Bronze colors (static)
  const bronzeColors = {
    bg: 'bg-[var(--color-secondary-dark)]',
    gradient: 'bg-[linear-gradient(135deg,var(--color-secondary),var(--color-secondary-dark))]',
    accent: 'text-[var(--color-primary-light)]',
    accentFill: 'fill-[var(--color-primary-light)]',
    emptyIcon: 'text-[oklch(0.6_0.03_55)]',
    badgeBg: 'bg-[var(--color-primary)]',
    benefits: [
      { icon: Sparkles, text: 'Priority seasonal drops' },
      { icon: Cake, text: 'Birthday espresso on us' },
      { icon: Percent, text: 'Member-only pricing' }
    ]
  };

  const glowColors = ['#D4A574', '#A67B5B', '#CD7F32'];

  return (
    <div className="bg-[#FAF9F6] text-neutral-950 flex flex-col w-full min-h-screen overflow-x-hidden">
      <div className="flex px-6 pt-12 pb-28 flex-col flex-1 gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="type-eyebrow text-[oklch(0.55_0.05_60)] tracking-[.2em]">
              {cafe?.cafeName || 'Perkly Cafe'}
            </span>
            <h1 className="type-page-title text-[oklch(0.32_0.05_50)]">
              Loyalty Pass
            </h1>
          </div>
          <ProfileButton />
        </div>

        {/* BorderGlow Card */}
        <BorderGlow
          edgeSensitivity={30}
          glowColor="40 80 80"
          backgroundColor="var(--color-secondary-dark)"
          borderRadius={32}
          glowRadius={40}
          glowIntensity={1}
          coneSpread={25}
          animated={false}
          colors={glowColors}
          tapGlow={true}
        >
          <div className="relative w-full rounded-[32px] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Texture"
                className="object-cover opacity-20 absolute inset-0 w-full h-full mix-blend-overlay"
              />
              <div className={cn("absolute inset-0", bronzeColors.gradient)} />
              <div className="bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.1),transparent_50%)] absolute inset-0" />
            </div>
            
            <div className="relative z-10 flex p-6 flex-col justify-between h-56">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-full flex justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20">
                    <Coffee className="size-4 text-[oklch(0.82_0.09_65)]" />
                  </div>
                  <span className="type-section-title text-white tracking-[.01em]">
                    {cafe?.cafeName || 'Perkly'}
                  </span>
                </div>
               
              </div>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: TOTAL_STAMPS }).map((_, i) => {
                  const isFilled = i < currentProgress;
                  return (
                    <Coffee 
                      key={i} 
                      className={cn(
                        "size-5 transition-colors", 
                        isFilled ? "text-[oklch(0.82_0.09_65)] fill-[oklch(0.82_0.09_65)]" : "text-[oklch(0.6_0.03_55)]"
                      )} 
                    />
                  );
                })}
                <span className="type-caption text-white/80 ml-1">
                  {currentProgress} / {TOTAL_STAMPS} cups
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="type-eyebrow text-white/60 tracking-[.15em] mb-0.5">
                    Member
                  </span>
                  <span className="type-section-title text-white">
                    {userName}
                  </span>
                  <span className="text-white/60 text-xs mt-0.5 tracking-wider font-mono">
                    ID · {userId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BorderGlow>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white shadow-[0_4px_12px_-6px_rgba(80,50,20,0.15)] rounded-3xl p-4 flex flex-col items-start gap-1 border border-neutral-100">
            <Star className="size-4 text-[oklch(0.62_0.13_55)] mb-1" />
            <span className="type-section-title text-[oklch(0.32_0.05_50)] text-[24px]">
              {points.toLocaleString()}
            </span>
            <span className="text-neutral-500 text-[11px] font-medium">
              Points
            </span>
          </div>
          <div className="bg-white shadow-[0_4px_12px_-6px_rgba(80,50,20,0.15)] rounded-3xl p-4 flex flex-col items-start gap-1 border border-neutral-100">
            <Coffee className="size-4 text-[oklch(0.62_0.13_55)] mb-1" />
            <span className="type-section-title text-[oklch(0.32_0.05_50)] text-[24px]">
              {freeDrinks}
            </span>
            <span className="text-neutral-500 text-[11px] font-medium">
              Free Drinks
            </span>
          </div>
          <div className="bg-white shadow-[0_4px_12px_-6px_rgba(80,50,20,0.15)] rounded-3xl p-4 flex flex-col items-start gap-1 border border-neutral-100">
            <Gift className="size-4 text-[oklch(0.62_0.13_55)] mb-1" />
            <span className="type-section-title text-[oklch(0.32_0.05_50)] text-[24px]">
              {nextReward}
            </span>
            <span className="text-neutral-500 text-[11px] font-medium">
              Next Reward
            </span>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex flex-col gap-4 mt-2">
          <span className="type-section-title text-[oklch(0.32_0.05_50)]">
            Pass Benefits
          </span>
          <div className="flex flex-col gap-4">
            {bronzeColors.benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="size-11 bg-white shadow-sm border border-neutral-100 rounded-full flex justify-center items-center">
                    <Icon className="size-5 text-[oklch(0.62_0.13_55)]" />
                  </div>
                  <span className="type-body text-neutral-700 font-medium">
                    {benefit.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={() => navigate('/scan')}
          className="type-button mt-6 bg-[#2d1c0c] shadow-[0_8px_20px_-6px_rgba(45,28,12,0.6)] rounded-full text-white w-full h-14 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Coffee className="size-5" />
          Check In
        </button>
      </div>
    </div>
  );
}
