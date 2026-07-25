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
