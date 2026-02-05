 export interface Session {
   id: string;
   coachId: string;
   coachName: string;
   coachPhoto: string;
   coachCredential: string;
  coachUniversityLogo?: string;
  coachCompanyLogo?: string;
   date: Date;
   time: string;
   duration: string;
   type: string;
   status: "upcoming" | "completed" | "cancelled";
   reviewed?: boolean;
   rating?: number;
 }
 
 export interface SavedCoach {
   id: string;
   name: string;
   photo: string;
   credential: string;
   hourlyRate: number;
   tags: string[];
  universityLogo?: string;
  companyLogo?: string;
  rating?: number;
  reviewCount?: number;
 }
 
 export interface RecommendedCoach {
   id: string;
   name: string;
   photo: string;
   credential: string;
   year: string;
   tags: string[];
   hourlyRate: number;
  universityLogo?: string;
  companyLogo?: string;
  rating?: number;
  reviewCount?: number;
 }