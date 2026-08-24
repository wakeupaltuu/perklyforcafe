import { useCallback, useEffect, useState } from 'react';
import { collection, doc, documentId, getDoc, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MenuCategory, MenuItem } from '@/types';

const DEFAULT_PAGE_SIZE = 20;

interface MenuCacheEntry {
  categories: MenuCategory[];
  items: MenuItem[];
  hasMore: boolean;
  lastDocId?: string;
}

const menuCache = new Map<string, MenuCacheEntry>();
const menuPageRequests = new Map<string, Promise<MenuItem[]>>();

async function fetchCategories(cafeSlug: string): Promise<MenuCategory[]> {
  const cachedEntry = menuCache.get(cafeSlug);

  if (cachedEntry && cachedEntry.categories.length) {
    return cachedEntry.categories;
  }

  const categoriesSnap = await getDocs(collection(db, 'cafes', cafeSlug, 'categories'));
  const categories = categoriesSnap.docs.map((categoryDoc) => ({
    id: categoryDoc.id,
    ...categoryDoc.data(),
  } as MenuCategory));

  const entry = menuCache.get(cafeSlug) ?? {
    categories: [],
    items: [],
    hasMore: true,
  };

  entry.categories = categories;
  menuCache.set(cafeSlug, entry);

  return categories;
}

async function fetchMenuPage(cafeSlug: string, pageSize: number, reset = false): Promise<MenuItem[]> {
  const key = `${cafeSlug}:${reset ? 'reset' : 'append'}`;
  const existingRequest = menuPageRequests.get(key);

  if (existingRequest) {
    return existingRequest;
  }

  const entry = menuCache.get(cafeSlug) ?? {
    categories: [],
    items: [],
    hasMore: true,
  };

  if (reset) {
    entry.items = [];
    entry.lastDocId = undefined;
    entry.hasMore = true;
  }

  const menuRef = collection(db, 'cafes', cafeSlug, 'menu');
  const nextQuery = entry.lastDocId
    ? query(menuRef, orderBy(documentId()), startAfter(entry.lastDocId), limit(pageSize))
    : query(menuRef, orderBy(documentId()), limit(pageSize));

  const request = getDocs(nextQuery)
    .then((menuSnap) => {
      const nextItems = menuSnap.docs.map((menuDoc) => ({
        id: menuDoc.id,
        ...menuDoc.data(),
      } as MenuItem));

      const mergedItems = reset ? nextItems : [...entry.items, ...nextItems];
      const uniqueItems = new Map<string, MenuItem>();
      mergedItems.forEach((item) => uniqueItems.set(item.id, item));

      entry.items = [...uniqueItems.values()];
      entry.hasMore = menuSnap.docs.length === pageSize;
      entry.lastDocId = menuSnap.docs.length ? menuSnap.docs[menuSnap.docs.length - 1].id : undefined;

      if (menuSnap.docs.length < pageSize) {
        entry.hasMore = false;
      }

      menuCache.set(cafeSlug, entry);
      return entry.items;
    })
    .finally(() => {
      menuPageRequests.delete(key);
    });

  menuPageRequests.set(key, request);
  return request;
}

export function useMenuData(cafeSlug?: string, { pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const syncFromCache = useCallback((currentCafeSlug: string) => {
    const cached = menuCache.get(currentCafeSlug);
    if (!cached) return;

    setCategories(cached.categories);
    setMenuItems(cached.items);
    setHasMore(cached.hasMore);
  }, []);

  useEffect(() => {
    if (!cafeSlug || !db) {
      setCategories([]);
      setMenuItems([]);
      setLoading(false);
      setLoadingMore(false);
      setHasMore(false);
      return;
    }

    let isActive = true;

    const loadMenuData = async () => {
      setLoading(true);

      try {
        const nextCategories = await fetchCategories(cafeSlug);
        const nextItems = await fetchMenuPage(cafeSlug, pageSize, true);

        if (!isActive) return;

        setCategories(nextCategories);
        setMenuItems(nextItems);
        setHasMore(menuCache.get(cafeSlug)?.hasMore ?? false);
      } catch (error) {
        console.error('Error loading menu data:', error);

        if (isActive) {
          setCategories([]);
          setMenuItems([]);
          setHasMore(false);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    syncFromCache(cafeSlug);
    loadMenuData();

    return () => {
      isActive = false;
    };
  }, [cafeSlug, pageSize, syncFromCache]);

  const loadMore = useCallback(async () => {
    if (!cafeSlug || !db || loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);

    try {
      const nextItems = await fetchMenuPage(cafeSlug, pageSize, false);
      const cached = menuCache.get(cafeSlug);
      setMenuItems(nextItems);
      setHasMore(cached?.hasMore ?? false);
    } catch (error) {
      console.error('Error loading more menu items:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [cafeSlug, db, hasMore, loadingMore, pageSize]);

  const getMenuItemById = useCallback(async (itemId: string) => {
    if (!cafeSlug || !db) {
      return null;
    }

    const cachedEntry = menuCache.get(cafeSlug);
    const currentItem = cachedEntry?.items.find((item) => item.id === itemId)
      || menuItems.find((item) => item.id === itemId)
      || null;

    if (currentItem) {
      return currentItem;
    }

    const itemSnap = await getDoc(doc(db, 'cafes', cafeSlug, 'menu', itemId));

    if (!itemSnap.exists()) {
      return null;
    }

    const item = { id: itemSnap.id, ...itemSnap.data() } as MenuItem;

    const nextEntry = menuCache.get(cafeSlug) ?? {
      categories: [],
      items: [],
      hasMore: false,
    };

    const nextItems = [...nextEntry.items.filter((existingItem) => existingItem.id !== itemId), item];
    nextEntry.items = nextItems;
    menuCache.set(cafeSlug, nextEntry);
    setMenuItems(nextItems);

    return item;
  }, [cafeSlug, menuItems]);

  return {
    categories,
    menuItems,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    getMenuItemById,
  };
}