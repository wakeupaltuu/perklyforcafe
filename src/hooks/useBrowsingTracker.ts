import { createContext, createElement, ReactNode, useCallback, useContext, useEffect, useRef } from 'react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { useTenant } from '@/context/TenantContext';
import { db } from '@/lib/firebase';

type ViewedItem = { category: string; itemId: string; viewedAt: number };
type BrowsingTracker = { trackView: (itemId: string, category: string) => void };
const BrowsingTrackerContext = createContext<BrowsingTracker>({ trackView: () => {} });

export function BrowsingTrackerProvider({ children }: { children: ReactNode }) {
  const { cafeSlug, user } = useTenant();
  const viewedItems = useRef<ViewedItem[]>([]);
  const flushing = useRef(false);
  const trackView = useCallback((itemId: string, category: string) => {
    if (!itemId || !category) return;
    const existing = viewedItems.current.find(item => item.itemId === itemId);
    if (existing) existing.viewedAt = Date.now();
    else viewedItems.current.push({ itemId, category, viewedAt: Date.now() });
  }, []);
  const flush = useCallback(async () => {
    if (flushing.current || !db || !cafeSlug || !user || viewedItems.current.length === 0) return;
    flushing.current = true;
    const items = viewedItems.current;
    viewedItems.current = [];
    const counts = items.reduce<Record<string, number>>((result, item) => {
      result[item.category] = (result[item.category] || 0) + 1;
      return result;
    }, {});
    try {
      await updateDoc(doc(db, `users_${cafeSlug}`, user.uid), Object.fromEntries(Object.entries(counts).map(([category, count]) => [`categoryPreferences.${category}`, increment(count)])));
    } catch (error) {
      console.error('Unable to save browsing preferences:', error);
    } finally { flushing.current = false; }
  }, [cafeSlug, user]);
  useEffect(() => {
    const onVisibilityChange = () => { if (document.visibilityState === 'hidden') void flush(); };
    const onPageHide = () => { void flush(); };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    return () => { document.removeEventListener('visibilitychange', onVisibilityChange); window.removeEventListener('pagehide', onPageHide); };
  }, [flush]);
  return createElement(BrowsingTrackerContext.Provider, { value: { trackView } }, children);
}

export function useBrowsingTracker() { return useContext(BrowsingTrackerContext); }
