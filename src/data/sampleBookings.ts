 import type { Session, SavedCoach, RecommendedCoach } from "@/types/dashboard";
 import coachSarah from "@/assets/coach-sarah.jpg";
 import coachDavid from "@/assets/coach-david.jpg";
 import coachEmily from "@/assets/coach-emily.jpg";
 import coachJames from "@/assets/coach-james.jpg";
import logoGoldman from "@/assets/logo-goldman-sachs.png";
import logoMcKinsey from "@/assets/logo-mckinsey-new.png";
import logoMeta from "@/assets/logo-meta.png";
import logoClifford from "@/assets/logo-clifford-chance.png";
import logoOxford from "@/assets/logo-oxford.png";
import logoCambridge from "@/assets/logo-cambridge.png";
import logoLSE from "@/assets/logo-lse-new.png";
import logoImperial from "@/assets/logo-imperial-new.png";
 
 // Helper to get dates relative to today
 const today = new Date();
 const tomorrow = new Date(today);
 tomorrow.setDate(today.getDate() + 1);
 const dayAfterTomorrow = new Date(today);
 dayAfterTomorrow.setDate(today.getDate() + 2);
 const lastWeek = new Date(today);
 lastWeek.setDate(today.getDate() - 7);
 const twoWeeksAgo = new Date(today);
 twoWeeksAgo.setDate(today.getDate() - 14);
 const threeWeeksAgo = new Date(today);
 threeWeeksAgo.setDate(today.getDate() - 21);
 
 export const upcomingSessions: Session[] = [
   {
     id: "session-1",
     coachId: "sarah-k",
     coachName: "Sarah K.",
     coachPhoto: coachSarah,
     coachCredential: "Goldman Sachs Spring Week '24",
    coachUniversityLogo: logoOxford,
    coachCompanyLogo: logoGoldman,
     date: tomorrow,
     time: "2:00 PM",
     duration: "45 min",
     type: "CV Review",
     status: "upcoming",
   },
   {
     id: "session-2",
     coachId: "david-w",
     coachName: "David W.",
     coachPhoto: coachDavid,
     coachCredential: "McKinsey Summer Associate",
    coachUniversityLogo: logoCambridge,
    coachCompanyLogo: logoMcKinsey,
     date: dayAfterTomorrow,
     time: "10:00 AM",
     duration: "60 min",
     type: "Mock Interview",
     status: "upcoming",
   },
 ];
 
 export const pastSessions: Session[] = [
   {
     id: "session-3",
     coachId: "sarah-k",
     coachName: "Sarah K.",
     coachPhoto: coachSarah,
     coachCredential: "Goldman Sachs Spring Week '24",
    coachUniversityLogo: logoOxford,
    coachCompanyLogo: logoGoldman,
     date: lastWeek,
     time: "3:00 PM",
     duration: "45 min",
     type: "Application Strategy",
     status: "completed",
     reviewed: true,
     rating: 5,
   },
   {
     id: "session-4",
     coachId: "james-l",
     coachName: "James L.",
     coachPhoto: coachJames,
     coachCredential: "Meta Software Engineer",
    coachUniversityLogo: logoImperial,
    coachCompanyLogo: logoMeta,
     date: twoWeeksAgo,
     time: "11:00 AM",
     duration: "60 min",
     type: "Coding Interview Prep",
     status: "completed",
     reviewed: false,
   },
   {
     id: "session-5",
     coachId: "emily-r",
     coachName: "Emily R.",
     coachPhoto: coachEmily,
     coachCredential: "Clifford Chance Trainee",
    coachUniversityLogo: logoLSE,
    coachCompanyLogo: logoClifford,
     date: threeWeeksAgo,
     time: "4:00 PM",
     duration: "45 min",
     type: "LNAT Prep",
     status: "completed",
     reviewed: true,
     rating: 4,
   },
 ];
 
 export const savedCoaches: SavedCoach[] = [
   {
     id: "sarah-k",
     name: "Sarah K.",
     photo: coachSarah,
     credential: "Goldman Sachs Incoming Analyst",
     hourlyRate: 50,
     tags: ["Investment Banking", "CV Review"],
    universityLogo: logoOxford,
    companyLogo: logoGoldman,
    rating: 4.9,
    reviewCount: 47,
   },
   {
     id: "david-w",
     name: "David W.",
     photo: coachDavid,
     credential: "McKinsey Summer Associate",
     hourlyRate: 60,
     tags: ["Consulting", "Case Studies"],
    universityLogo: logoCambridge,
    companyLogo: logoMcKinsey,
    rating: 5.0,
    reviewCount: 32,
   },
 ];
 
 export const recommendedCoaches: RecommendedCoach[] = [
   {
     id: "sarah-k",
     name: "Sarah K.",
     photo: coachSarah,
     credential: "Goldman Sachs Incoming Analyst",
     year: "Oxford '24",
     tags: ["Investment Banking", "Spring Week", "CV Review"],
     hourlyRate: 50,
    universityLogo: logoOxford,
    companyLogo: logoGoldman,
    rating: 4.9,
    reviewCount: 47,
   },
   {
     id: "david-w",
     name: "David W.",
     photo: coachDavid,
     credential: "McKinsey Summer Associate",
     year: "Cambridge '23",
     tags: ["Consulting", "Case Studies", "Strategy"],
     hourlyRate: 60,
    universityLogo: logoCambridge,
    companyLogo: logoMcKinsey,
    rating: 5.0,
    reviewCount: 32,
   },
   {
     id: "emily-r",
     name: "Emily R.",
     photo: coachEmily,
     credential: "Clifford Chance Trainee",
     year: "LSE '23",
     tags: ["Law", "TC Applications", "LNAT"],
     hourlyRate: 45,
    universityLogo: logoLSE,
    companyLogo: logoClifford,
    rating: 4.8,
    reviewCount: 28,
   },
   {
     id: "james-l",
     name: "James L.",
     photo: coachJames,
     credential: "Meta Software Engineer",
     year: "Imperial '22",
     tags: ["Software Engineering", "Coding", "System Design"],
     hourlyRate: 55,
    universityLogo: logoImperial,
    companyLogo: logoMeta,
    rating: 4.9,
    reviewCount: 41,
   },
 ];