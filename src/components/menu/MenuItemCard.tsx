import { MenuItem } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

const itemTitle = (item: MenuItem) => item.title || item.name || 'Menu item';
const image = (item: MenuItem) => item.imageUrl || item.image;
const price = (value: MenuItem['price']) => {
  if (typeof value === 'number') return `₹${value.toFixed(0)}`;
  return value ? (String(value).startsWith('₹') ? String(value) : `₹${value}`) : 'Price on request';
};

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  return (
    <button onClick={onClick} className="overflow-hidden rounded-3xl border border-neutral-100 bg-white text-left shadow-[0_12px_28px_rgba(74,49,35,.08)] transition-transform active:scale-[.98]">
      <div className="h-32 bg-[var(--color-surface-subtle)]">
        {image(item) ? <img src={image(item)} alt={itemTitle(item)} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl">☕</div>}
      </div>
      <div className="p-3">
        <h2 className="truncate text-sm font-semibold text-neutral-950">{itemTitle(item)}</h2>
        <p className="mt-1 h-10 overflow-hidden text-xs leading-5 text-neutral-500">{item.description || 'Made fresh for you.'}</p>
        <p className="mt-2 text-sm font-bold text-[var(--color-primary)]">{price(item.price)}</p>
      </div>
    </button>
  );
}
