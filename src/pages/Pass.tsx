import { useState } from 'react';
import { 
  Coffee, 
  QrCode, 
  RotateCw, 
  Star, 
  Gift, 
  Sparkles, 
  Cake, 
  Percent, 
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { cn } from '@/lib/utils';

export function Pass() {
  const navigate = useNavigate();
  const { profile, cafe, user } = useTenant();
  
  const visits = profile?.visits || 0;
  
  // Calculate current tier
  let currentLevel = 'bronze';
  let levelVisits = visits;
  if (visits >= 10) {
    currentLevel = 'gold';
    levelVisits = 6; // Maxed out visual
  } else if (visits >= 5) {
    currentLevel = 'silver';
    levelVisits = visits - 5;
  } else {
    currentLevel = 'bronze';
    levelVisits = visits;
  }

  const [activeTab, setActiveTab] = useState(currentLevel);
  const [showQR, setShowQR] = useState(false);

  const userName = profile?.name || user?.displayName || 'Coffee Lover';
  const userId = user?.uid?.substring(0, 8).toUpperCase() || '48210093';

  // Config for each tier
  const tiers = {
    bronze: {
      name: 'Bronze',
      bgClass: 'bg-[oklch(0.24_0.04_48)]',
      gradient: 'bg-[linear-gradient(135deg,oklch(0.3_0.05_50/0.9),oklch(0.2_0.03_45/0.95))]',
      accentColor: 'text-[oklch(0.82_0.09_65)]',
      accentFill: 'fill-[oklch(0.82_0.09_65)]',
      emptyIcon: 'text-[oklch(0.6_0.03_55)]',
      badgeBg: 'bg-[oklch(0.62_0.1_50)]',
      benefits: [
        { icon: Sparkles, text: 'Priority seasonal drops' },
        { icon: Cake, text: 'Birthday espresso on us' },
        { icon: Percent, text: 'Member-only pricing' }
      ]
    },
    silver: {
      name: 'Silver',
      bgClass: 'bg-slate-700',
      gradient: 'bg-[linear-gradient(135deg,rgb(71,85,105,0.9),rgb(51,65,85,0.95))]',
      accentColor: 'text-slate-300',
      accentFill: 'fill-slate-300',
      emptyIcon: 'text-slate-500',
      badgeBg: 'bg-slate-500',
      benefits: [
        { icon: Gift, text: 'Free handcrafted drink' },
        { icon: Star, text: 'Double points on specials' },
        { icon: Sparkles, text: 'Priority seasonal drops' }
      ]
    },
    gold: {
      name: 'Gold',
      bgClass: 'bg-amber-700',
      gradient: 'bg-[linear-gradient(135deg,rgb(180,83,9,0.9),rgb(146,64,14,0.95))]',
      accentColor: 'text-amber-200',
      accentFill: 'fill-amber-200',
      emptyIcon: 'text-amber-900',
      badgeBg: 'bg-amber-600',
      benefits: [
        { icon: Crown, text: 'Free premium drink' },
        { icon: Gift, text: 'Exclusive invites & offers' },
        { icon: Star, text: 'Triple points on specials' }
      ]
    }
  };

  const activeTierConfig = tiers[activeTab as keyof typeof tiers];
  const isCurrentTier = activeTab === currentLevel;
  
  // If viewing a higher/lower tier, show 0 or max cups respectively. 
  // Simplified logic: just show 0 if not current tier, unless they surpassed it.
  const getDisplayVisits = () => {
    if (currentLevel === 'gold') {
      return activeTab === 'gold' ? 6 : 6; 
    }
    if (currentLevel === 'silver') {
      if (activeTab === 'bronze') return 6;
      if (activeTab === 'silver') return levelVisits;
      return 0;
    }
    // Bronze
    if (activeTab === 'bronze') return levelVisits;
    return 0;
  };
  
  const displayVisits = getDisplayVisits();
  
  // Calculate stats based on actual visits
  const points = visits * 124;
  const freeDrinks = Math.floor(visits / 6);
  const nextReward = Math.max(0, 200 - (points % 200));

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
          <div className="size-12 bg-[oklch(0.28_0.05_50)] shadow-[0_8px_16px_-6px_rgba(80,50,20,0.4)] rounded-full flex justify-center items-center">
            <Coffee className="size-5 text-[#FAF9F6] stroke-[1.5]" />
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="grid grid-cols-3 bg-neutral-200/60 rounded-full p-1 w-full h-11 relative shadow-inner">
          {Object.entries(tiers).map(([key, tier]) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setShowQR(false);
                }}
                className={cn(
                  "type-small rounded-full transition-all duration-300 relative z-10",
                  isActive ? "text-[oklch(0.28_0.05_50)] shadow-sm bg-white" : "text-neutral-500 hover:text-neutral-700"
                )}
              >
                {tier.name}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div 
          onClick={() => setShowQR(!showQR)}
          className={cn(
            "relative shadow-[0_20px_50px_-15px_rgba(80,50,20,0.5)] rounded-3xl w-full h-56 overflow-hidden cursor-pointer transition-all duration-500",
            activeTierConfig.bgClass
          )}
          style={{ transformStyle: 'preserve-3d', transform: showQR ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Background image & gradients */}
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
              alt="Texture"
              className="object-cover opacity-20 absolute inset-0 w-full h-full mix-blend-overlay"
            />
            <div className={cn("absolute inset-0", activeTierConfig.gradient)} />
            <div className="bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.1),transparent_50%)] absolute inset-0" />
            
            {/* Front Content */}
            <div className="relative z-10 flex p-6 flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className={cn("size-9 rounded-full flex justify-center items-center bg-white/10 backdrop-blur-sm border border-white/20")}>
                    <Coffee className={cn("size-4", activeTierConfig.accentColor)} />
                  </div>
                  <span className="type-section-title text-white tracking-[.01em]">
                    {cafe?.cafeName || 'Perkly'}
                  </span>
                </div>
                <div className={cn("type-caption capitalize rounded-full text-white px-3 py-1 shadow-sm", activeTierConfig.badgeBg)}>
                  {activeTierConfig.name}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => {
                  const isFilled = i < displayVisits;
                  return (
                    <Coffee 
                      key={i} 
                      className={cn(
                        "size-5 transition-colors", 
                        isFilled ? activeTierConfig.accentColor + ' ' + activeTierConfig.accentFill : activeTierConfig.emptyIcon
                      )} 
                    />
                  );
                })}
                <span className={cn("type-caption text-white/80 ml-1")}>
                  {displayVisits} / 6 cups
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
                <QrCode className={cn("size-8 opacity-80", activeTierConfig.accentColor)} />
              </div>
            </div>
          </div>

          {/* Back Content (QR Code) */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-white"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
             <div className="size-32 bg-white rounded-2xl flex justify-center items-center shadow-inner border border-neutral-100 p-2">
               {/* Using an image or QR component placeholder */}
               <QrCode className={cn("size-full", activeTierConfig.emptyIcon || "text-neutral-800")} />
             </div>
             <span className="text-neutral-500 font-medium text-sm mt-4">
               Scan at checkout
             </span>
             <span className="text-neutral-400 text-xs mt-1 font-mono">
               {userId}
             </span>
          </div>
        </div>

        <div className="flex -mt-2 justify-center items-center gap-2">
          <RotateCw className="size-3.5 text-neutral-400" />
          <span className="text-neutral-400 text-xs leading-4">
            Tap card to flip for QR
          </span>
        </div>

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
            {activeTierConfig.name} Benefits
          </span>
          <div className="flex flex-col gap-4">
            {activeTierConfig.benefits.map((benefit, idx) => {
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
          onClick={() => navigate(`/${cafe?.id || 'perkly'}/scan`)}
          className="type-button mt-6 bg-[#2d1c0c] shadow-[0_8px_20px_-6px_rgba(45,28,12,0.6)] rounded-full text-white w-full h-14 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <QrCode className="size-5" />
          Open Scanner
        </button>
      </div>
    </div>
  );
}
