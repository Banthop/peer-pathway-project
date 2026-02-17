export interface FreeEvent {
  id: number;
  title: string;
  description: string;
  host: { name: string; avatar: string; rating: number; reviews: number };
  category: string;
  date: string;
  time: string;
  duration: string;
  registered: number;
  gradient: string;
  tags: string[];
}

export const freeEvents: FreeEvent[] = [
  {
    id: 1,
    title: "Spring Week Application Masterclass",
    description:
      "Everything you need to know about applying for Spring Weeks at top investment banks. From CV tips to online test strategies.",
    host: { name: "Sarah K.", avatar: "SK", rating: 4.9, reviews: 47 },
    category: "Investment Banking",
    date: "2026-02-18",
    time: "6:00 PM",
    duration: "60 min",
    registered: 142,
    gradient: "from-blue-600 to-indigo-800",
    tags: ["Spring Week", "Applications", "CV"],
  },
  {
    id: 2,
    title: "How to Crack Case Interviews",
    description:
      "A structured walkthrough of the frameworks and thinking patterns that get you through MBB case interviews.",
    host: { name: "David W.", avatar: "DW", rating: 5.0, reviews: 32 },
    category: "Consulting",
    date: "2026-02-20",
    time: "5:30 PM",
    duration: "75 min",
    registered: 98,
    gradient: "from-violet-600 to-purple-800",
    tags: ["Case Study", "MBB", "Frameworks"],
  },
  {
    id: 3,
    title: "UCAT Score 3000+ Strategy Session",
    description:
      "Proven techniques to boost your UCAT score. Covers all subtests with time-saving strategies and practice tips.",
    host: { name: "Priya M.", avatar: "PM", rating: 4.7, reviews: 19 },
    category: "UCAT",
    date: "2026-02-22",
    time: "11:00 AM",
    duration: "90 min",
    registered: 215,
    gradient: "from-emerald-600 to-teal-800",
    tags: ["UCAT", "Medicine", "Strategy"],
  },
  {
    id: 4,
    title: "Oxford PPE Interview Workshop",
    description:
      "Simulate real Oxbridge interview scenarios. Learn how to think on your feet and impress your interviewer.",
    host: { name: "Tom H.", avatar: "TH", rating: 4.8, reviews: 24 },
    category: "Oxbridge",
    date: "2026-02-25",
    time: "4:00 PM",
    duration: "60 min",
    registered: 76,
    gradient: "from-amber-500 to-orange-700",
    tags: ["Oxbridge", "Interview", "PPE"],
  },
  {
    id: 5,
    title: "Training Contract Application Tips",
    description:
      "What magic circle firms actually look for in TC applications. Cover letter structure, competency questions, and more.",
    host: { name: "Emily R.", avatar: "ER", rating: 4.8, reviews: 28 },
    category: "Law",
    date: "2026-02-27",
    time: "6:30 PM",
    duration: "60 min",
    registered: 63,
    gradient: "from-indigo-600 to-blue-800",
    tags: ["Law", "Training Contract", "Applications"],
  },
  {
    id: 6,
    title: "Tech Interview Prep: System Design 101",
    description:
      "An introduction to system design interviews for software engineering internships. Covers common patterns and how to structure your answers.",
    host: { name: "James L.", avatar: "JL", rating: 4.6, reviews: 15 },
    category: "Software Engineering",
    date: "2026-03-01",
    time: "3:00 PM",
    duration: "75 min",
    registered: 89,
    gradient: "from-cyan-600 to-blue-800",
    tags: ["System Design", "Tech", "Internships"],
  },
  {
    id: 7,
    title: "Cold Emailing Recruiters: What Actually Works",
    description:
      "Real examples of cold emails that landed Spring Week and internship interviews. What to say, who to target, and when to send.",
    host: { name: "Sarah K.", avatar: "SK", rating: 4.9, reviews: 47 },
    category: "Investment Banking",
    date: "2026-03-04",
    time: "7:00 PM",
    duration: "45 min",
    registered: 178,
    gradient: "from-blue-500 to-slate-700",
    tags: ["Cold Email", "Networking", "Spring Week"],
  },
  {
    id: 8,
    title: "Ask Me Anything: Life at McKinsey",
    description:
      "Candid Q&A about what it's actually like working at McKinsey. the culture, the hours, the projects, and whether it's worth it.",
    host: { name: "David W.", avatar: "DW", rating: 5.0, reviews: 32 },
    category: "Consulting",
    date: "2026-03-06",
    time: "6:00 PM",
    duration: "60 min",
    registered: 124,
    gradient: "from-purple-500 to-violet-800",
    tags: ["McKinsey", "AMA", "Consulting"],
  },
  {
    id: 9,
    title: "Medical School Interview Practice",
    description:
      "Mock MMI stations and panel interview practice. Get feedback on your answers and learn common pitfalls.",
    host: { name: "Priya M.", avatar: "PM", rating: 4.7, reviews: 19 },
    category: "UCAT",
    date: "2026-03-08",
    time: "10:00 AM",
    duration: "90 min",
    registered: 156,
    gradient: "from-green-600 to-emerald-800",
    tags: ["Medicine", "MMI", "Interview"],
  },
  {
    id: 10,
    title: "Personal Statement Workshop",
    description:
      "How to write a personal statement that stands out. Structure, examples, and the mistakes that cost people offers.",
    host: { name: "Tom H.", avatar: "TH", rating: 4.8, reviews: 24 },
    category: "Oxbridge",
    date: "2026-03-11",
    time: "5:00 PM",
    duration: "60 min",
    registered: 201,
    gradient: "from-yellow-500 to-amber-700",
    tags: ["Personal Statement", "UCAS", "Oxbridge"],
  },
  {
    id: 11,
    title: "LeetCode Patterns That Keep Coming Up",
    description:
      "The 15 most common LeetCode patterns for tech interviews. Learn when to apply each one with real examples.",
    host: { name: "James L.", avatar: "JL", rating: 4.6, reviews: 15 },
    category: "Software Engineering",
    date: "2026-03-13",
    time: "4:00 PM",
    duration: "75 min",
    registered: 112,
    gradient: "from-teal-500 to-cyan-800",
    tags: ["LeetCode", "Coding", "Patterns"],
  },
  {
    id: 12,
    title: "Vacation Scheme Cover Letter Clinic",
    description:
      "Live review of cover letter examples for vacation schemes at top firms. Bring yours for feedback.",
    host: { name: "Emily R.", avatar: "ER", rating: 4.8, reviews: 28 },
    category: "Law",
    date: "2026-03-15",
    time: "2:00 PM",
    duration: "60 min",
    registered: 54,
    gradient: "from-indigo-500 to-purple-700",
    tags: ["Vac Scheme", "Cover Letter", "Law"],
  },
];

export const userProfile = {
  interests: ["Investment Banking"],
  name: "Alex",
};

export const eventCategories = [
  "All",
  "Investment Banking",
  "Consulting",
  "Law",
  "UCAT",
  "Oxbridge",
  "Software Engineering",
];
