import { Crown, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { cn } from '@/lib/utils';

export function BrewPassCard() {
  const { profile, cafe } = useTenant();
  const TOTAL_STAMPS = 7; 
  const visits = profile?.visits || 0;
  const currentProgress = visits % TOTAL_STAMPS;

  return (
    <div className="px-5 pt-6 sm:px-6">
      <Link to="/pass" className="block active:scale-[0.98] transition-transform">
        <div className="relative bg-[#2F221B] bg-[linear-gradient(135deg,oklch(0.3_0.05_50/0.9),oklch(0.2_0.03_45/0.95))] shadow-[var(--shadow-float)] rounded-[var(--radius-card)] p-6 overflow-hidden border border-white/10">
          <div className="size-40 rounded-full bg-white/5 absolute -right-8 -top-10" />
          <div className="size-24 rounded-full bg-white/5 absolute right-10 bottom-2" />
          
          <div className="relative flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="type-section-title text-white tracking-[.01em]">
                {cafe?.cafeName || 'Perkly'}
              </span>
              <span className="type-caption text-white/60">
                Member Pass
              </span>
            </div>
            
          </div>
          
          <div className="relative flex mt-8 flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="type-small text-white/70">
                {TOTAL_STAMPS - currentProgress} more to a free coffee
              </span>
              <span className="type-small text-[oklch(0.82_0.09_65)]">
                {currentProgress} / {TOTAL_STAMPS}
              </span>
            </div>
            <div className="flex justify-between items-center">
              {Array.from({ length: TOTAL_STAMPS }).map((_, i) => {
                const isStamped = i < currentProgress;
                return (
                  <Coffee 
                    key={i} 
                    className={cn(
                      "size-6", 
                      isStamped ? "text-[oklch(0.82_0.09_65)]" : "text-[oklch(0.6_0.03_55)]"
                    )} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}