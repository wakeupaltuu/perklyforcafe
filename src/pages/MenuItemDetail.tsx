import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { useCafeDetails } from '@/hooks/useCafeDetails';
import { useMenuData } from '@/hooks/useMenuData';
import { useBrowsingTracker } from '@/hooks/useBrowsingTracker';
import { MenuItem } from '@/types';

export function MenuItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { cafe, cafeSlug } = useTenant();
  const { menuItems, loading: menuLoading, getMenuItemById } = useMenuData(cafeSlug);
  const { cafeDetails } = useCafeDetails(cafeSlug);
  const { trackView } = useBrowsingTracker();
  const [resolvedItem, setResolvedItem] = useState<MenuItem | null>(null);
  const item = resolvedItem || menuItems.find(menuItem => menuItem.id === itemId) || null;

  useEffect(() => {
    if (!itemId || item) return;

    let isActive = true;
    getMenuItemById(itemId).then((nextItem) => {
      if (isActive) {
        setResolvedItem(nextItem);
      }
    });

    return () => {
      isActive = false;
    };
  }, [getMenuItemById, item, itemId]);

  useEffect(() => {
    if (!itemId || !item?.category) return;
    const timeout = window.setTimeout(() => trackView(itemId, item.category!), 2000);
    return () => window.clearTimeout(timeout);
  }, [item?.category, itemId, trackView]);
  if (menuLoading && !resolvedItem) return <div className="min-h-screen bg-[var(--color-background)] pt-20 text-center text-neutral-500">Loading item…</div>;
  if (!item) return <div className="min-h-screen bg-[var(--color-background)] p-6 pt-20 text-center"><p className="font-semibold">This menu item is unavailable.</p><button onClick={() => navigate('/menu')} className="mt-4 text-[var(--color-primary)]">Back to menu</button></div>;
  const image = item.imageUrl || item.image;
  const title = item.title || item.name || 'Menu item';
  const price = typeof item.price === 'number' ? `₹${item.price.toFixed(0)}` : item.price ? (String(item.price).startsWith('₹') ? item.price : `₹${item.price}`) : 'Price on request';
  const orderUrl = item.zomatoUrl?.trim() || cafeDetails?.links?.zomato?.trim() || cafe?.zomatoUrl?.trim() || cafe?.orderUrl?.trim();
  const orderButtonClass = "mt-8 flex items-center justify-center gap-2 rounded-2xl bg-[#e23744] px-5 py-4 font-semibold text-white shadow-lg";
  return <main className="min-h-screen bg-[var(--color-background)] pb-28"><div className="relative h-72 bg-[var(--color-surface-subtle)]">{image ? <img src={image} alt={title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-6xl">☕</div>}<button aria-label="Back to menu" onClick={() => navigate('/menu')} className="absolute left-5 top-5 rounded-full bg-white/95 p-3 text-[var(--color-text-muted)] shadow"><ArrowLeft className="size-5" /></button></div><section className="-mt-6 rounded-t-[2rem] bg-[var(--color-background)] px-6 pt-7"><p className="text-sm font-semibold text-[var(--color-primary)]">{price}</p><h1 className="mt-1 text-3xl font-semibold text-neutral-950">{title}</h1><p className="mt-4 text-base leading-7 text-neutral-600">{item.description || 'A freshly prepared cafe favorite.'}</p>{orderUrl ? <a href={orderUrl} target="_blank" rel="noreferrer" className={orderButtonClass}>Order via Zomato <ExternalLink className="size-4" /></a> : <button type="button" disabled aria-disabled="true" className={`${orderButtonClass} cursor-not-allowed opacity-50`}>Order via Zomato <ExternalLink className="size-4" /></button>}</section></main>;
}
