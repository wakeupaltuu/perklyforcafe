//this is types.ts, which defines the TypeScript interfaces for the Cafe, Reward, Tier, UserProfile, Visit, and EarnedReward data structures used in the application. These interfaces provide type safety and structure for the data being managed and manipulated throughout the app, ensuring consistency and clarity in how data is represented and accessed.

export interface HeroSlide {
  imageUrl: string;
  eyebrow?: string;
  title: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface Cafe {
  id: string;
  cafeName: string;
  primaryColor: string;
  secondaryColor: string;
  theme: 'light' | 'dark';
  logoUrl: string;
  heroImageUrl: string;
  welcomeMessage: string;
  pointsPerVisit: number;
  description?: string;
  socialImage?: string;
  heroSlides?: HeroSlide[];
  /** Legacy Firestore spelling retained while existing cafe documents migrate. */
  heroSLides?: HeroSlide[];
  faviconUrl?: string;
  appleIconUrl?: string;
  icon192Url?: string;
  icon512Url?: string;
  fontFamily?: string;
  accentGradient?: string;
  backgroundPattern?: string;
}

export interface Reward {
  id: string;
  name: string;
  pointsRequired: number;
  icon: string;
  description: string;
}

export interface Tier {
  id: string;
  name: string;
  minPoints: number;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
   lastCheckIn?: string;        // ← NEW
  checkInHistory?: string[];  
  visits: number;
  visitsHistory: Visit[];
  rewardsEarned: EarnedReward[];
  onboardingCompleted: boolean;
}

export interface Visit {
  id: string;
  date: string;
  location: string;
  pointsEarned: number;
}

export interface EarnedReward {
  id: string;
  rewardId: string;
  name: string;
  dateEarned: string;
  used: boolean;
}
