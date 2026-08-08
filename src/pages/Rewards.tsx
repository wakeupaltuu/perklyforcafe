import { Check, Coffee, Gift, Lock, Percent } from 'lucide-react';
import { ProfileButton } from '@/components/ProfileButton';
import { useTenant } from '@/context/TenantContext';
import { Reward } from '@/types';

const createdAtMillis = (reward: Reward) => {
  const value = reward.createdAt;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return new Date(value).getTime() || 0;
  return value?.toMillis?.() || 0;
};

// Decorative fallback used only when reward.imageUrl is missing —
// keeps the card premium instead of showing a broken/grey image.
const fallbackStyles: Record<Reward['type'], { gradient: string; Icon: typeof Coffee }> = {
  free_item: { gradient: 'from-[#e8c9a0] to-[#c68642]', Icon: Coffee },
  discount: { gradient: 'from-[#d9a myenv06b] to-[#9d5126]'.replace('myenv', ''), Icon: Percent },
  buy_x_get_y: { gradient: 'from-[#f0dcc4] to-[#8a5a34]', Icon: Gift },
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
      <Icon className="size-8 text-white/90" strokeWidth={1.5} />
    </div>
  );
}

function RewardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-6 w-32 rounded bg-white/70" />
      <div className="flex flex-col gap-3">
        <div className="h-24 rounded-2xl bg-white/70" />
        <div className="h-24 rounded-2xl bg-white/70" />
      </div>
      <div className="h-6 w-36 rounded bg-white/70" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-44 rounded-2xl bg-white/70" />
        <div className="h-44 rounded-2xl bg-white/70" />
      </div>
    </div>
  );
}

function ActiveRewardCard({ reward }: { reward: Reward }) {
  const eligibilityParts: string[] = [];
  if (reward.minOrderValue) eligibilityParts.push(`Min. order ₹${reward.minOrderValue}`);
  if (reward.validityDays) eligibilityParts.push(`Valid for ${reward.validityDays} days`);
  const eligibilityText = eligibilityParts.join(' · ');

  if (reward.imageUrl) {
    return (
      <article className="surface-card overflow-hidden transition-transform active:scale-[.98]">
        <RewardImage reward={reward} className="h-32 w-full" />
        <div className="p-4">
          <h3 className="type-card-title text-ink">{reward.title}</h3>
          {reward.description && (
            <p className="type-body mt-1 text-[oklch(0.5_0.04_50)]">{reward.description}</p>
          )}
          {eligibilityText && (
            <p className="type-caption mt-2 text-[oklch(0.55_0.03_60)]">{eligibilityText}</p>
          )}
        </div>
      </article>
    );
  }

  const { gradient, Icon } = fallbackStyles[reward.type] || fallbackStyles.free_item;
  return (
    <article className="surface-card flex items-center gap-3 p-4 transition-transform active:scale-[.98]">
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient}`}>
        <Icon className="size-5 text-white/90" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="type-card-title text-ink">{reward.title}</h3>
        {reward.description && (
          <p className="type-body mt-1 text-[oklch(0.5_0.04_50)]">{reward.description}</p>
        )}
        {eligibilityText && (
          <p className="type-caption mt-1 text-[oklch(0.55_0.03_60)]">{eligibilityText}</p>
        )}
      </div>
    </article>
  );
}

function ExclusiveRewardCard({ reward, points }: { reward: Reward; points: number }) {
  const isUnlocked = points >= reward.pointsRequired;
  const pointsNeeded = Math.max(0, reward.pointsRequired - points);
  const progressPct = reward.pointsRequired > 0
    ? Math.min(100, Math.round((points / reward.pointsRequired) * 100))
    : 100;

  return (
    <article className="surface-card overflow-hidden transition-transform active:scale-[.98]">
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
            <div
              className="h-full rounded-full bg-caramel"
              style={{ width: `${progressPct}%` }}
            />
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
                {pointsNeeded} points to unlock
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function Rewards() {
  const { profile, rewards, rewardsError, rewardsLoading } = useTenant();
  const points = profile?.points || 0;
  const activeRewards = rewards.filter(reward => reward.isActive === true && reward.category === 'active').sort((a, b) => createdAtMillis(b) - createdAtMillis(a));
  const exclusiveRewards = rewards.filter(reward => reward.isActive === true && reward.category === 'exclusive').sort((a, b) => createdAtMillis(b) - createdAtMillis(a));

  return <div className="app-page flex w-full flex-col overflow-x-hidden">
    <div className="page-shell flex flex-1 flex-col gap-6">
      <div className="flex items-start justify-between"><div><h1 className="type-display-lg text-ink">Rewards</h1><p className="type-body mt-2 text-[oklch(0.5_0.03_60)]">Collect perks with every sip and stay.</p></div><ProfileButton /></div>
      {rewardsLoading ? <RewardSkeleton /> : rewardsError ? <div className="rounded-3xl bg-white/50 py-10 text-center text-[oklch(0.5_0.04_50)]">{rewardsError}</div> : <>
        <section>
          <div className="mb-4">
            <h2 className="type-section-title text-ink">Active Rewards</h2>
            <p className="type-body mt-1 text-[oklch(0.5_0.04_50)]">Offers made to bring you back.</p>
          </div>
          {activeRewards.length ? <div className="flex flex-col gap-3">{activeRewards.map(reward => <ActiveRewardCard key={reward.id} reward={reward} />)}</div> : <div className="rounded-3xl bg-white/50 py-8 text-center text-[oklch(0.5_0.04_50)]">No active offers right now.</div>}
        </section>
        <section>
          <div className="mb-4">
            <h2 className="type-section-title text-ink">Exclusive Rewards</h2>
            <p className="type-body mt-1 text-[oklch(0.5_0.04_50)]">Use your Perkly Points to unlock exclusive rewards.</p>
          </div>
          {exclusiveRewards.length ? <div className="grid grid-cols-2 gap-3">{exclusiveRewards.map(reward => <ExclusiveRewardCard key={reward.id} reward={reward} points={points} />)}</div> : <div className="rounded-3xl bg-white/50 py-8 text-center text-[oklch(0.5_0.04_50)]">No exclusive rewards available yet.</div>}
        </section>
      </>}
    </div>
  </div>;
}