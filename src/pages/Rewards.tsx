import { useState } from 'react';
import { Coffee } from 'lucide-react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTenant } from '@/context/TenantContext';
import { Reward } from '@/types';
import { RewardCard } from '@/components/rewards/RewardCard';
import { FeaturedReward } from '@/components/rewards/FeaturedReward';
import { cn } from '@/lib/utils';

export function Rewards() {
  const { user, profile, cafeSlug, rewards } = useTenant();
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleRedeem = async (reward: Reward) => {
    if (!user || !profile || !cafeSlug || profile.points < reward.pointsRequired) return;
    
    setRedeeming(reward.id);
    try {
      const userRef = doc(db, `users_${cafeSlug}`, user.uid);
      await updateDoc(userRef, {
        points: increment(-reward.pointsRequired),
        rewardsEarned: arrayUnion({
          id: Date.now().toString(),
          rewardId: reward.id,
          name: reward.name,
          dateEarned: new Date().toISOString(),
          used: false
        })
      });
    } catch (err) {
      console.error("Error redeeming reward", err);
    }
    setRedeeming(null);
  };

  const points = profile?.points || 0;
  
  // Create featured vs list rewards
  const featuredReward = rewards.length > 0 ? rewards[0] : null;
  const listRewards = rewards.length > 1 ? rewards.slice(1) : [];

  const categories = ['All', 'Drinks', 'Pastries', 'Merch'];

  return (
    <div className="app-page flex flex-col w-full overflow-x-hidden">
      <div className="page-shell flex flex-col flex-1 gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h1 className="type-display-lg text-ink">
              Rewards
            </h1>
            <p className="type-body text-[oklch(0.5_0.03_60)] mt-2">
              Collect perks with every sip and stay.
            </p>
          </div>
          <div className="size-11 bg-caramel shadow-[var(--shadow-card)] rounded-full flex justify-center items-center shrink-0">
            <Coffee className="size-5 text-[oklch(0.99_0_0)] stroke-[1.5]" />
          </div>
        </div>
        
        {/* Categories (Static UI mapping) */}
        <div className="overflow-x-auto no-scrollbar flex items-center gap-2 -mx-6 px-6">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "type-small whitespace-nowrap transition-colors rounded-full px-5 py-2",
                activeCategory === cat 
                  ? "bg-[oklch(0.28_0.03_60)] text-white shadow-sm" 
                  : "bg-white/50 text-[oklch(0.5_0.03_60)] hover:bg-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Featured Reward */}
        {featuredReward && (
          <FeaturedReward 
            reward={featuredReward} 
            points={points} 
            onRedeem={handleRedeem}
            isRedeeming={redeeming === featuredReward.id}
          />
        )}

        {/* Regular Rewards List */}
        {listRewards.length === 0 && !featuredReward ? (
           <div className="text-center py-10 text-[oklch(0.5_0.04_50)] bg-white/50 rounded-3xl mt-4">No rewards available yet.</div>
        ) : (
          <div className="flex flex-col">
            {listRewards.map((reward, index) => (
              <div key={reward.id}>
                {index > 0 && <div className="bg-[oklch(0.9_0.01_80)] h-px mb-4 ml-4 mr-4" />}
                <RewardCard 
                  reward={reward} 
                  points={points} 
                  onRedeem={handleRedeem}
                  isRedeeming={redeeming === reward.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
