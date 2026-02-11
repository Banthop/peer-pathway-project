export interface CoachService {
  name: string;
  duration: string;
  price: number;
  description: string;
}

export interface CoachExperience {
  logo: string;
  role: string;
  company: string;
  dates: string;
  description?: string;
  skills?: string[];
}

export interface CoachEducation {
  logo: string;
  institution: string;
  degree: string;
  years: string;
  achievement?: string;
}

export interface CoachReview {
  name: string;
  date: string;
  rating: number;
  text: string;
  outcome?: string;
}

export interface Coach {
  id: string;
  name: string;
  tagline: string;
  photo: string;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  followers: number;
  university: {
    name: string;
    logo: string;
    degree: string;
    years: string;
  };
  company: {
    name: string;
    logo: string;
    role: string;
  };
  successCompanies: { name: string; logo: string }[];
  bio: string;
  skills: string[];
  services: CoachService[];
  hourlyRate: number;
  experience: CoachExperience[];
  education: CoachEducation[];
  reviews: CoachReview[];
  ratings: {
    knowledge: number;
    value: number;
    responsiveness: number;
    supportiveness: number;
  };
  availability: {
    nextSlot: string;
    timezone: string;
  };
  package?: {
    name: string;
    sessions: number;
    price: number;
    originalPrice: number;
    includes: string;
  };
  availableSlots?: { day: string; time: string }[];
  ucatScores?: { section: string; score: number; max: number }[];
  ucatSJTBand?: number;
  landedOfferLabels?: string[];
  upcomingEvent?: {
    title: string;
    description: string;
    date: string;
    time: string;
    price: string;
    spotsLeft: number;
  };
}
