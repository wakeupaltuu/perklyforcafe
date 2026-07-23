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
        <button className="size-8 bg-[oklch(0.99_0_0/0.4)] backdrop-blur-md rounded-full flex absolute right-3 top-3 justify-center items-center active:scale-95 transition-transform">
          <Heart className="size-4 text-white" />
        </button>
      </div>
      <div className="flex p-0 pt-4 flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="type-card-title text-[oklch(0.28_0.03_60)] text-[17px] mt-0.5 line-clamp-2 flex-1">
            {reward.name}
          </h3>
          {isUnlocked ? (
            <span className="type-caption bg-gradient-to-r shrink-0 from-[oklch(0.85_0.06_85)] to-[oklch(0.78_0.08_70)] text-[oklch(0.3_0.03_60)] shadow-sm rounded-full flex px-3 py-1 items-center gap-1">
              <Check className="size-3" />
              Ready
            </span>
          ) : (
            <span className="type-caption bg-[oklch(0.93_0.02_80)] shrink-0 text-[oklch(0.5_0.04_50)] rounded-full px-3 py-1 mt-0.5">
              {pointsLeft} pts left
            </span>
          )}
        </div>
        <p className="type-body text-[oklch(0.5_0.04_50)]">
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
                      ? "text-[oklch(0.72_0.09_65)] fill-[oklch(0.72_0.09_65)]" 
                      : "text-[oklch(0.85_0.02_80)]"
                  )} 
                />
              );
            })}
            <span className="type-caption text-[oklch(0.5_0.03_60)] ml-2">
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
