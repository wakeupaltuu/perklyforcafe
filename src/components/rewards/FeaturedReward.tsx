import { Heart, Sparkles } from 'lucide-react';
import { Reward } from '@/types';

interface FeaturedRewardProps {
  reward: Reward;
  points: number;
  onRedeem: (reward: Reward) => void;
  isRedeeming: boolean;
}

export function FeaturedReward({ reward, points, onRedeem, isRedeeming }: FeaturedRewardProps) {
  const isUnlocked = points >= reward.pointsRequired;

  return (
    <div className="relative shadow-[var(--shadow-float)] rounded-[var(--radius-card)] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1503240778100-fd245e17a273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
        alt="Featured Reward"
        className="object-cover w-full h-56 bg-neutral-200"
        loading="lazy"
      />
      <div className="bg-gradient-to-t from-[oklch(0.25_0.03_60/0.85)] via-[oklch(0.25_0.03_60/0.3)] to-transparent absolute inset-0" />
      
      <div className="bg-[oklch(0.99_0_0/0.25)] backdrop-blur-md border-[oklch(0.99_0_0/0.35)] rounded-full border-solid border-[0.5px] flex absolute left-4 top-4 px-3 py-1 items-center gap-1.5">
        <Sparkles className="size-3.5 text-[oklch(0.99_0_0)]" />
        <span className="text-[oklch(0.99_0_0)] font-medium text-xs leading-4">
          Featured Reward
        </span>
      </div>
      
      <button className="size-9 bg-[oklch(0.99_0_0/0.25)] backdrop-blur-md border-[oklch(0.99_0_0/0.35)] rounded-full border-solid border-[0.5px] flex absolute right-4 top-4 justify-center items-center active:scale-95 transition-transform">
        <Heart className="size-4 text-white" />
      </button>
      
      <div className="flex absolute inset-x-0 bottom-0 p-5 justify-between items-end">
        <div className="flex flex-col gap-1 flex-1 pr-4">
          <h3 className="type-section-title text-[oklch(0.99_0_0)] line-clamp-1">
            {reward.name}
          </h3>
          <p className="type-body text-[oklch(0.92_0.01_80)] line-clamp-2">
            {reward.description}
          </p>
        </div>
        
        <button 
          onClick={() => onRedeem(reward)}
          disabled={!isUnlocked || isRedeeming}
          className="type-button bg-caramel text-[oklch(0.99_0_0)] shadow-md rounded-full px-6 py-2.5 active:scale-95 transition-transform disabled:opacity-50 disabled:bg-neutral-300 disabled:text-neutral-500 shrink-0"
        >
          {isRedeeming ? 'Redeeming...' : (isUnlocked ? 'Redeem' : `${reward.pointsRequired} pts`)}
        </button>
      </div>
    </div>
  );
}
