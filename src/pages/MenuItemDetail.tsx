import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { useBrowsingTracker } from '@/hooks/useBrowsingTracker';

export function MenuItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { menuItems } = useTenant();
  const { trackView } = useBrowsingTracker();
  const item = menuItems.find(menuItem => menuItem.id === itemId) || null;
  useEffect(() => {
    if (!itemId || !item?.category) return;
    const timeout = window.setTimeout(() => trackView(itemId, item.category!), 2000);
    return () => window.clearTimeout(timeout);
  }, [item?.category, itemId, trackView]);
  if (!menuItems.length) return <div className="min-h-screen bg-[#f7f1e8] pt-20 text-center text-neutral-500">Loading item…</div>;
  if (!item) return <div className="min-h-screen bg-[#f7f1e8] p-6 pt-20 text-center"><p className="font-semibold">This menu item is unavailable.</p><button onClick={() => navigate('/menu')} className="mt-4 text-[#9d5126]">Back to menu</button></div>;
  const image = item.imageUrl || item.image;
  const title = item.title || item.name || 'Menu item';
  const price = typeof item.price === 'number' ? `₹${item.price.toFixed(0)}` : item.price ? (String(item.price).startsWith('₹') ? item.price : `₹${item.price}`) : 'Price on request';
  const orderUrl = item.zomatoUrl || item.orderUrl || 'https://www.zomato.com/';
  return <main className="min-h-screen bg-[#f7f1e8] pb-28"><div className="relative h-72 bg-[#f0e2d2]">{image ? <img src={image} alt={title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-6xl">☕</div>}<button aria-label="Back to menu" onClick={() => navigate('/menu')} className="absolute left-5 top-5 rounded-full bg-white/95 p-3 text-[#5c4033] shadow"><ArrowLeft className="size-5" /></button></div><section className="-mt-6 rounded-t-[2rem] bg-[#f7f1e8] px-6 pt-7"><p className="text-sm font-semibold text-[#9d5126]">{price}</p><h1 className="mt-1 text-3xl font-semibold text-neutral-950">{title}</h1><p className="mt-4 text-base leading-7 text-neutral-600">{item.description || 'A freshly prepared cafe favorite.'}</p><a href={orderUrl} target="_blank" rel="noreferrer" className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-[#e23744] px-5 py-4 font-semibold text-white shadow-lg">Order via Zomato <ExternalLink className="size-4" /></a></section></main>;
}
