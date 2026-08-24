import { Calendar, Check, ChevronRight, Coffee, Gift, Lock, Percent, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ProfileButton } from '@/components/ProfileButton';
import { useTenant } from '@/context/TenantContext';
import { useRewardsData } from '@/hooks/useRewardsData';
import { Reward } from '@/types';
import { RewardRedemptionSheet } from '@/components/rewards/RewardRedemptionSheet';
import { useRewardRedemption } from '@/hooks/useRewardRedemption';

const AUTOPLAY_MS = 4000;

const createdAtMillis = (reward: Reward) => {
  const value = reward.createdAt;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return new Date(value).getTime() || 0;
  return value?.toMillis?.() || 0;
};

// Decorative fallback used only when reward.imageUrl is missing —
// strong caramel/brown backgrounds so it reads as intentional artwork.
const fallbackStyles: Record<Reward['type'], { gradient: string; Icon: typeof Coffee }> = {
  free_item: { gradient: 'from-[#8a5a34] to-[#3d2817]', Icon: Coffee },
  discount: { gradient: 'from-[#9d5126] to-[#4a2814]', Icon: Percent },
  buy_x_get_y: { gradient: 'from-[#7a4f2a] to-[#3d2817]', Icon: Gift },
};

function RewardImage({ reward, className }: { reward: Reward; className: string }) {
  if (reward.imageUrl) {
    return (
      <img
        src={reward.imageUrl}
        alt={reward.title}
        className={`${className} object-cover`}
        loading="lazy"
      />
    );
  }
  const { gradient, Icon } = fallbackStyles[reward.type] || fallbackStyles.free_item;
  return (
    <div className={`${className} bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <Icon className="size-12 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]" strokeWidth={1.25} />
    </div>
  );
}

function RewardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-28 rounded-3xl bg-white/70" />
      <div className="h-6 w-32 rounded bg-white/70" />
      <div className="h-48 rounded-3xl bg-white/70" />
      <div className="h-6 w-36 rounded bg-white/70" />
      <div className="flex gap-3">
        <div className="h-44 w-40 shrink-0 rounded-2xl bg-white/70" />
        <div className="h-44 w-40 shrink-0 rounded-2xl bg-white/70" />
      </div>
    </div>
  );
}

// Points summary header — dark card with balance + distance to next unlock
function PointsHeaderCard({ points, nextReward }: { points: number; nextReward: Reward | null }) {
  const pointsToNext = nextReward ? Math.max(0, nextReward.pointsRequired - points) : 0;

  return (
    <div className="rounded-3xl bg-[#3d2817] text-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Coffee className="size-5 text-[#f0c38a]" />
        </div>
        <div>
          <div className="text-white/60 text-xs">Perkly Points</div>
          <div className="flex items-center gap-1.5 text-2xl font-bold leading-tight">
            {points}
            <Star className="size-4 fill-[#f0c38a] text-[#f0c38a]" />
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-white/80 leading-5">
        {nextReward
          ? `You're just ${pointsToNext} points away from your next reward`
          : 'Keep visiting to start earning rewards.'}
      </p>

      <button
        type="button"
        className="mt-3 flex items-center gap-1 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium active:scale-95 transition-transform"
      >
        How it works
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}

// Active Offers — auto-advancing slideshow (same interaction pattern as HeroBanner)
function ActiveOffersCarousel({ rewards, onSelect }: { rewards: Reward[]; onSelect: (reward: Reward) => void }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (rewards.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rewards.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [rewards.length, isPaused]);

  const goTo = (i: number) => {
    setIndex(i);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), AUTOPLAY_MS);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) goTo((index + 1) % rewards.length);
      else goTo((index - 1 + rewards.length) % rewards.length);
    }
    touchStartX.current = null;
  };

  if (rewards.length === 0) {
    return (
      <div className="rounded-3xl bg-white/50 py-8 text-center text-[oklch(0.5_0.04_50)]">
        No active offers right now.
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl h-48"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {rewards.map((reward) => {
          const eligibilityParts: string[] = [];
          if (reward.minOrderValue) eligibilityParts.push(`Min. order ₹${reward.minOrderValue}`);
          if (reward.validityDays) eligibilityParts.push(`Valid for ${reward.validityDays} days`);

          return (
            <div key={reward.id} className="relative w-full h-full flex-shrink-0 cursor-pointer" role="button" tabIndex={0} onClick={() => onSelect(reward)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(reward); }}>
              <RewardImage reward={reward} className="w-full h-full" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,12,8,.85),rgba(20,12,8,.1)_55%)]" />
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                {reward.badge && (
                  <span className="w-fit rounded-full bg-caramel px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    {reward.badge}
                  </span>
                )}
                <div className="mt-auto">
                  <h3 className="text-white text-xl font-semibold leading-6">{reward.title}</h3>
                  {reward.description && (
                    <p className="mt-1 text-white/80 text-sm leading-5 max-w-[85%]">
                      {reward.description}
                    </p>
                  )}
                  {eligibilityParts.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-white/65 text-xs">
                      <Calendar className="size-3.5" />
                      <span>{eligibilityParts.join(' · ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rewards.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {rewards.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to offer ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ExclusiveRewardCard({ reward, points, onSelect }: { reward: Reward; points: number; onSelect: (reward: Reward) => void }) {
  const isUnlocked = points >= reward.pointsRequired;
  const pointsNeeded = Math.max(0, reward.pointsRequired - points);
  const progressPct = reward.pointsRequired > 0
    ? Math.min(100, Math.round((points / reward.pointsRequired) * 100))
    : 100;

  return (
    <article className="surface-card w-40 shrink-0 snap-start overflow-hidden transition-transform active:scale-[.98] cursor-pointer" role="button" tabIndex={0} onClick={() => onSelect(reward)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(reward); }}>
      <RewardImage reward={reward} className="h-28 w-full" />
      <div className="p-3">
        <h3 className="type-card-title text-ink text-[15px] leading-5 truncate">{reward.title}</h3>

        {reward.pointsRequired > 0 && (
          <p className="type-caption mt-1 text-[oklch(0.5_0.04_50)]">
            {reward.pointsRequired} Points
          </p>
        )}

        {reward.pointsRequired > 0 && !isUnlocked && (
          <div className="mt-2 h-1 w-full rounded-full bg-[oklch(0.93_0.02_80)]">
            <div className="h-full rounded-full bg-caramel" style={{ width: `${progressPct}%` }} />
          </div>
        )}

        <div className="mt-2 flex items-center gap-1">
          {isUnlocked ? (
            <>
              <Check className="size-3.5 text-[oklch(0.4_0.08_150)]" />
              <span className="type-caption font-medium text-[oklch(0.4_0.08_150)]">Available</span>
            </>
          ) : (
            <>
              <Lock className="size-3 text-[oklch(0.55_0.03_60)]" />
              <span className="type-caption text-[oklch(0.55_0.03_60)]">
                {pointsNeeded} pts to unlock
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function Rewards() {
  const { profile, user, cafe, cafeSlug } = useTenant();
  const { rewards, loading: rewardsLoading, error: rewardsError } = useRewardsData(cafeSlug);
  const points = profile?.points || 0;
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const { redemption, creating, error: redemptionError, createRedemption, closeRedemption } = useRewardRedemption(cafeSlug, user?.uid, points);
  const closeSheet = () => { setSelectedReward(null); closeRedemption(); };
  const activeRewards = rewards.filter(reward => reward.isActive === true && reward.category === 'active').sort((a, b) => createdAtMillis(b) - createdAtMillis(a));
  const exclusiveRewards = rewards.filter(reward => reward.isActive === true && reward.category === 'exclusive').sort((a, b) => createdAtMillis(b) - createdAtMillis(a));

  // Derived only — next locked exclusive reward by lowest points required.
  // No new Firestore field, no change to the filtering logic above.
  const nextReward = exclusiveRewards
    .filter((r) => r.pointsRequired > points)
    .sort((a, b) => a.pointsRequired - b.pointsRequired)[0] || null;

  return <div className="app-page flex w-full flex-col overflow-x-hidden">
    <div className="page-shell flex flex-1 flex-col gap-6">
      <div className="flex items-start justify-between"><div><h1 className="type-display-lg text-ink">Rewards</h1><p className="type-body mt-2 text-[oklch(0.5_0.03_60)]">Collect perks with every sip and stay.</p></div><ProfileButton /></div>
      {rewardsLoading ? <RewardSkeleton /> : rewardsError ? <div className="rounded-3xl bg-white/50 py-10 text-center text-[oklch(0.5_0.04_50)]">{rewardsError}</div> : <>
        <PointsHeaderCard points={points} nextReward={nextReward} />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="type-section-title text-ink">Active Offers</h2>
          </div>
          <ActiveOffersCarousel rewards={activeRewards} onSelect={setSelectedReward} />
        </section>

        <section>
          <div className="mb-4">
            <h2 className="type-section-title text-ink">Exclusive Rewards</h2>
            <p className="type-body mt-1 text-[oklch(0.5_0.04_50)]">Use your Perkly Points to unlock exclusive rewards.</p>
          </div>
          {exclusiveRewards.length ? (
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {exclusiveRewards.map(reward => <ExclusiveRewardCard key={reward.id} reward={reward} points={points} onSelect={setSelectedReward} />)}
            </div>
          ) : <div className="rounded-3xl bg-white/50 py-8 text-center text-[oklch(0.5_0.04_50)]">No exclusive rewards available yet.</div>}
        </section>
      </>}
    </div>
    <RewardRedemptionSheet reward={selectedReward} cafeName={cafe?.cafeName} redemption={redemption} creating={creating} error={redemptionError} onClose={closeSheet} onRedeem={createRedemption} />
  </div>;
}
