import { ArrowLeft, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { ProfileButton } from '@/components/ProfileButton';
import { useTenant } from '@/context/TenantContext';
import { useMenuData } from '@/hooks/useMenuData';
import { MenuCategory, MenuItem } from '@/types';

const categoryName = (category: MenuCategory) => category.name || category.title || category.id;
const title = (item: MenuItem) => item.title || item.name || '';

export function Menu() {
  const navigate = useNavigate();
  const { cafeSlug, cafe, menuItems: tenantMenuItems } = useTenant();
  const { categories, menuItems, loading, loadingMore, hasMore, loadMore } = useMenuData(cafeSlug);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const effectiveMenuItems = menuItems.length ? menuItems : tenantMenuItems;

  const filteredItems = useMemo(() => effectiveMenuItems.filter(item => item.isAvailable === true).filter(item => {
    const selectedName = categoryName(categories.find(category => category.id === selectedCategory) || { id: selectedCategory });
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory || item.category === selectedCategory || item.category === selectedName;
    const terms = `${title(item)} ${item.description || ''}`.toLowerCase();
    return matchesCategory && terms.includes(search.toLowerCase());
  }), [categories, effectiveMenuItems, search, selectedCategory]);

  useEffect(() => {
    if (!loaderRef.current || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        loadMore();
      }
    }, { rootMargin: '200px' });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore, loading, loadingMore]);

  return <main className="min-h-screen bg-[var(--color-background)] px-5 pb-28 pt-8">
    <header className="flex items-center gap-3">
      <button aria-label="Back to cafe details" onClick={() => navigate('/locations')} className="rounded-full bg-white p-2.5 text-[var(--color-text-muted)] shadow-sm"><ArrowLeft className="size-5" /></button>
      <div className="flex-1"><p className="text-xs uppercase tracking-[.24em] text-[var(--color-primary)]">{cafe?.cafeName || 'Cafe'}</p><h1 className="text-2xl font-semibold text-neutral-950">Full Menu</h1></div><ProfileButton />
    </header>
    <label className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-neutral-500 shadow-sm">
      <Search className="size-5" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search the menu" className="w-full bg-transparent text-sm text-neutral-950 outline-none" />
    </label>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
      <button onClick={() => setSelectedCategory('all')} className={`shrink-0 rounded-full px-4 py-2 text-sm ${selectedCategory === 'all' ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text-muted)]'}`}>All</button>
      {categories.filter(category => category.isActive !== false).map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm ${selectedCategory === category.id ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-[var(--color-text-muted)]'}`}>{categoryName(category)}</button>)}
    </div>
    {loading ? <div className="py-20 text-center text-neutral-500">Loading menu…</div> : filteredItems.length ? <div className="mt-5 grid grid-cols-2 gap-4">{filteredItems.map(item => <MenuItemCard key={item.id} item={item} onClick={() => navigate(`/menu/${item.id}`)} />)}</div> : <div className="py-20 text-center"><p className="font-semibold text-neutral-800">No menu items found</p><p className="mt-1 text-sm text-neutral-500">Try another category or search term.</p></div>}
    <div ref={loaderRef} className="h-1" aria-hidden="true" />
  </main>;
}
