import { ArrowRight } from 'lucide-react';
import { optimizeImageUrl } from '@/lib/utils';

export function TodaysSpecialCard() {
  return (
    <div className="relative shadow-[var(--shadow-card)] rounded-[var(--radius-card)] overflow-hidden bg-[linear-gradient(to_right,#1A0B02,#4A2B12)] flex h-[174px] w-full mt-4 cursor-pointer active:scale-[0.98] transition-transform">
      {/* Left side Image */}
      <div className="w-[45%] h-full relative z-10 shrink-0">
        <img 
          src={optimizeImageUrl("https://images.unsplash.com/photo-1637224671997-6dd7f74092a7?auto=format&fit=crop&q=80&w=400", 400)} 
          alt="Caramel Cloud Latte"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Gradient mask to blend image into the background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#4A2B12]/40" />
      </div>

      {/* Right side Content */}
      <div className="flex-1 p-5 pl-2 flex flex-col justify-center z-20">
        <span className="type-eyebrow text-[#E08D50] tracking-[.13em] mb-1.5">
          Limited Time
        </span>
        <h3 className="type-section-title text-white text-[22px] mb-2 pr-2">
          Caramel Cloud Latte
        </h3>
        <p className="type-caption text-white/75 mb-4 pr-4">
          Smooth caramel with a creamy twist.
        </p>
        <button 
          className="type-caption bg-white text-[#D37B40] py-2 px-4 rounded-full flex items-center justify-center gap-1.5 w-fit shadow-sm"
        >
          View on Zomato
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
