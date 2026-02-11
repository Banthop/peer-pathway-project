// ============================================================
// TYPES
// ============================================================

export interface Coach {
    id: number;
    slug: string;
    name: string;
    credential: string;
    uni: string;
    rating: number;
    reviews: number;
    tags: string[];
    rate: number;
    avatar: string;
    category: string;
    bio: string;
    sessions: number;
    packageName: string;
    packageSessions: number;
    packagePrice: number;
    hasBooked: boolean;
    fullBio: string;
}

export interface Conversation {
    id: number;
    coach: string;
    avatar: string;
    credential: string;
    lastMessage: string;
    lastTime: string;
    unread: number;
    online: boolean;
    messages: ChatMessage[];
}

export interface ChatMessage {
    id: number;
    sender: "student" | "coach";
    text: string;
    time: string;
}

// ============================================================
// DATA
// ============================================================

export const allCoaches: Coach[] = [
    {
        id: 1,
        slug: "sarah-k",
        name: "Sarah K.",
        credential: "Goldman Sachs Incoming Analyst",
        uni: "Oxford '24",
        rating: 4.9,
        reviews: 47,
        tags: ["Investment Banking", "Spring Week", "CV Review"],
        rate: 50,
        avatar: "SK",
        category: "Investment Banking",
        bio: "Landed Spring Weeks at Goldman & Citi. Helped 15+ friends get offers — I know exactly what recruiters look for.",
        sessions: 63,
        packageName: "Spring Week Sprint",
        packageSessions: 5,
        packagePrice: 150,
        hasBooked: true,
        fullBio:
            "I'm a final-year PPE student at Oxford, joining Goldman Sachs as an Analyst in 2025. I secured Spring Weeks at Goldman, Citi, and Barclays in 2024 — and I've since helped 15+ friends successfully land their own Spring Week offers. I specialise in CV optimisation, cover letter strategy, and behavioural interview prep. I remember exactly what the process was like, what questions came up, and what made the difference between getting through and getting cut.",
    },
    {
        id: 2,
        slug: "david-w",
        name: "David W.",
        credential: "McKinsey Summer Associate",
        uni: "Cambridge '23",
        rating: 5.0,
        reviews: 32,
        tags: ["Consulting", "Case Studies", "Strategy"],
        rate: 60,
        avatar: "DW",
        category: "Consulting",
        bio: "Ex-McKinsey intern, now returning full-time. Cracked 20+ case interviews and can teach you the frameworks that work.",
        sessions: 48,
        packageName: "Case Interview Intensive",
        packageSessions: 4,
        packagePrice: 200,
        hasBooked: true,
        fullBio:
            "Economics at Cambridge, spent my summer at McKinsey London and returning full-time in September. Before landing McKinsey, I went through 20+ case interviews across MBB and Big 4 firms. I've developed a structured approach to case interviews that goes beyond the standard frameworks — it's about genuinely thinking through problems in a way that impresses interviewers. I also help with PEI stories, written cases, and overall application strategy.",
    },
    {
        id: 3,
        slug: "emily-r",
        name: "Emily R.",
        credential: "Clifford Chance Trainee",
        uni: "LSE '23",
        rating: 4.8,
        reviews: 28,
        tags: ["Law", "TC Applications", "LNAT", "Vac Schemes"],
        rate: 45,
        avatar: "ER",
        category: "Law",
        bio: "Secured vac schemes at 4 magic circle firms. Specialise in commercial awareness and application forms.",
        sessions: 34,
        packageName: "Vac Scheme Bundle",
        packageSessions: 4,
        packagePrice: 130,
        hasBooked: false,
        fullBio:
            "I'm a trainee at Clifford Chance starting in September 2025. During my time at LSE, I secured vacation schemes at Clifford Chance, Linklaters, Freshfields, and Slaughter and May. I know exactly what these firms look for in their application forms and interviews. I specialise in helping with commercial awareness, Watson Glaser prep, and TC application strategy. I also scored in the top 5% for the LNAT, so can help with university law applications too.",
    },
    {
        id: 4,
        slug: "james-l",
        name: "James L.",
        credential: "Meta Software Engineer",
        uni: "Imperial '22",
        rating: 4.9,
        reviews: 41,
        tags: ["Software Engineering", "Coding", "System Design"],
        rate: 55,
        avatar: "JL",
        category: "Software Engineering",
        bio: "SWE at Meta. Did 100+ LeetCode problems and went through the full tech interview loop — I'll get you ready.",
        sessions: 52,
        packageName: "Tech Interview Prep",
        packageSessions: 5,
        packagePrice: 225,
        hasBooked: false,
        fullBio:
            "I graduated from Imperial in 2022 with a First in Computer Science, and I've been working at Meta London since. I went through the full interview loop at Meta, Google, Amazon, and several startups — so I know exactly what each company expects. I've solved 100+ LeetCode problems and can teach you the patterns rather than individual solutions. I also cover system design for more senior roles.",
    },
    {
        id: 5,
        slug: "priya-m",
        name: "Priya M.",
        credential: "UCAT Score 3150",
        uni: "UCL Medicine '24",
        rating: 4.7,
        reviews: 19,
        tags: ["UCAT", "Medicine", "MMI Interviews"],
        rate: 40,
        avatar: "PM",
        category: "UCAT",
        bio: "Scored 3150 on UCAT and got 4 med school offers. I teach timing strategies that actually work under pressure.",
        sessions: 28,
        packageName: "UCAT Score Boost",
        packageSessions: 5,
        packagePrice: 175,
        hasBooked: false,
        fullBio:
            "I'm a first-year medical student at UCL. I scored 3150 on the UCAT (top 2%) and received offers from UCL, King's, Bristol, and Leeds. I struggled with timing initially but developed specific strategies for each section that dramatically improved my score. I focus on teaching these strategies so you can apply them under real test conditions.",
    },
    {
        id: 6,
        slug: "tom-h",
        name: "Tom H.",
        credential: "Oxford PPE '24",
        uni: "Eton College",
        rating: 4.9,
        reviews: 35,
        tags: ["Oxbridge", "Personal Statement", "Interviews"],
        rate: 55,
        avatar: "TH",
        category: "Oxbridge",
        bio: "Got into Oxford PPE on my first attempt. I've since helped 8 students get Oxbridge offers through interview and PS prep.",
        sessions: 41,
        packageName: "Oxbridge Interview Prep",
        packageSessions: 4,
        packagePrice: 180,
        hasBooked: false,
        fullBio:
            "I'm reading PPE at Oxford and was the first in my family to apply to Oxbridge. I know how intimidating the process can be, especially if your school doesn't have a track record of sending students to Oxford or Cambridge. I've since helped 8 students get offers across PPE, Economics, History, and English. I specialise in personal statement review and intensive mock interview preparation.",
    },
    {
        id: 7,
        slug: "aisha-n",
        name: "Aisha N.",
        credential: "J.P. Morgan Spring Week '24",
        uni: "Warwick '25",
        rating: 4.6,
        reviews: 14,
        tags: ["Investment Banking", "Spring Week", "Networking"],
        rate: 35,
        avatar: "AN",
        category: "Investment Banking",
        bio: "Landed JPM Spring Week through cold emailing. I specialise in networking strategy and breaking in without connections.",
        sessions: 18,
        packageName: "Cold Email Blueprint",
        packageSessions: 3,
        packagePrice: 90,
        hasBooked: false,
        fullBio:
            "I'm a second-year Economics student at Warwick. I had no connections in finance and no prior internship experience when I started applying. I landed my J.P. Morgan Spring Week entirely through cold emailing and networking — and I've refined that process into a repeatable system. If you don't have a finance background or connections, I'm the coach for you.",
    },
    {
        id: 8,
        slug: "marcus-d",
        name: "Marcus D.",
        credential: "BCG Summer Consultant",
        uni: "LSE '23",
        rating: 4.8,
        reviews: 22,
        tags: ["Consulting", "Case Studies", "Behavioural"],
        rate: 50,
        avatar: "MD",
        category: "Consulting",
        bio: "BCG summer offer from a non-target background. Specialise in helping non-traditional candidates break into MBB.",
        sessions: 30,
        packageName: "MBB Application Sprint",
        packageSessions: 5,
        packagePrice: 200,
        hasBooked: false,
        fullBio:
            "I studied Management at LSE and landed a summer consulting role at BCG. What makes me different is that I came from a completely non-traditional background — no family in consulting, no prior internships, state school educated. I know exactly what it takes to stand out when you don't have the 'typical' profile. I focus on authentic PEI stories, case fundamentals, and application positioning.",
    },
];

export const upcomingSessions = [
    {
        id: 1,
        coach: "Sarah K.",
        credential: "Goldman Sachs Spring Week '24",
        type: "CV Review",
        date: "Tomorrow",
        time: "2:00 PM",
        duration: "45 min",
        avatar: "SK",
        isNext: true,
        hasMessage: false,
        price: 50,
    },
    {
        id: 2,
        coach: "David W.",
        credential: "McKinsey Summer Associate",
        type: "Mock Interview",
        date: "Sun, Feb 8",
        time: "10:00 AM",
        duration: "60 min",
        avatar: "DW",
        isNext: false,
        hasMessage: true,
        price: 60,
    },
];

export const pastBookings = [
    {
        id: 1,
        coach: "Sarah K.",
        credential: "Goldman Sachs Spring Week '24",
        type: "Application Strategy",
        date: "Jan 30, 2026",
        rating: 5,
        reviewed: true,
        coachRate: 50,
        avatar: "SK",
        price: 50,
    },
    {
        id: 2,
        coach: "James L.",
        credential: "Meta Software Engineer",
        type: "Coding Interview Prep",
        date: "Jan 23, 2026",
        rating: null as number | null,
        reviewed: false,
        coachRate: 55,
        avatar: "JL",
        price: 55,
    },
    {
        id: 3,
        coach: "Emily R.",
        credential: "Clifford Chance Trainee",
        type: "LNAT Prep",
        date: "Jan 16, 2026",
        rating: 4,
        reviewed: true,
        coachRate: 45,
        avatar: "ER",
        price: 45,
    },
    {
        id: 4,
        coach: "Sarah K.",
        credential: "Goldman Sachs Spring Week '24",
        type: "CV Review",
        date: "Jan 9, 2026",
        rating: 5,
        reviewed: true,
        coachRate: 50,
        avatar: "SK",
        price: 50,
    },
    {
        id: 5,
        coach: "David W.",
        credential: "McKinsey Summer Associate",
        type: "Case Interview Practice",
        date: "Dec 18, 2025",
        rating: 5,
        reviewed: true,
        coachRate: 60,
        avatar: "DW",
        price: 60,
    },
];

export const conversations: Conversation[] = [
    {
        id: 1,
        coach: "Sarah K.",
        avatar: "SK",
        credential: "Goldman Sachs Spring Week '24",
        lastMessage:
            "Great, I'll review your CV before our session tomorrow!",
        lastTime: "2 hours ago",
        unread: 1,
        online: true,
        messages: [
            {
                id: 1,
                sender: "student",
                text: "Hi Sarah! I've updated my CV with the changes we discussed last time. Should I send it over before tomorrow?",
                time: "Yesterday, 4:30 PM",
            },
            {
                id: 2,
                sender: "coach",
                text: "Yes please! Send it over and I'll take a look before our session so we can hit the ground running.",
                time: "Yesterday, 5:15 PM",
            },
            {
                id: 3,
                sender: "student",
                text: "Amazing, just sent it to your email. I've also added a section on my extracurriculars like you suggested.",
                time: "Yesterday, 5:22 PM",
            },
            {
                id: 4,
                sender: "coach",
                text: "Great, I'll review your CV before our session tomorrow!",
                time: "2 hours ago",
            },
        ],
    },
    {
        id: 2,
        coach: "David W.",
        avatar: "DW",
        credential: "McKinsey Summer Associate",
        lastMessage:
            "For Sunday's mock, prepare a market sizing case — I'll throw you something you haven't seen before",
        lastTime: "5 hours ago",
        unread: 1,
        online: false,
        messages: [
            {
                id: 1,
                sender: "coach",
                text: "Hey Alex! Looking forward to our mock interview on Sunday. Quick heads up on what to prepare.",
                time: "5 hours ago",
            },
            {
                id: 2,
                sender: "coach",
                text: "For Sunday's mock, prepare a market sizing case — I'll throw you something you haven't seen before",
                time: "5 hours ago",
            },
        ],
    },
    {
        id: 3,
        coach: "James L.",
        avatar: "JL",
        credential: "Meta Software Engineer",
        lastMessage:
            "No worries, the dynamic programming approach was the right instinct. Practice those patterns and you'll nail it next time.",
        lastTime: "Jan 24",
        unread: 0,
        online: false,
        messages: [
            {
                id: 1,
                sender: "student",
                text: "Hey James, thanks for the session! I'm still not fully confident on the graph traversal problems though.",
                time: "Jan 23, 6:00 PM",
            },
            {
                id: 2,
                sender: "coach",
                text: "That's totally normal — graph problems are one of the trickier areas. I'd recommend doing 5-6 BFS/DFS problems on LeetCode this week. Start with 'Number of Islands' and 'Course Schedule'.",
                time: "Jan 23, 7:45 PM",
            },
            {
                id: 3,
                sender: "student",
                text: "Will do. Also, I tried the problem you mentioned about longest substring — I went with DP but got stuck on the edge cases.",
                time: "Jan 24, 10:00 AM",
            },
            {
                id: 4,
                sender: "coach",
                text: "No worries, the dynamic programming approach was the right instinct. Practice those patterns and you'll nail it next time.",
                time: "Jan 24, 11:30 AM",
            },
        ],
    },
];

export const categories = [
    "All",
    "Investment Banking",
    "Consulting",
    "Law",
    "UCAT",
    "Oxbridge",
    "Software Engineering",
];

// ============================================================
// DASHBOARD WIDGETS DATA
// ============================================================

export interface QuickStat {
    label: string;
    value: number;
    suffix?: string;
    trend: string;
    icon: "calendar" | "clock" | "users" | "piggybank";
    color: string;
    bgTint: string;
}

export const quickStats: QuickStat[] = [
    {
        label: "Total Sessions",
        value: 7,
        trend: "↑ 2 this month",
        icon: "calendar",
        color: "#3B82F6",
        bgTint: "bg-blue-50",
    },
    {
        label: "Hours Coached",
        value: 5.5,
        suffix: " hrs",
        trend: "↑ 1.5 this month",
        icon: "clock",
        color: "#10B981",
        bgTint: "bg-emerald-50",
    },
    {
        label: "Coaches Worked With",
        value: 4,
        trend: "↑ 1 new this month",
        icon: "users",
        color: "#8B5CF6",
        bgTint: "bg-violet-50",
    },
    {
        label: "Money Saved vs Traditional",
        value: 280,
        suffix: "",
        trend: "vs £150+/hr coaches",
        icon: "piggybank",
        color: "#F59E0B",
        bgTint: "bg-amber-50",
    },
];

export interface MonthlySession {
    month: string;
    sessions: number;
    spent: number;
}

export const monthlySessionData: MonthlySession[] = [
    { month: "Sep", sessions: 1, spent: 50 },
    { month: "Oct", sessions: 0, spent: 0 },
    { month: "Nov", sessions: 1, spent: 55 },
    { month: "Dec", sessions: 1, spent: 60 },
    { month: "Jan", sessions: 3, spent: 150 },
    { month: "Feb", sessions: 1, spent: 50 },
];

export const spendingSummary = {
    total: 365,
    thisMonth: 50,
};

export interface Deadline {
    id: number;
    title: string;
    timeLeft: string;
    category: string;
    urgency: "closing" | "upcoming" | "plenty";
    color: string;
}

export const deadlines: Deadline[] = [
    {
        id: 1,
        title: "Spring Week applications",
        timeLeft: "6 weeks left",
        category: "Investment Banking",
        urgency: "closing",
        color: "#F59E0B",
    },
    {
        id: 2,
        title: "Law vac scheme deadlines",
        timeLeft: "Feb – Apr",
        category: "Law",
        urgency: "upcoming",
        color: "#3B82F6",
    },
    {
        id: 3,
        title: "UCAT registration opens",
        timeLeft: "April",
        category: "UCAT",
        urgency: "plenty",
        color: "#10B981",
    },
];

export const referralInfo = {
    code: "ALEX-EDGE-24",
    discount: 10,
    friendsInvited: 0,
};

export interface TrendingCategory {
    name: string;
    trend: number;
    color: string;
    category: string;
}

export const trendingCategories: TrendingCategory[] = [
    { name: "IB Spring Week", trend: 42, color: "#3B82F6", category: "Investment Banking" },
    { name: "Consulting", trend: 18, color: "#8B5CF6", category: "Consulting" },
    { name: "UCAT", trend: 25, color: "#10B981", category: "UCAT" },
    { name: "Law TC", trend: 15, color: "#6366F1", category: "Law" },
];

export const streakInfo = {
    currentStreak: 3,
    sessionsThisMonth: 3,
    goal: 4,
    nextSession: "Tomorrow",
};

export const categoryColorMap: Record<string, string> = {
    "Investment Banking": "#3B82F6",
    "Consulting": "#8B5CF6",
    "Law": "#6366F1",
    "UCAT": "#10B981",
    "Oxbridge": "#F59E0B",
    "Software Engineering": "#06B6D4",
};
