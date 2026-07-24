//this is HeroBanner.tsx

import { optimizeImageUrl } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';
import { useNavigate } from 'react-router-dom';

export function HeroBanner() {
  const { cafe } = useTenant();
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-1 sm:px-6">
      <div 
        className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-float)]"
      >
        <img
          alt={cafe?.cafeName || 'Cafe'}
          className="object-cover w-full h-[236px]"
          src={optimizeImageUrl(cafe?.heroImageUrl || 'https://images.unsplash.com/photo-1579265898841-79c7890d69cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydCUyMGNvZmZlZSUyMGN1cCUyMGdvbGRlbiUyMGJva2VoJTIwd2FybXxlbnwxfDB8fHwxNzg0Nzc1OTc4fDA&ixlib=rb-4.1.0&q=80&w=400', 400)}
          loading="lazy"
        />
        <div className="bg-[linear-gradient(0deg,rgba(38,21,12,.9),rgba(38,21,12,.18))] absolute inset-0" />
        <div className="flex absolute inset-0 p-6 flex-col justify-end gap-3">
          <span className="type-eyebrow text-white/75 tracking-[.22em]">
            Fresh Roast
          </span>
          <h2 className="type-section-title max-w-[82%] text-white text-[26px] leading-8">
            Start your day the {cafe?.cafeName || 'Perkly'} way
          </h2>
          <button 
            onClick={() => navigate('/scan')}
            className="type-button bg-caramel shadow-[0_6px_16px_-4px_rgba(60,30,10,.65)] rounded-full text-white mt-1 px-5 py-2.5 w-fit active:scale-95 transition-transform"
          >
            Check in now
          </button>
        </div>
      </div>
    </div>
  );
}
