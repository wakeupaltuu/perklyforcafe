import { optimizeImageUrl } from '@/lib/utils';

interface SeasonalCardProps {
  title: string;
  description: string;
  imageUrl: string;
  overlayColor: string;
}

export function SeasonalCard({ title, description, imageUrl, overlayColor }: SeasonalCardProps) {
  return (
    <div className="relative shadow-[var(--shadow-card)] rounded-[var(--radius-card)] overflow-hidden cursor-pointer active:scale-95 transition-transform">
      <img
        alt={title}
        className="object-cover w-full h-36 bg-neutral-200"
        src={optimizeImageUrl(imageUrl, 400)}
        loading="lazy"
      />
      <div className={`absolute inset-0 ${overlayColor}`} />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="type-card-title text-white">
          {title}
        </span>
        <p className="type-caption text-white/75">{description}</p>
      </div>
    </div>
  );
}
