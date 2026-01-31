import type { Coach } from "@/types/coach";
import coachSarah from "@/assets/coach-sarah.jpg";
import coachDavid from "@/assets/coach-david.jpg";
import logoOxford from "@/assets/logo-oxford.png";
import logoCambridge from "@/assets/logo-cambridge.png";
import logoGoldman from "@/assets/logo-goldman-sachs.png";
import logoMcKinsey from "@/assets/logo-mckinsey-new.png";
import logoJPMorgan from "@/assets/logo-jpmorgan-new.png";

export const sampleCoaches: Record<string, Coach> = {
  "sarah-k": {
    id: "sarah-k",
    name: "Sarah K.",
    tagline: "Helping you land your dream offer at top investment banks",
    photo: coachSarah,
    rating: 4.9,
    reviewCount: 127,
    sessionsCompleted: 127,
    followers: 24,
    university: {
      name: "University of Oxford",
      logo: logoOxford,
      degree: "BA Philosophy, Politics & Economics",
      years: "2021 - 2024",
    },
    company: {
      name: "Goldman Sachs",
      logo: logoGoldman,
      role: "Incoming Analyst",
    },
    successCompanies: [
      { name: "Goldman Sachs", logo: logoGoldman },
      { name: "McKinsey", logo: logoMcKinsey },
      { name: "JP Morgan", logo: logoJPMorgan },
    ],
    bio: `I'm Sarah, an incoming Investment Banking Analyst at Goldman Sachs and recent Oxford PPE graduate. Having navigated the competitive world of finance recruiting myself, I understand exactly what it takes to stand out and secure offers at top-tier banks.

My approach focuses on practical, actionable guidance tailored to your specific goals. Whether you're preparing for spring week applications, summer internships, or full-time roles, I'll help you craft compelling applications and ace your interviews.

I've helped over 120 students secure offers at firms including Goldman Sachs, Morgan Stanley, JP Morgan, and Barclays. My coaching covers everything from CV optimisation and cover letters to technical and behavioural interview preparation.

Outside of coaching, I'm passionate about increasing diversity in finance and regularly volunteer with organisations supporting underrepresented students in their career journeys.`,
    skills: [
      "Interview Prep",
      "CV Review",
      "Spring Week Apps",
      "Investment Banking",
      "Assessment Centres",
      "Cover Letters",
    ],
    services: [
      {
        name: "CV & Cover Letter Review",
        duration: "45 min",
        price: 40,
        description:
          "Detailed feedback on your application materials with specific improvements",
      },
      {
        name: "Mock Interview",
        duration: "60 min",
        price: 60,
        description:
          "Realistic interview practice with feedback on technicals and behavioural questions",
      },
      {
        name: "Application Strategy",
        duration: "45 min",
        price: 45,
        description:
          "Personalised guidance on firm selection, timeline, and application approach",
      },
    ],
    hourlyRate: 50,
    experience: [
      {
        logo: logoGoldman,
        role: "Incoming Analyst",
        company: "Goldman Sachs",
        dates: "Starting 2025",
        description: "Investment Banking Division",
      },
      {
        logo: logoGoldman,
        role: "Summer Analyst",
        company: "Goldman Sachs",
        dates: "Summer 2024",
        description: "M&A team in London",
      },
      {
        logo: logoJPMorgan,
        role: "Spring Intern",
        company: "JP Morgan",
        dates: "Spring 2023",
        description: "Global Banking programme",
      },
    ],
    education: [
      {
        logo: logoOxford,
        institution: "University of Oxford",
        degree: "BA Philosophy, Politics & Economics",
        years: "2021 - 2024",
        achievement: "First Class Honours",
      },
    ],
    reviews: [
      {
        name: "James T.",
        date: "2 weeks ago",
        rating: 5,
        text: "Sarah was incredibly helpful in preparing me for my Goldman Sachs interview. Her insider knowledge and practical tips made all the difference. I got the offer!",
        outcome: "Goldman Sachs Offer",
      },
      {
        name: "Priya M.",
        date: "1 month ago",
        rating: 5,
        text: "Fantastic CV review session. Sarah completely transformed my CV and helped me highlight the right experiences. Highly recommend!",
        outcome: "JP Morgan Interview",
      },
      {
        name: "Oliver H.",
        date: "1 month ago",
        rating: 5,
        text: "The mock interview was intense but exactly what I needed. Sarah's feedback was specific and actionable. Felt so much more confident going into my real interview.",
      },
      {
        name: "Sophie L.",
        date: "2 months ago",
        rating: 4,
        text: "Great session on application strategy. Sarah helped me create a realistic timeline and prioritise my target firms effectively.",
        outcome: "Multiple Spring Week Offers",
      },
      {
        name: "Alex C.",
        date: "2 months ago",
        rating: 5,
        text: "Sarah's guidance on technical interview prep was excellent. She explained complex concepts clearly and provided great resources for further practice.",
        outcome: "Morgan Stanley Offer",
      },
      {
        name: "Emma W.",
        date: "3 months ago",
        rating: 5,
        text: "Invaluable help with my cover letters. Sarah knows exactly what recruiters are looking for and helped me stand out from other applicants.",
      },
    ],
    ratings: {
      knowledge: 5.0,
      value: 4.8,
      responsiveness: 5.0,
      supportiveness: 4.9,
    },
    availability: {
      nextSlot: "Today 6:00 PM",
      timezone: "GMT",
    },
  },
  "david-w": {
    id: "david-w",
    name: "David W.",
    tagline: "Your guide to breaking into top consulting firms",
    photo: coachDavid,
    rating: 5.0,
    reviewCount: 89,
    sessionsCompleted: 89,
    followers: 31,
    university: {
      name: "University of Cambridge",
      logo: logoCambridge,
      degree: "BA Economics",
      years: "2020 - 2023",
    },
    company: {
      name: "McKinsey & Company",
      logo: logoMcKinsey,
      role: "Summer Associate",
    },
    successCompanies: [
      { name: "McKinsey", logo: logoMcKinsey },
      { name: "Goldman Sachs", logo: logoGoldman },
    ],
    bio: `Hi, I'm David! I'm a Summer Associate at McKinsey & Company and Cambridge Economics graduate. I'm passionate about helping aspiring consultants crack the case and land offers at MBB and other top firms.

Having gone through the recruiting process myself and helped dozens of candidates prepare, I know what it takes to succeed. My coaching focuses on structured thinking, case interview mastery, and personal experience interview preparation.

I believe everyone can learn to crack cases with the right framework and practice. Let me help you develop your problem-solving toolkit and build the confidence you need to succeed.`,
    skills: [
      "Case Studies",
      "Consulting",
      "Strategy",
      "Fit Interviews",
      "Problem Solving",
    ],
    services: [
      {
        name: "Case Interview Prep",
        duration: "60 min",
        price: 65,
        description: "Practice cases with real-time feedback and frameworks",
      },
      {
        name: "Fit Interview Coaching",
        duration: "45 min",
        price: 50,
        description: "Craft your story and nail behavioural questions",
      },
    ],
    hourlyRate: 60,
    experience: [
      {
        logo: logoMcKinsey,
        role: "Summer Associate",
        company: "McKinsey & Company",
        dates: "Summer 2024",
      },
    ],
    education: [
      {
        logo: logoCambridge,
        institution: "University of Cambridge",
        degree: "BA Economics",
        years: "2020 - 2023",
        achievement: "First Class Honours",
      },
    ],
    reviews: [
      {
        name: "Tom R.",
        date: "1 week ago",
        rating: 5,
        text: "David is an amazing case coach. His structured approach helped me improve dramatically in just a few sessions.",
        outcome: "McKinsey Offer",
      },
      {
        name: "Nina K.",
        date: "3 weeks ago",
        rating: 5,
        text: "Incredibly patient and knowledgeable. David helped me overcome my fear of case interviews and build real confidence.",
        outcome: "BCG Final Round",
      },
    ],
    ratings: {
      knowledge: 5.0,
      value: 5.0,
      responsiveness: 5.0,
      supportiveness: 5.0,
    },
    availability: {
      nextSlot: "Tomorrow 10:00 AM",
      timezone: "GMT",
    },
  },
};

export const getCoachById = (id: string): Coach | undefined => {
  return sampleCoaches[id];
};
