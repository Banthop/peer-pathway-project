/* ═══════════════════════════════════════════════════════════════
   Coach Dashboard – Mock Data
   ═══════════════════════════════════════════════════════════════ */

export interface CoachSession {
    id: number;
    student: string;
    avatar: string;
    type: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    status: "upcoming" | "completed" | "cancelled";
    isNext?: boolean;
    hasMessage?: boolean;
    reviewed?: boolean;
    rating?: number;
}

export interface MonthlyEarning {
    month: string;
    shortMonth: string;
    amount: number;
    sessions: number;
}

export interface Payout {
    id: number;
    date: string;
    amount: number;
    sessions: number;
    status: "paid" | "pending" | "processing";
}

export interface StudentReview {
    id: number;
    student: string;
    avatar: string;
    rating: number;
    text: string;
    date: string;
    sessionType: string;
    outcome?: string;
    replied?: boolean;
    reply?: string;
}

export interface AnalyticsData {
    weeklySessionCounts: { week: string; count: number }[];
    topServices: { name: string; sessions: number; revenue: number }[];
    studentCategories: { category: string; count: number; pct: number }[];
    bookingRate: number;
    avgSessionLength: number;
    repeatStudentRate: number;
}

/* ─── Coach Identity ────────────────────────────────────────── */

export const coachProfile = {
    name: "Sarah K.",
    email: "sarah@earlyedge.co",
    avatar: "SK",
    credential: "Goldman Sachs Incoming Analyst",
    slug: "sarah-k",
};

/* ─── Stats ─────────────────────────────────────────────────── */

export const coachStats = {
    totalEarningsThisMonth: 1240,
    earningsChange: 18,
    sessionsThisMonth: 16,
    sessionsChange: 12,
    averageRating: 4.9,
    totalReviews: 47,
    profileViews: 342,
    viewsChange: 24,
    totalEarningsAllTime: 4820,
    pendingPayout: 380,
    nextPayoutDate: "Feb 15, 2026",
};

/* ─── Upcoming Sessions ────────────────────────────────────── */

export const upcomingCoachSessions: CoachSession[] = [
    {
        id: 1, student: "Alex C.", avatar: "AC", type: "CV Review",
        date: "Tomorrow", time: "2:00 PM", duration: "45 min", price: 50,
        status: "upcoming", isNext: true, hasMessage: true,
    },
    {
        id: 2, student: "Priya S.", avatar: "PS", type: "Mock Interview",
        date: "Sun, Feb 8", time: "10:00 AM", duration: "60 min", price: 60,
        status: "upcoming", isNext: false, hasMessage: false,
    },
    {
        id: 3, student: "James R.", avatar: "JR", type: "Application Strategy",
        date: "Mon, Feb 9", time: "3:30 PM", duration: "45 min", price: 50,
        status: "upcoming", isNext: false, hasMessage: true,
    },
    {
        id: 4, student: "Emma T.", avatar: "ET", type: "Cover Letter Review",
        date: "Wed, Feb 11", time: "11:00 AM", duration: "30 min", price: 35,
        status: "upcoming", isNext: false, hasMessage: false,
    },
];

/* ─── Past Sessions ─────────────────────────────────────────── */

export const pastCoachSessions: CoachSession[] = [
    { id: 101, student: "Alex C.", avatar: "AC", type: "Application Strategy", date: "Jan 30, 2026", time: "2:00 PM", duration: "45 min", price: 50, status: "completed", reviewed: true, rating: 5 },
    { id: 102, student: "Omar K.", avatar: "OK", type: "CV Review", date: "Jan 28, 2026", time: "11:00 AM", duration: "45 min", price: 50, status: "completed", reviewed: true, rating: 5 },
    { id: 103, student: "Sophie L.", avatar: "SL", type: "Mock Interview", date: "Jan 25, 2026", time: "3:00 PM", duration: "60 min", price: 60, status: "completed", reviewed: true, rating: 4 },
    { id: 104, student: "James R.", avatar: "JR", type: "Cover Letter Review", date: "Jan 22, 2026", time: "10:00 AM", duration: "30 min", price: 35, status: "completed", reviewed: false },
    { id: 105, student: "Priya S.", avatar: "PS", type: "Application Strategy", date: "Jan 18, 2026", time: "1:00 PM", duration: "45 min", price: 50, status: "completed", reviewed: true, rating: 5 },
    { id: 106, student: "Lucy W.", avatar: "LW", type: "Mock Interview", date: "Jan 15, 2026", time: "4:00 PM", duration: "60 min", price: 60, status: "completed", reviewed: true, rating: 5 },
    { id: 107, student: "Ryan M.", avatar: "RM", type: "CV Review", date: "Jan 12, 2026", time: "9:30 AM", duration: "45 min", price: 50, status: "completed", reviewed: true, rating: 4 },
    { id: 108, student: "Zara A.", avatar: "ZA", type: "Application Strategy", date: "Jan 8, 2026", time: "2:30 PM", duration: "45 min", price: 50, status: "completed", reviewed: true, rating: 5 },
];

/* ─── Today's Schedule ──────────────────────────────────────── */

export const todaySchedule = [
    { time: "10:00 AM", student: "Omar K.", type: "CV Review", duration: "45 min" },
    { time: "2:00 PM", student: "Alex C.", type: "CV Review", duration: "45 min" },
    { time: "4:30 PM", student: "Sophie L.", type: "Mock Interview", duration: "60 min" },
];

/* ─── Monthly Earnings ──────────────────────────────────────── */

export const monthlyEarnings: MonthlyEarning[] = [
    { month: "September", shortMonth: "Sep", amount: 420, sessions: 8 },
    { month: "October", shortMonth: "Oct", amount: 680, sessions: 12 },
    { month: "November", shortMonth: "Nov", amount: 890, sessions: 15 },
    { month: "December", shortMonth: "Dec", amount: 760, sessions: 13 },
    { month: "January", shortMonth: "Jan", amount: 1050, sessions: 18 },
    { month: "February", shortMonth: "Feb", amount: 1240, sessions: 16 },
];

/* ─── Payout History ────────────────────────────────────────── */

export const payoutHistory: Payout[] = [
    { id: 1, date: "Feb 15, 2026", amount: 380, sessions: 5, status: "pending" },
    { id: 2, date: "Feb 1, 2026", amount: 860, sessions: 11, status: "processing" },
    { id: 3, date: "Jan 15, 2026", amount: 520, sessions: 9, status: "paid" },
    { id: 4, date: "Jan 1, 2026", amount: 530, sessions: 9, status: "paid" },
    { id: 5, date: "Dec 15, 2025", amount: 410, sessions: 7, status: "paid" },
    { id: 6, date: "Dec 1, 2025", amount: 350, sessions: 6, status: "paid" },
];

/* ─── Service Breakdown ─────────────────────────────────────── */

export const serviceBreakdown = [
    { name: "Mock Interview", sessions: 28, revenue: 1680, pct: 42 },
    { name: "CV Review", sessions: 22, revenue: 1100, pct: 27 },
    { name: "Application Strategy", sessions: 16, revenue: 800, pct: 20 },
    { name: "Cover Letter Review", sessions: 9, revenue: 315, pct: 11 },
];

/* ─── Reviews ───────────────────────────────────────────────── */

export const coachReviews: StudentReview[] = [
    { id: 1, student: "Alex C.", avatar: "AC", rating: 5, text: "Sarah was incredibly helpful and gave me actionable feedback that I could implement immediately. My CV is so much stronger now.", date: "Jan 30, 2026", sessionType: "Application Strategy", outcome: "Goldman Sachs Spring Week", replied: true, reply: "Thanks Alex! So glad to hear about the Goldman offer! You earned it!" },
    { id: 2, student: "Omar K.", avatar: "OK", rating: 5, text: "Really thorough CV review. Sarah spotted things I would never have noticed and knew exactly what recruiters are looking for.", date: "Jan 28, 2026", sessionType: "CV Review" },
    { id: 3, student: "Sophie L.", avatar: "SL", rating: 4, text: "Good mock interview session. The behavioural questions were very realistic. Would have liked a bit more time on technical questions but overall very solid.", date: "Jan 25, 2026", sessionType: "Mock Interview" },
    { id: 4, student: "Priya S.", avatar: "PS", rating: 5, text: "Sarah's strategy session changed my whole approach to applications. She helped me prioritise firms and create a timeline that actually worked.", date: "Jan 18, 2026", sessionType: "Application Strategy", outcome: "J.P. Morgan Spring Week" },
    { id: 5, student: "Lucy W.", avatar: "LW", rating: 5, text: "Best mock interview prep I've had. Sarah made it feel like a real interview and her feedback was incredibly detailed and constructive.", date: "Jan 15, 2026", sessionType: "Mock Interview", outcome: "Citi Summer Analyst" },
    { id: 6, student: "Ryan M.", avatar: "RM", rating: 4, text: "Helpful session, Sarah clearly knows what she's talking about. My CV looks much more professional now.", date: "Jan 12, 2026", sessionType: "CV Review" },
    { id: 7, student: "Zara A.", avatar: "ZA", rating: 5, text: "Absolutely worth every penny. Sarah helped me craft a narrative across my CV and cover letter that really stood out.", date: "Jan 8, 2026", sessionType: "Application Strategy", outcome: "Barclays Spring Week" },
    { id: 8, student: "Tom B.", avatar: "TB", rating: 5, text: "Sarah gave me the confidence I needed going into my spring week interviews. Her tips on competency questions were spot on.", date: "Dec 20, 2025", sessionType: "Mock Interview" },
];

/* ─── Rating Distribution ───────────────────────────────────── */

export const ratingDistribution = [
    { stars: 5, count: 38 },
    { stars: 4, count: 7 },
    { stars: 3, count: 2 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
];

export const ratingBreakdown = {
    knowledge: 5.0,
    value: 4.8,
    responsiveness: 4.9,
    supportiveness: 5.0,
};

/* ─── Analytics ─────────────────────────────────────────────── */

export const analyticsData: AnalyticsData = {
    weeklySessionCounts: [
        { week: "Dec 2", count: 2 },
        { week: "Dec 9", count: 3 },
        { week: "Dec 16", count: 4 },
        { week: "Dec 23", count: 1 },
        { week: "Dec 30", count: 3 },
        { week: "Jan 6", count: 4 },
        { week: "Jan 13", count: 5 },
        { week: "Jan 20", count: 4 },
        { week: "Jan 27", count: 5 },
        { week: "Feb 3", count: 3 },
    ],
    topServices: [
        { name: "Mock Interview", sessions: 28, revenue: 1680 },
        { name: "CV Review", sessions: 22, revenue: 1100 },
        { name: "Application Strategy", sessions: 16, revenue: 800 },
        { name: "Cover Letter Review", sessions: 9, revenue: 315 },
    ],
    studentCategories: [
        { category: "Investment Banking", count: 34, pct: 45 },
        { category: "Consulting", count: 15, pct: 20 },
        { category: "General Finance", count: 12, pct: 16 },
        { category: "Law", count: 8, pct: 11 },
        { category: "Other", count: 6, pct: 8 },
    ],
    bookingRate: 78,
    avgSessionLength: 52,
    repeatStudentRate: 64,
};

/* ─── Calendar helper ───────────────────────────────────────── */

export interface CalendarDay {
    day: number;
    sessions: CoachSession[];
    isToday: boolean;
    isCurrentMonth: boolean;
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const days: CalendarDay[] = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, sessions: [], isToday: false, isCurrentMonth: false });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
        days.push({ day: d, sessions: [], isToday, isCurrentMonth: true });
    }

    // Next month padding
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
            days.push({ day: i, sessions: [], isToday: false, isCurrentMonth: false });
        }
    }

    return days;
}
