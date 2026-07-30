import { ArrowLeft, Search } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { ProfileButton } from '@/components/ProfileButton';
import { useTenant } from '@/context/TenantContext';
import { db } from '@/lib/firebase';
import { MenuCategory, MenuItem } from '@/types';

const categoryName = (category: MenuCategory) => category.name || category.title || category.id;
const title = (item: MenuItem) => item.title || item.name || '';

export function Menu() {
  const navigate = useNavigate();
  const { cafeSlug, cafe, menuItems } = useTenant();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !cafeSlug) return;
    setLoading(false);
    const unsubscribeCategories = onSnapshot(collection(db, 'cafes', cafeSlug, 'categories'), snapshot => {
      setCategories(snapshot.docs.map(categoryDoc => ({ id: categoryDoc.id, ...categoryDoc.data() } as MenuCategory)));
    });
    return unsubscribeCategories;
  }, [cafeSlug]);

  const filteredItems = useMemo(() => menuItems.filter(item => item.isAvailable === true).filter(item => {
    const selectedName = categoryName(categories.find(category => category.id === selectedCategory) || { id: selectedCategory });
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory || item.category === selectedCategory || item.category === selectedName;
    const terms = `${title(item)} ${item.description || ''}`.toLowerCase();
    return matchesCategory && terms.includes(search.toLowerCase());
  }), [categories, menuItems, search, selectedCategory]);

  return <main className="min-h-screen bg-[#f7f1e8] px-5 pb-28 pt-8">
    <header className="flex items-center gap-3">
      <button aria-label="Back to cafe details" onClick={() => navigate('/locations')} className="rounded-full bg-white p-2.5 text-[#5c4033] shadow-sm"><ArrowLeft className="size-5" /></button>
      <div className="flex-1"><p className="text-xs uppercase tracking-[.24em] text-[#9d5126]">{cafe?.cafeName || 'Cafe'}</p><h1 className="text-2xl font-semibold text-neutral-950">Full Menu</h1></div><ProfileButton />
    </header>
    <label className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-neutral-500 shadow-sm">
      <Search className="size-5" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search the menu" className="w-full bg-transparent text-sm text-neutral-950 outline-none" />
    </label>
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
      <button onClick={() => setSelectedCategory('all')} className={`shrink-0 rounded-full px-4 py-2 text-sm ${selectedCategory === 'all' ? 'bg-[#9d5126] text-white' : 'bg-white text-[#5c4033]'}`}>All</button>
      {categories.filter(category => category.isActive !== false).map(category => <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm ${selectedCategory === category.id ? 'bg-[#9d5126] text-white' : 'bg-white text-[#5c4033]'}`}>{categoryName(category)}</button>)}
    </div>
    {loading ? <div className="py-20 text-center text-neutral-500">Loading menu…</div> : filteredItems.length ? <div className="mt-5 grid grid-cols-2 gap-4">{filteredItems.map(item => <MenuItemCard key={item.id} item={item} onClick={() => navigate(`/menu/${item.id}`)} />)}</div> : <div className="py-20 text-center"><p className="font-semibold text-neutral-800">No menu items found</p><p className="mt-1 text-sm text-neutral-500">Try another category or search term.</p></div>}
  </main>;
}
