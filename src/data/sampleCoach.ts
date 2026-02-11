import type { Coach } from "@/types/coach";
import coachSarah from "@/assets/coach-sarah.jpg";
import coachDavid from "@/assets/coach-david.jpg";
import coachEmily from "@/assets/coach-emily.jpg";
import coachJames from "@/assets/coach-james.jpg";
import logoOxford from "@/assets/logo-oxford.png";
import logoCambridge from "@/assets/logo-cambridge.png";
import logoGoldman from "@/assets/logo-goldman-sachs.png";
import logoMcKinsey from "@/assets/logo-mckinsey-new.png";
import logoJPMorgan from "@/assets/logo-jpmorgan-new.png";
import logoImperial from "@/assets/logo-imperial-new.png";
import logoLSE from "@/assets/logo-lse-new.png";
import logoUCL from "@/assets/logo-ucl-new.png";
import logoMeta from "@/assets/logo-meta.png";
import logoCliffordChance from "@/assets/logo-clifford-chance.png";

export const sampleCoaches: Record<string, Coach> = {
  "sarah-k": {
    id: "sarah-k",
    name: "Sarah K.",
    tagline: "Helping you land your dream offer at top investment banks",
    photo: coachSarah,
    rating: 4.9,
    reviewCount: 47,
    sessionsCompleted: 63,
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

I've helped over 15 students secure offers at firms including Goldman Sachs, Morgan Stanley, JP Morgan, and Barclays. My coaching covers everything from CV optimisation and cover letters to technical and behavioural interview preparation.

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
    package: {
      name: "IB Application Sprint",
      sessions: 4,
      price: 150,
      originalPrice: 185,
      includes: "CV Review, Mock Interview, Strategy, Cover Letters",
    },
    availableSlots: [
      { day: "Today", time: "6:00 PM" },
      { day: "Tomorrow", time: "10:00 AM" },
      { day: "Tomorrow", time: "3:00 PM" },
      { day: "Thu, Feb 13", time: "11:00 AM" },
      { day: "Fri, Feb 14", time: "2:00 PM" },
    ],
  },

  "david-w": {
    id: "david-w",
    name: "David W.",
    tagline: "Your guide to breaking into top consulting firms",
    photo: coachDavid,
    rating: 5.0,
    reviewCount: 32,
    sessionsCompleted: 48,
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
      {
        name: "Application Review",
        duration: "45 min",
        price: 55,
        description: "Review and strengthen your consulting applications end-to-end",
      },
    ],
    hourlyRate: 60,
    experience: [
      {
        logo: logoMcKinsey,
        role: "Summer Associate",
        company: "McKinsey & Company",
        dates: "Summer 2024",
        description: "Strategy & Corporate Finance practice, London office",
      },
      {
        logo: logoGoldman,
        role: "Spring Intern",
        company: "Goldman Sachs",
        dates: "Spring 2023",
        description: "Investment Banking Division — also explored finance before choosing consulting",
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
      {
        name: "Chris P.",
        date: "1 month ago",
        rating: 5,
        text: "David's frameworks are incredibly practical. He doesn't just teach theory — he makes you actually solve cases in a way that clicks. Best money I've spent on prep.",
        outcome: "Bain Offer",
      },
      {
        name: "Anya M.",
        date: "2 months ago",
        rating: 5,
        text: "Had 3 sessions with David before my McKinsey final round. His feedback on my PEI stories was game-changing — I felt completely prepared going in.",
        outcome: "McKinsey Final Round",
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
    package: {
      name: "MBB Case Prep Bundle",
      sessions: 5,
      price: 275,
      originalPrice: 340,
      includes: "Case Prep, Fit Interview, Application Review, Mock",
    },
    availableSlots: [
      { day: "Tomorrow", time: "10:00 AM" },
      { day: "Tomorrow", time: "3:00 PM" },
      { day: "Wed, Feb 12", time: "11:00 AM" },
      { day: "Thu, Feb 13", time: "2:00 PM" },
      { day: "Fri, Feb 14", time: "10:00 AM" },
      { day: "Sat, Feb 15", time: "11:00 AM" },
    ],
  },

  "emily-r": {
    id: "emily-r",
    name: "Emily R.",
    tagline: "Your secret weapon for magic circle training contracts",
    photo: coachEmily,
    rating: 4.8,
    reviewCount: 28,
    sessionsCompleted: 34,
    followers: 18,
    university: {
      name: "London School of Economics",
      logo: logoLSE,
      degree: "LLB Law",
      years: "2020 - 2023",
    },
    company: {
      name: "Clifford Chance",
      logo: logoCliffordChance,
      role: "Trainee Solicitor",
    },
    successCompanies: [
      { name: "Clifford Chance", logo: logoCliffordChance },
    ],
    bio: `I'm a trainee solicitor at Clifford Chance starting in September 2025. During my time at LSE, I secured vacation schemes at Clifford Chance, Linklaters, Freshfields, and Slaughter and May — so I know exactly what these firms look for in their application forms and interviews.

I specialise in helping with commercial awareness, Watson Glaser prep, and TC application strategy. I also scored in the top 5% for the LNAT, so can help with university law applications too.

My approach is practical and no-nonsense. I'll review your applications, run mock interviews, and give you honest, constructive feedback. I've been through the process — I know what works and what doesn't.`,
    skills: [
      "Training Contracts",
      "Vac Schemes",
      "Commercial Awareness",
      "Watson Glaser",
      "LNAT",
      "Application Forms",
    ],
    services: [
      {
        name: "TC Application Review",
        duration: "45 min",
        price: 40,
        description:
          "Detailed review and feedback on your training contract applications with tracked changes",
      },
      {
        name: "Commercial Awareness Bootcamp",
        duration: "60 min",
        price: 50,
        description:
          "Intensive session on current commercial topics and how to discuss them in interviews",
      },
      {
        name: "Mock Vac Scheme Interview",
        duration: "60 min",
        price: 50,
        description:
          "Realistic mock interview simulating a magic circle vac scheme assessment",
      },
    ],
    hourlyRate: 45,
    experience: [
      {
        logo: logoCliffordChance,
        role: "Trainee Solicitor",
        company: "Clifford Chance",
        dates: "Starting Sept 2025",
        description: "Training contract in Corporate/M&A and Capital Markets",
      },
      {
        logo: logoCliffordChance,
        role: "Vacation Scheme",
        company: "Clifford Chance",
        dates: "Summer 2024",
        description: "Two-week placement in the Banking & Finance team",
      },
    ],
    education: [
      {
        logo: logoLSE,
        institution: "London School of Economics",
        degree: "LLB Law",
        years: "2020 - 2023",
        achievement: "First Class Honours · LNAT Top 5%",
      },
    ],
    reviews: [
      {
        name: "Hannah S.",
        date: "2 weeks ago",
        rating: 5,
        text: "Emily's commercial awareness coaching was exactly what I needed. She made complex topics accessible and showed me how to weave them into interview answers naturally.",
        outcome: "Linklaters Vac Scheme",
      },
      {
        name: "Ben F.",
        date: "1 month ago",
        rating: 5,
        text: "Had Emily review three training contract applications. Her feedback was incredibly detailed — she rewrote sections and explained exactly why. Got two interviews!",
        outcome: "Freshfields Interview",
      },
      {
        name: "Charlotte D.",
        date: "1 month ago",
        rating: 4,
        text: "Really helpful mock interview. Emily gave me tough questions and honest feedback. Felt much more prepared going into my real assessment day.",
      },
      {
        name: "Rahul P.",
        date: "2 months ago",
        rating: 5,
        text: "Emily's LNAT tips were a game changer. She broke down the question types and gave me a systematic approach. Went from a 25 to a 31.",
        outcome: "UCL Law Offer",
      },
      {
        name: "Grace T.",
        date: "3 months ago",
        rating: 5,
        text: "Best investment I made for my TC applications. Emily understands exactly what the top firms want and helps you articulate your motivation authentically.",
        outcome: "Allen & Overy TC Offer",
      },
    ],
    ratings: {
      knowledge: 4.9,
      value: 4.7,
      responsiveness: 4.8,
      supportiveness: 4.9,
    },
    availability: {
      nextSlot: "Tomorrow 2:00 PM",
      timezone: "GMT",
    },
  },

  "james-l": {
    id: "james-l",
    name: "James L.",
    tagline: "From 0 to FAANG: systematic prep for tech interviews",
    photo: coachJames,
    rating: 4.9,
    reviewCount: 41,
    sessionsCompleted: 52,
    followers: 27,
    university: {
      name: "Imperial College London",
      logo: logoImperial,
      degree: "MEng Computer Science",
      years: "2018 - 2022",
    },
    company: {
      name: "Meta",
      logo: logoMeta,
      role: "Software Engineer",
    },
    successCompanies: [
      { name: "Meta", logo: logoMeta },
    ],
    bio: `I graduated from Imperial in 2022 with a First in Computer Science, and I've been working at Meta London since. I went through the full interview loop at Meta, Google, Amazon, and several startups — so I know exactly what each company expects.

I've solved 100+ LeetCode problems and can teach you the patterns rather than individual solutions. My approach is about building problem-solving intuition so you can handle any question, not just the ones you've memorised.

I also cover system design for more senior roles, behavioural questions, and the often-overlooked topic of how to communicate your thought process effectively during technical interviews.`,
    skills: [
      "LeetCode",
      "System Design",
      "Data Structures",
      "Algorithms",
      "Coding Interviews",
      "Python/Java",
    ],
    services: [
      {
        name: "Algorithm & Data Structures",
        duration: "60 min",
        price: 55,
        description:
          "Practice coding problems with live feedback. Covers arrays, trees, graphs, DP, and more",
      },
      {
        name: "System Design Interview",
        duration: "60 min",
        price: 65,
        description:
          "Design scalable systems like those asked at Meta, Google, and Amazon interviews",
      },
      {
        name: "Full Mock Interview",
        duration: "60 min",
        price: 60,
        description:
          "End-to-end mock of a real FAANG interview with detailed scoring and feedback",
      },
    ],
    hourlyRate: 55,
    experience: [
      {
        logo: logoMeta,
        role: "Software Engineer",
        company: "Meta",
        dates: "2022 - Present",
        description: "Full-stack development on Meta's core platforms. London office.",
        skills: ["React", "Python", "GraphQL", "Distributed Systems"],
      },
      {
        logo: logoMeta,
        role: "Software Engineering Intern",
        company: "Meta",
        dates: "Summer 2021",
        description: "Interned on the Instagram team working on feed ranking",
      },
    ],
    education: [
      {
        logo: logoImperial,
        institution: "Imperial College London",
        degree: "MEng Computer Science",
        years: "2018 - 2022",
        achievement: "First Class Honours",
      },
    ],
    reviews: [
      {
        name: "Ryan K.",
        date: "1 week ago",
        rating: 5,
        text: "James is an incredible coding interview coach. He taught me patterns instead of memorising solutions, which completely changed how I approach problems. Got my Google offer!",
        outcome: "Google SWE Offer",
      },
      {
        name: "Mei L.",
        date: "2 weeks ago",
        rating: 5,
        text: "The system design session was worth every penny. James drew out architectures in real time and explained trade-offs I would never have thought of. Highly recommend for senior-level prep.",
      },
      {
        name: "Aditya S.",
        date: "1 month ago",
        rating: 5,
        text: "Had 5 sessions with James covering all the major LeetCode patterns. Went from barely solving mediums to consistently solving hards. Fantastic teacher.",
        outcome: "Amazon SDE Offer",
      },
      {
        name: "Julia W.",
        date: "1 month ago",
        rating: 4,
        text: "Great mock interview experience. James was realistic and gave constructive feedback. Only wish we had more time to cover system design too!",
      },
      {
        name: "Daniel O.",
        date: "2 months ago",
        rating: 5,
        text: "James helped me prepare for my Meta interview and I got the offer. His insider knowledge about what they're looking for was invaluable.",
        outcome: "Meta SWE Offer",
      },
    ],
    ratings: {
      knowledge: 5.0,
      value: 4.8,
      responsiveness: 4.9,
      supportiveness: 4.8,
    },
    availability: {
      nextSlot: "Today 7:00 PM",
      timezone: "GMT",
    },
    package: {
      name: "Tech Interview Prep",
      sessions: 5,
      price: 225,
      originalPrice: 275,
      includes: "Algorithms, System Design, Mock Interviews",
    },
    availableSlots: [
      { day: "Today", time: "7:00 PM" },
      { day: "Tomorrow", time: "10:00 AM" },
      { day: "Tomorrow", time: "3:00 PM" },
      { day: "Thu, Feb 13", time: "11:00 AM" },
      { day: "Thu, Feb 13", time: "5:00 PM" },
      { day: "Fri, Feb 14", time: "2:00 PM" },
    ],
    upcomingEvent: {
      title: "FAANG Interview Q&A",
      description: "Live group session, ask anything about tech interviews, prep strategies, and what to expect.",
      date: "Sat, Feb 15",
      time: "4:00 PM",
      price: "Free",
      spotsLeft: 12,
    },
  },

  "priya-m": {
    id: "priya-m",
    name: "Priya M.",
    tagline: "Top 2% UCAT scorer — I'll teach you strategies that actually work under pressure",
    photo: "",
    rating: 4.7,
    reviewCount: 19,
    sessionsCompleted: 28,
    followers: 12,
    university: {
      name: "University College London",
      logo: logoUCL,
      degree: "MBBS Medicine",
      years: "2024 - 2029",
    },
    company: {
      name: "UCL Medical School",
      logo: logoUCL,
      role: "UCAT Score 3150",
    },
    successCompanies: [],
    bio: `I'm a first-year medical student at UCL. I scored 3150 on the UCAT (top 2%) and received offers from UCL, King's, Bristol, and Leeds.

I struggled with timing initially but developed specific strategies for each section that dramatically improved my score. I went from a 2600 in my first practice test to 3150 on test day — so I know exactly what it takes to make a big jump.

I focus on teaching timed strategies so you can apply them under real test conditions. I also help with MMI interview prep and personal statement reviewing, drawing from my own successful experience.

I'm especially passionate about helping students from state schools who don't have access to expensive UCAT courses.`,
    skills: [
      "UCAT",
      "Medicine Applications",
      "MMI Interviews",
      "Personal Statements",
      "Timing Strategies",
      "BMAT",
    ],
    services: [
      {
        name: "UCAT Strategy Session",
        duration: "60 min",
        price: 40,
        description:
          "Learn section-specific strategies for timing, question types, and score optimisation",
      },
      {
        name: "UCAT Practice & Review",
        duration: "45 min",
        price: 35,
        description:
          "Timed practice under test conditions with detailed review of mistakes and patterns",
      },
      {
        name: "Med School Application Review",
        duration: "45 min",
        price: 40,
        description:
          "Review personal statement, check UCAT score strategy, and plan med school selection",
      },
    ],
    hourlyRate: 40,
    experience: [
      {
        logo: logoUCL,
        role: "Medical Student",
        company: "UCL Medical School",
        dates: "2024 - Present",
        description: "First-year MBBS student. Active in student mentoring and widening participation.",
      },
    ],
    education: [
      {
        logo: logoUCL,
        institution: "University College London",
        degree: "MBBS Medicine",
        years: "2024 - 2029",
        achievement: "UCAT Score: 3150 (Top 2%)",
      },
    ],
    reviews: [
      {
        name: "Sarah A.",
        date: "2 weeks ago",
        rating: 5,
        text: "Priya's timing strategies for the UCAT are incredible. I went from running out of time on every section to finishing with time to spare. My score jumped by 400 points!",
        outcome: "UCAT Score 2950",
      },
      {
        name: "Nathan B.",
        date: "1 month ago",
        rating: 5,
        text: "Had the UCAT Score Boost package and it was worth every penny. Priya breaks down each section type and gives you practical shortcuts. Highly recommend.",
        outcome: "King's Medicine Offer",
      },
      {
        name: "Zara H.",
        date: "1 month ago",
        rating: 4,
        text: "Really helpful session on my personal statement. Priya gave honest feedback and helped me restructure my motivations section. Great experience overall.",
      },
      {
        name: "Ethan C.",
        date: "2 months ago",
        rating: 5,
        text: "Priya is so relatable and encouraging. She understands the pressure of UCAT prep and makes the sessions feel manageable. My situational judgement score went up massively.",
        outcome: "Bristol Medicine Offer",
      },
    ],
    ratings: {
      knowledge: 4.8,
      value: 4.9,
      responsiveness: 4.5,
      supportiveness: 4.8,
    },
    availability: {
      nextSlot: "Thursday 4:00 PM",
      timezone: "GMT",
    },
    package: {
      name: "UCAT Score Boost",
      sessions: 5,
      price: 175,
      originalPrice: 200,
      includes: "Diagnostic, all sections, full mock",
    },
    availableSlots: [
      { day: "Thursday", time: "4:00 PM" },
      { day: "Friday", time: "11:00 AM" },
      { day: "Sat, Feb 15", time: "9:00 AM" },
      { day: "Sat, Feb 15", time: "1:00 PM" },
      { day: "Sun, Feb 16", time: "11:00 AM" },
    ],
    ucatScores: [
      { section: "VR", score: 780, max: 900 },
      { section: "DM", score: 810, max: 900 },
      { section: "QR", score: 790, max: 900 },
      { section: "AR", score: 770, max: 900 },
      { section: "Total", score: 3150, max: 3600 },
    ],
    ucatSJTBand: 1,
    landedOfferLabels: ["UCL", "King's", "Bristol", "Leeds"],
    upcomingEvent: {
      title: "UCAT Strategy Workshop",
      description: "Live group session covering the top scoring strategies for each UCAT section. Bring your questions!",
      date: "Sat, Feb 15",
      time: "3:00 PM",
      price: "£5",
      spotsLeft: 18,
    },
  },

  "tom-h": {
    id: "tom-h",
    name: "Tom H.",
    tagline: "First-generation Oxbridge student — I'll show you how to stand out",
    photo: "",
    rating: 4.9,
    reviewCount: 35,
    sessionsCompleted: 41,
    followers: 22,
    university: {
      name: "University of Oxford",
      logo: logoOxford,
      degree: "BA Philosophy, Politics & Economics",
      years: "2021 - 2024",
    },
    company: {
      name: "University of Oxford",
      logo: logoOxford,
      role: "Oxford PPE '24",
    },
    successCompanies: [
      { name: "University of Oxford", logo: logoOxford },
    ],
    bio: `I'm reading PPE at Oxford and was the first in my family to apply to Oxbridge. I know how intimidating the process can be, especially if your school doesn't have a track record of sending students to Oxford or Cambridge.

I've since helped 8 students get offers across PPE, Economics, History, and English. I specialise in personal statement review and intensive mock interview preparation.

My approach is to demystify the Oxbridge process. I'll help you understand what tutors are actually looking for, how to structure your personal statement to showcase genuine intellectual curiosity, and how to think on your feet in an interview.

I'm particularly passionate about helping state school students who don't have access to the traditional Oxbridge prep pipeline.`,
    skills: [
      "Oxbridge Applications",
      "Personal Statements",
      "Interview Prep",
      "PPE",
      "TSA",
      "Supercurriculars",
    ],
    services: [
      {
        name: "Personal Statement Review",
        duration: "60 min",
        price: 50,
        description:
          "In-depth review and restructuring of your Oxbridge personal statement with tracked changes",
      },
      {
        name: "Mock Oxbridge Interview",
        duration: "60 min",
        price: 55,
        description:
          "Realistic tutorial-style mock interview with detailed feedback on reasoning and communication",
      },
      {
        name: "Application Strategy",
        duration: "45 min",
        price: 45,
        description:
          "College selection, supercurricular planning, and overall Oxbridge application strategy",
      },
    ],
    hourlyRate: 55,
    experience: [
      {
        logo: logoOxford,
        role: "Student Ambassador",
        company: "University of Oxford",
        dates: "2022 - 2024",
        description: "Led access & outreach programmes for prospective state school applicants",
      },
      {
        logo: logoOxford,
        role: "Peer Mentor",
        company: "Oxford PPE Department",
        dates: "2023 - 2024",
        description: "Mentored first-year students on academic skills and tutorial preparation",
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
        name: "Isabelle K.",
        date: "1 week ago",
        rating: 5,
        text: "Tom's mock interviews are incredibly realistic. He asked me questions I never would have expected and taught me how to think through unfamiliar problems on the spot. Absolutely essential prep.",
        outcome: "Oxford PPE Offer",
      },
      {
        name: "Jamal A.",
        date: "2 weeks ago",
        rating: 5,
        text: "As a state school student, I had no idea where to start with my Oxbridge application. Tom made the whole process feel achievable and his PS feedback was detailed and encouraging.",
        outcome: "Cambridge Economics Offer",
      },
      {
        name: "Chloe M.",
        date: "1 month ago",
        rating: 5,
        text: "Tom completely transformed my personal statement. He helped me find a clear narrative and showed me how to connect my interests to the course in a genuine way.",
        outcome: "Oxford History Offer",
      },
      {
        name: "Will T.",
        date: "1 month ago",
        rating: 4,
        text: "Great session on supercurriculars. Tom helped me identify reading and activities that would genuinely deepen my understanding of PPE rather than just ticking boxes.",
      },
      {
        name: "Amira R.",
        date: "2 months ago",
        rating: 5,
        text: "Had the full Oxbridge Interview Prep package. Tom's structured approach and honest feedback gave me the confidence I needed. Can't recommend him enough.",
        outcome: "Oxford English Offer",
      },
    ],
    ratings: {
      knowledge: 5.0,
      value: 4.8,
      responsiveness: 4.9,
      supportiveness: 5.0,
    },
    availability: {
      nextSlot: "Wednesday 11:00 AM",
      timezone: "GMT",
    },
  },

  "aisha-n": {
    id: "aisha-n",
    name: "Aisha N.",
    tagline: "Landed JPM Spring Week with zero connections — let me show you how",
    photo: "",
    rating: 4.6,
    reviewCount: 14,
    sessionsCompleted: 18,
    followers: 9,
    university: {
      name: "University of Warwick",
      logo: logoLSE, // Using LSE as placeholder — Warwick logo not in assets
      degree: "BSc Economics",
      years: "2023 - 2026",
    },
    company: {
      name: "J.P. Morgan",
      logo: logoJPMorgan,
      role: "Spring Week '24",
    },
    successCompanies: [
      { name: "JP Morgan", logo: logoJPMorgan },
    ],
    bio: `I'm a second-year Economics student at Warwick. I had no connections in finance and no prior internship experience when I started applying. I landed my J.P. Morgan Spring Week entirely through cold emailing and networking — and I've refined that process into a repeatable system.

If you don't have a finance background or connections, I'm the coach for you. I specialise in helping students from non-target universities and non-traditional backgrounds break into investment banking.

My coaching covers cold email strategy, LinkedIn networking, CV tailoring for finance, and the specific tips that helped me convert my Spring Week into an ongoing relationship with the firm. I believe that with the right approach, anyone can break into finance.`,
    skills: [
      "Cold Emailing",
      "Networking",
      "Spring Week Apps",
      "Investment Banking",
      "Non-target Strategy",
      "LinkedIn",
    ],
    services: [
      {
        name: "Cold Email Workshop",
        duration: "45 min",
        price: 30,
        description:
          "Learn my proven template for cold emailing bankers. Includes email review and personalisation strategy",
      },
      {
        name: "Networking Strategy",
        duration: "45 min",
        price: 35,
        description:
          "Build a systematic networking plan: who to reach out to, how, and when to follow up",
      },
      {
        name: "Spring Week Application Review",
        duration: "45 min",
        price: 35,
        description:
          "Full review of your Spring Week applications tailored to each bank's specific requirements",
      },
    ],
    hourlyRate: 35,
    experience: [
      {
        logo: logoJPMorgan,
        role: "Spring Week Participant",
        company: "J.P. Morgan",
        dates: "Spring 2024",
        description: "Selected from 3,000+ applicants. Secured through cold networking strategy.",
      },
    ],
    education: [
      {
        logo: logoLSE,
        institution: "University of Warwick",
        degree: "BSc Economics",
        years: "2023 - 2026",
        achievement: "First Year: First Class (74% average)",
      },
    ],
    reviews: [
      {
        name: "Omar S.",
        date: "1 week ago",
        rating: 5,
        text: "Aisha's cold email templates are gold. She helped me craft personalised emails that actually got responses from bankers at Goldman and Morgan Stanley. Two coffee chats booked within a week!",
        outcome: "Goldman Sachs Spring Week",
      },
      {
        name: "Fatima K.",
        date: "3 weeks ago",
        rating: 5,
        text: "As a non-target student, I felt completely lost before speaking to Aisha. She gave me a clear roadmap and the confidence to reach out to people in the industry. Life-changing.",
        outcome: "Barclays Spring Week",
      },
      {
        name: "Luke P.",
        date: "1 month ago",
        rating: 4,
        text: "Practical and actionable advice. Aisha reviewed my LinkedIn profile and helped me position myself better for finance roles. Would book again.",
      },
      {
        name: "Jessica M.",
        date: "2 months ago",
        rating: 4,
        text: "Helpful session on networking. Aisha shared her exact approach and follow-up strategy. Feel much more confident about reaching out to professionals now.",
      },
    ],
    ratings: {
      knowledge: 4.6,
      value: 4.8,
      responsiveness: 4.4,
      supportiveness: 4.7,
    },
    availability: {
      nextSlot: "Friday 3:00 PM",
      timezone: "GMT",
    },
  },

  "marcus-d": {
    id: "marcus-d",
    name: "Marcus D.",
    tagline: "Non-traditional to BCG — I'll help you break into MBB your way",
    photo: "",
    rating: 4.8,
    reviewCount: 22,
    sessionsCompleted: 30,
    followers: 15,
    university: {
      name: "London School of Economics",
      logo: logoLSE,
      degree: "BSc Management",
      years: "2020 - 2023",
    },
    company: {
      name: "BCG",
      logo: logoMcKinsey, // Using McKinsey logo as placeholder for BCG
      role: "Summer Consultant",
    },
    successCompanies: [
      { name: "McKinsey", logo: logoMcKinsey },
    ],
    bio: `I studied Management at LSE and landed a summer consulting role at BCG. What makes me different is that I came from a completely non-traditional background — no family in consulting, no prior internships, state school educated.

I know exactly what it takes to stand out when you don't have the 'typical' profile. I focus on authentic PEI stories, case fundamentals, and application positioning.

My coaching style is direct and practical. I'll help you develop genuine, compelling stories from your real experiences — not fabricated answers. I also specialise in the written case format used by BCG and McKinsey.

If you're from a non-traditional background and want to break into MBB, I can show you exactly how I did it.`,
    skills: [
      "Case Studies",
      "Consulting",
      "PEI Stories",
      "Written Cases",
      "Non-traditional Backgrounds",
      "Behavioural Interviews",
    ],
    services: [
      {
        name: "Case Interview Coaching",
        duration: "60 min",
        price: 50,
        description:
          "Live case practice with a focus on structured problem-solving and communication",
      },
      {
        name: "PEI Story Development",
        duration: "45 min",
        price: 40,
        description:
          "Develop and refine 3-4 PEI stories that showcase leadership, impact, and teamwork authentically",
      },
      {
        name: "Written Case Prep",
        duration: "60 min",
        price: 55,
        description:
          "Practice BCG/McKinsey-style written cases with real-time feedback on structure and analysis",
      },
    ],
    hourlyRate: 50,
    experience: [
      {
        logo: logoMcKinsey,
        role: "Summer Consultant",
        company: "BCG",
        dates: "Summer 2024",
        description: "Consumer goods strategy engagement at BCG London. Returning full-time in 2025.",
      },
    ],
    education: [
      {
        logo: logoLSE,
        institution: "London School of Economics",
        degree: "BSc Management",
        years: "2020 - 2023",
        achievement: "First Class Honours · President of Consulting Society",
      },
    ],
    reviews: [
      {
        name: "Priyanka V.",
        date: "1 week ago",
        rating: 5,
        text: "Marcus is the real deal. His own story of breaking into BCG from a non-traditional background was so inspiring, and his case coaching is top-tier. He made me believe I could do it too.",
        outcome: "BCG First Round",
      },
      {
        name: "Sam C.",
        date: "2 weeks ago",
        rating: 5,
        text: "The PEI story development session was incredible. Marcus helped me find stories from my real experiences that I didn't even realise were relevant. My interviewer specifically complimented my stories!",
        outcome: "McKinsey Offer",
      },
      {
        name: "Elena T.",
        date: "1 month ago",
        rating: 4,
        text: "Great written case session. Marcus's structured approach to analysing data and presenting recommendations was really useful. Felt much more prepared for the BCG written case.",
      },
      {
        name: "Josh W.",
        date: "1 month ago",
        rating: 5,
        text: "Had 5 sessions with Marcus across the MBB Application Sprint package. Went from barely passing cases to getting a BCG offer. Absolute game-changer for non-traditional candidates.",
        outcome: "BCG Offer",
      },
      {
        name: "Tanya R.",
        date: "2 months ago",
        rating: 5,
        text: "Marcus gave me the frameworks and confidence to approach case interviews systematically. His feedback is honest, specific, and genuinely helpful. Worth every penny.",
        outcome: "Bain Second Round",
      },
    ],
    ratings: {
      knowledge: 4.9,
      value: 4.8,
      responsiveness: 4.7,
      supportiveness: 4.9,
    },
    availability: {
      nextSlot: "Tomorrow 11:00 AM",
      timezone: "GMT",
    },
  },
};

export const getCoachById = (id: string): Coach | undefined => {
  return sampleCoaches[id];
};

export const getAllCoaches = (): Coach[] => {
  return Object.values(sampleCoaches);
};
