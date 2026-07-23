import { Heart } from 'lucide-react';
import { optimizeImageUrl } from '@/lib/utils';

interface CoffeeCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

export function CoffeeCard({ title, description, imageUrl }: CoffeeCardProps) {
  return (
    <div className="shrink-0 w-44">
      <div className="relative shadow-[0_10px_24px_-10px_rgba(80,50,20,0.4)] rounded-3xl overflow-hidden">
        <img
          alt={title}
          className="object-cover w-full h-48 bg-neutral-200"
          src={optimizeImageUrl(imageUrl, 400)}
          loading="lazy"
        />
        <button className="size-8 backdrop-blur-sm rounded-full bg-black/25 flex absolute right-3 top-3 justify-center items-center active:scale-95 transition-transform">
          <Heart className="size-4 text-white" />
        </button>
      </div>
      <div className="flex mt-3 flex-col gap-0.5">
        <span className="type-card-title text-[oklch(0.3_0.04_50)]">
          {title}
        </span>
        <span className="type-caption text-neutral-500">
          {description}
        </span>
      </div>
    </div>
  );
}
