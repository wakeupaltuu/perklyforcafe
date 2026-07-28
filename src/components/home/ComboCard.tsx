import { Star } from 'lucide-react';
import { optimizeImageUrl } from '@/lib/utils';

interface ComboCardProps {
  title: string;
  description: string;
  rating: number;
  price: number;
  originalPrice: number;
  imageUrl: string;
}

export function ComboCard({ title, description, rating, price, originalPrice, imageUrl }: ComboCardProps) {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-coffee-100 hover:shadow-md transition-shadow cursor-pointer min-w-[160px] max-w-[180px]">
      {/* Image */}
      <div className="relative h-28 overflow-hidden bg-coffee-100">
        <img
          src={optimizeImageUrl(imageUrl, 300)}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          Save ₹{originalPrice - price}
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-coffee-800 text-xs leading-tight">{title}</h3>
          <div className="flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-coffee-700">{rating}</span>
          </div>
        </div>
        <p className="text-[10px] text-coffee-500 mt-0.5 truncate">{description}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="font-bold text-coffee-800 text-sm">₹{price}</span>
          <span className="text-[10px] text-coffee-400 line-through">₹{originalPrice}</span>
        </div>
      </div>
    </div>
  );
}