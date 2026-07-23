import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Cafe, Reward, Tier, UserProfile } from '@/types';

interface TenantContextType {
  cafeSlug: string | undefined;
  cafe: Cafe | null;
  rewards: Reward[];
  tiers: Tier[];
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  cafeSlug: undefined,
  cafe: null,
  rewards: [],
  tiers: [],
  user: null,
  profile: null,
  loading: true,
  error: null,
  refreshProfile: async () => {},
});

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const { cafeSlug } = useParams<{ cafeSlug: string }>();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cafeSlug || !db) return;

    let unsubscribeProfile: (() => void) | undefined;

    const loadTenant = async () => {
      setLoading(true);
      try {
        // Fetch Cafe
        const cafeRef = doc(db, 'cafes', cafeSlug);
        const cafeSnap = await getDoc(cafeRef);
        
        if (cafeSnap.exists()) {
          setCafe({ id: cafeSnap.id, ...cafeSnap.data() } as Cafe);
          setError(null);
        } else {
          setCafe(null);
          setError(`Cafe "${cafeSlug}" not found. Please check the URL.`);
        }

        // Fetch Rewards
        const rewardsSnap = await getDocs(collection(db, 'cafes', cafeSlug, 'rewards'));
        setRewards(rewardsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reward)));

        // Fetch Tiers
        const tiersSnap = await getDocs(collection(db, 'cafes', cafeSlug, 'tiers'));
        setTiers(tiersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tier)));

      } catch (err) {
        console.error('Error loading tenant data:', err);
      }
      setLoading(false);
    };

    loadTenant();

    const unsubscribeAuth = auth ? onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Check if cafe exists before proceeding
        const cafeRef = doc(db, 'cafes', cafeSlug);
        const cafeSnap = await getDoc(cafeRef);
        
        if (!cafeSnap.exists()) {
          setProfile(null);
          return;
        }

        // Subscribe to user profile
        const userRef = doc(db, `users_${cafeSlug}`, firebaseUser.uid);
        
        // Ensure user doc exists
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: firebaseUser.displayName || 'Coffee Lover',
            email: firebaseUser.email || '',
            points: 0,
            visits: 0,
            visitsHistory: [],
            rewardsEarned: [],
            onboardingCompleted: false,
            createdAt: new Date().toISOString()
          });
        }

        unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
          }
        });
      } else {
        setProfile(null);
        if (unsubscribeProfile) unsubscribeProfile();
      }
    }) : () => {};

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [cafeSlug]);

  // Apply cafe branding to CSS variables
  useEffect(() => {
    if (cafe) {
      document.documentElement.style.setProperty('--color-accent', cafe.primaryColor);
      document.documentElement.style.setProperty('--color-coffee-700', cafe.secondaryColor);
    }
  }, [cafe]);

  const refreshProfile = async () => {
    // For manual refreshes if needed
  };

  return (
    <TenantContext.Provider value={{ cafeSlug, cafe, rewards, tiers, user, profile, loading, error, refreshProfile }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
