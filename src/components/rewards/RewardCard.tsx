import { Check, Coffee, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reward } from '@/types';

interface RewardCardProps {
  reward: Reward;
  points: number;
  onRedeem: (reward: Reward) => void;
  isRedeeming: boolean;
  imageUrl?: string;
}

export function RewardCard({ reward, points, onRedeem, isRedeeming, imageUrl }: RewardCardProps) {
  const isUnlocked = points >= reward.pointsRequired;
  const pointsLeft = Math.max(0, reward.pointsRequired - points);
  
  // Calculate cups out of 5
  const progressRatio = Math.min(1, points / reward.pointsRequired);
  const cupsFilled = Math.floor(progressRatio * 5);
  
  // A default image logic based on reward name if no image provided
  const getFallbackImage = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('croissant') || lowerName.includes('pastry')) {
      return 'https://images.unsplash.com/photo-1658740880239-1285ab14670c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
    }
    if (lowerName.includes('espresso') || lowerName.includes('shot')) {
      return 'https://images.unsplash.com/photo-1627902511858-6ad7e004fd35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
    }
    if (lowerName.includes('bean') || lowerName.includes('roast')) {
      return 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
    }
    // Default coffee
    return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
  };

  const finalImageUrl = imageUrl || getFallbackImage(reward.name);

  return (
    <div className="surface-card p-4 gap-4 mb-4 flex flex-col">
      <div className="relative rounded-[20px] overflow-hidden">
        <img
          src={finalImageUrl}
          alt={reward.name}
          className="object-cover w-full h-40 bg-neutral-200"
          loading="lazy"
        />
        <button className="size-8 bg-white/40 backdrop-blur-md rounded-full flex absolute right-3 top-3 justify-center items-center active:scale-95 transition-transform">
          <Heart className="size-4 text-white" />
        </button>
      </div>
      <div className="flex p-0 pt-4 flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="type-card-title text-[var(--color-text)] text-[17px] mt-0.5 line-clamp-2 flex-1">
            {reward.name}
          </h3>
          {isUnlocked ? (
            <span className="type-caption bg-gradient-to-r shrink-0 from-[var(--color-primary-light)] to-[var(--color-accent)] text-[var(--color-text)] shadow-sm rounded-full flex px-3 py-1 items-center gap-1">
              <Check className="size-3" />
              Ready
            </span>
          ) : (
            <span className="type-caption bg-[var(--color-surface-subtle)] shrink-0 text-[var(--color-text-muted)] rounded-full px-3 py-1 mt-0.5">
              {pointsLeft} pts left
            </span>
          )}
        </div>
        <p className="type-body text-[var(--color-text-muted)]">
          {reward.description}
        </p>
        
        <div className="flex pt-1 items-center justify-between">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => {
              const isFilled = i < cupsFilled;
              return (
                <Coffee 
                  key={i}
                  className={cn(
                    "size-4 transition-colors",
                    isFilled 
                      ? "text-[var(--color-primary-light)] fill-[var(--color-primary-light)]" 
                      : "text-[var(--color-border)]"
                  )} 
                />
              );
            })}
            <span className="type-caption text-[var(--color-text-muted)] ml-2">
              {points} / {reward.pointsRequired} pts
            </span>
          </div>
          
          {isUnlocked && (
            <button
              onClick={() => onRedeem(reward)}
              disabled={isRedeeming}
              className="type-caption bg-caramel text-white px-3 py-1.5 rounded-full active:scale-95 transition-transform disabled:opacity-50"
            >
              {isRedeeming ? 'Redeeming...' : 'Redeem'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
