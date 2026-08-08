//this is types.ts, which defines the TypeScript interfaces for the Cafe, Reward, Tier, UserProfile, Visit, and EarnedReward data structures used in the application. These interfaces provide type safety and structure for the data being managed and manipulated throughout the app, ensuring consistency and clarity in how data is represented and accessed.

export interface HeroSlide {
  imageUrl: string;
  eyebrow?: string;
  title: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface TodaysSpecial {
  id: string;
  imageUrl: string;
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  days: string[];
  isActive: boolean;
}

export interface HomeContent {
  todaysSpecial?: TodaysSpecial[];
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
  homeContent?: HomeContent;
  zomatoUrl?: string;
  /** Legacy global ordering URL retained for existing cafe documents. */
  orderUrl?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  review: string;
  rating: number;
  verified: boolean;
  displayOrder: number;
}

export interface Founder {
  name: string;
  role: string;
  story: string;
  imageUrl: string;
}

export interface CafeRating {
  value: number;
  reviewCount: number;
}

export interface CafeLocation {
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
}

export interface CafeStory {
  title: string;
  body: string;
}

export interface CafeOffer {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export interface CafeContact {
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface CafeHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface CafeLinks {
  directions: string;
  googleReviews: string;
  instagram?: string;
  zomato?: string;
}

export interface SectionTitle {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface CafeSectionTitles {
  gallery?: SectionTitle;
  reviews?: SectionTitle;
}

export interface CafeDetails {
  contact: CafeContact;
  hours: CafeHours;
  rating: CafeRating;
  location: CafeLocation;
  links: CafeLinks;
  offer: CafeOffer;
  story: CafeStory;
  founder: Founder;
  customerReviews: CustomerReview[];
  amenities: string[];
  galleryImages?: string[];
  sectionTitles?: CafeSectionTitles;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: 'active' | 'exclusive';
  type: 'free_item' | 'discount' | 'buy_x_get_y';
  pointsRequired: number;
  itemId?: string;
  itemName?: string;
  minOrderValue?: number;
  validityDays?: number;
  maxRedemptionsPerCustomer?: number;
  imageUrl?: string;
  badge?: string;
  isActive: boolean;
  createdAt?: { toMillis?: () => number } | string | number;
  updatedAt?: { toMillis?: () => number } | string | number;
  /** Legacy fields retained only for older customer UI components. */
  name?: string;
  icon?: string;
}

export interface MenuCategory {
  id: string;
  name?: string;
  title?: string;
  isActive?: boolean;
}

export interface MenuItem {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  price?: number | string;
  categoryId?: string;
  category?: string;
  isAvailable?: boolean;
  featured?: boolean;
  popular?: boolean;
  isPopular?: boolean;
  zomatoUrl?: string;
  orderUrl?: string;
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
  categoryPreferences?: Record<string, number>;
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
