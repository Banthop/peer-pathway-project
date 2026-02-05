 export interface Session {
   id: string;
   coachId: string;
   coachName: string;
   coachPhoto: string;
   coachCredential: string;
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
 }
 
 export interface RecommendedCoach {
   id: string;
   name: string;
   photo: string;
   credential: string;
   year: string;
   tags: string[];
   hourlyRate: number;
 }