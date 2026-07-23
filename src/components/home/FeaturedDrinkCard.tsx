import { Heart } from 'lucide-react';
import { optimizeImageUrl } from '@/lib/utils';

interface FeaturedDrinkCardProps {
  title: string;
  price: string;
  imageUrl: string;
  hasHeart?: boolean;
}

export function FeaturedDrinkCard({ title, price, imageUrl, hasHeart = false }: FeaturedDrinkCardProps) {
  return (
    <div className="surface-card overflow-hidden cursor-pointer active:scale-95 transition-transform">
      <div className="relative">
        <img
          alt={title}
          className="object-cover w-full h-32 bg-neutral-200"
          src={optimizeImageUrl(imageUrl, 400)}
          loading="lazy"
        />
        {hasHeart && (
          <button className="size-8 backdrop-blur-sm rounded-full bg-black/25 flex absolute right-2.5 top-2.5 justify-center items-center">
            <Heart className="size-4 text-white" />
          </button>
        )}
      </div>
      <div className="flex p-3 justify-between items-center">
        <span className="type-card-title text-ink">
          {title}
        </span>
        <span className="type-caption text-caramel">
          {price}
        </span>
      </div>
    </div>
  );
}
