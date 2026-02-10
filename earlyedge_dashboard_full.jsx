import { useState, useRef, useEffect } from "react";

// ============================================================
// DATA
// ============================================================

const allCoaches = [
  {
    id: 1, name: "Sarah K.", credential: "Goldman Sachs Incoming Analyst", uni: "Oxford '24",
    rating: 4.9, reviews: 47, tags: ["Investment Banking", "Spring Week", "CV Review"],
    rate: 50, avatar: "SK", category: "Investment Banking",
    bio: "Landed Spring Weeks at Goldman & Citi. Helped 15+ friends get offers — I know exactly what recruiters look for.",
    sessions: 63, packageName: "Spring Week Sprint", packageSessions: 5, packagePrice: 150,
    hasBooked: true, fullBio: "I'm a final-year PPE student at Oxford, joining Goldman Sachs as an Analyst in 2025. I secured Spring Weeks at Goldman, Citi, and Barclays in 2024 — and I've since helped 15+ friends successfully land their own Spring Week offers. I specialise in CV optimisation, cover letter strategy, and behavioural interview prep. I remember exactly what the process was like, what questions came up, and what made the difference between getting through and getting cut.",
  },
  {
    id: 2, name: "David W.", credential: "McKinsey Summer Associate", uni: "Cambridge '23",
    rating: 5.0, reviews: 32, tags: ["Consulting", "Case Studies", "Strategy"],
    rate: 60, avatar: "DW", category: "Consulting",
    bio: "Ex-McKinsey intern, now returning full-time. Cracked 20+ case interviews and can teach you the frameworks that work.",
    sessions: 48, packageName: "Case Interview Intensive", packageSessions: 4, packagePrice: 200,
    hasBooked: true, fullBio: "Economics at Cambridge, spent my summer at McKinsey London and returning full-time in September. Before landing McKinsey, I went through 20+ case interviews across MBB and Big 4 firms. I've developed a structured approach to case interviews that goes beyond the standard frameworks — it's about genuinely thinking through problems in a way that impresses interviewers. I also help with PEI stories, written cases, and overall application strategy.",
  },
  {
    id: 3, name: "Emily R.", credential: "Clifford Chance Trainee", uni: "LSE '23",
    rating: 4.8, reviews: 28, tags: ["Law", "TC Applications", "LNAT", "Vac Schemes"],
    rate: 45, avatar: "ER", category: "Law",
    bio: "Secured vac schemes at 4 magic circle firms. Specialise in commercial awareness and application forms.",
    sessions: 34, packageName: "Vac Scheme Bundle", packageSessions: 4, packagePrice: 130,
    hasBooked: false, fullBio: "I'm a trainee at Clifford Chance starting in September 2025. During my time at LSE, I secured vacation schemes at Clifford Chance, Linklaters, Freshfields, and Slaughter and May. I know exactly what these firms look for in their application forms and interviews. I specialise in helping with commercial awareness, Watson Glaser prep, and TC application strategy. I also scored in the top 5% for the LNAT, so can help with university law applications too.",
  },
  {
    id: 4, name: "James L.", credential: "Meta Software Engineer", uni: "Imperial '22",
    rating: 4.9, reviews: 41, tags: ["Software Engineering", "Coding", "System Design"],
    rate: 55, avatar: "JL", category: "Software Engineering",
    bio: "SWE at Meta. Did 100+ LeetCode problems and went through the full tech interview loop — I'll get you ready.",
    sessions: 52, packageName: "Tech Interview Prep", packageSessions: 5, packagePrice: 225,
    hasBooked: false, fullBio: "I graduated from Imperial in 2022 with a First in Computer Science, and I've been working at Meta London since. I went through the full interview loop at Meta, Google, Amazon, and several startups — so I know exactly what each company expects. I've solved 100+ LeetCode problems and can teach you the patterns rather than individual solutions. I also cover system design for more senior roles.",
  },
  {
    id: 5, name: "Priya M.", credential: "UCAT Score 3150", uni: "UCL Medicine '24",
    rating: 4.7, reviews: 19, tags: ["UCAT", "Medicine", "MMI Interviews"],
    rate: 40, avatar: "PM", category: "UCAT",
    bio: "Scored 3150 on UCAT and got 4 med school offers. I teach timing strategies that actually work under pressure.",
    sessions: 28, packageName: "UCAT Score Boost", packageSessions: 5, packagePrice: 175,
    hasBooked: false, fullBio: "I'm a first-year medical student at UCL. I scored 3150 on the UCAT (top 2%) and received offers from UCL, King's, Bristol, and Leeds. I struggled with timing initially but developed specific strategies for each section that dramatically improved my score. I focus on teaching these strategies so you can apply them under real test conditions.",
  },
  {
    id: 6, name: "Tom H.", credential: "Oxford PPE '24", uni: "Eton College",
    rating: 4.9, reviews: 35, tags: ["Oxbridge", "Personal Statement", "Interviews"],
    rate: 55, avatar: "TH", category: "Oxbridge",
    bio: "Got into Oxford PPE on my first attempt. I've since helped 8 students get Oxbridge offers through interview and PS prep.",
    sessions: 41, packageName: "Oxbridge Interview Prep", packageSessions: 4, packagePrice: 180,
    hasBooked: false, fullBio: "I'm reading PPE at Oxford and was the first in my family to apply to Oxbridge. I know how intimidating the process can be, especially if your school doesn't have a track record of sending students to Oxford or Cambridge. I've since helped 8 students get offers across PPE, Economics, History, and English. I specialise in personal statement review and intensive mock interview preparation.",
  },
  {
    id: 7, name: "Aisha N.", credential: "J.P. Morgan Spring Week '24", uni: "Warwick '25",
    rating: 4.6, reviews: 14, tags: ["Investment Banking", "Spring Week", "Networking"],
    rate: 35, avatar: "AN", category: "Investment Banking",
    bio: "Landed JPM Spring Week through cold emailing. I specialise in networking strategy and breaking in without connections.",
    sessions: 18, packageName: "Cold Email Blueprint", packageSessions: 3, packagePrice: 90,
    hasBooked: false, fullBio: "I'm a second-year Economics student at Warwick. I had no connections in finance and no prior internship experience when I started applying. I landed my J.P. Morgan Spring Week entirely through cold emailing and networking — and I've refined that process into a repeatable system. If you don't have a finance background or connections, I'm the coach for you.",
  },
  {
    id: 8, name: "Marcus D.", credential: "BCG Summer Consultant", uni: "LSE '23",
    rating: 4.8, reviews: 22, tags: ["Consulting", "Case Studies", "Behavioural"],
    rate: 50, avatar: "MD", category: "Consulting",
    bio: "BCG summer offer from a non-target background. Specialise in helping non-traditional candidates break into MBB.",
    sessions: 30, packageName: "MBB Application Sprint", packageSessions: 5, packagePrice: 200,
    hasBooked: false, fullBio: "I studied Management at LSE and landed a summer consulting role at BCG. What makes me different is that I came from a completely non-traditional background — no family in consulting, no prior internships, state school educated. I know exactly what it takes to stand out when you don't have the 'typical' profile. I focus on authentic PEI stories, case fundamentals, and application positioning.",
  },
];

const upcomingSessions = [
  { id: 1, coach: "Sarah K.", credential: "Goldman Sachs Spring Week '24", type: "CV Review", date: "Tomorrow", time: "2:00 PM", duration: "45 min", avatar: "SK", isNext: true, hasMessage: false, price: 50 },
  { id: 2, coach: "David W.", credential: "McKinsey Summer Associate", type: "Mock Interview", date: "Sun, Feb 8", time: "10:00 AM", duration: "60 min", avatar: "DW", isNext: false, hasMessage: true, price: 60 },
];

const pastBookings = [
  { id: 1, coach: "Sarah K.", credential: "Goldman Sachs Spring Week '24", type: "Application Strategy", date: "Jan 30, 2026", rating: 5, reviewed: true, coachRate: 50, avatar: "SK", price: 50 },
  { id: 2, coach: "James L.", credential: "Meta Software Engineer", type: "Coding Interview Prep", date: "Jan 23, 2026", rating: null, reviewed: false, coachRate: 55, avatar: "JL", price: 55 },
  { id: 3, coach: "Emily R.", credential: "Clifford Chance Trainee", type: "LNAT Prep", date: "Jan 16, 2026", rating: 4, reviewed: true, coachRate: 45, avatar: "ER", price: 45 },
  { id: 4, coach: "Sarah K.", credential: "Goldman Sachs Spring Week '24", type: "CV Review", date: "Jan 9, 2026", rating: 5, reviewed: true, coachRate: 50, avatar: "SK", price: 50 },
  { id: 5, coach: "David W.", credential: "McKinsey Summer Associate", type: "Case Interview Practice", date: "Dec 18, 2025", rating: 5, reviewed: true, coachRate: 60, avatar: "DW", price: 60 },
];

const conversations = [
  {
    id: 1, coach: "Sarah K.", avatar: "SK", credential: "Goldman Sachs Spring Week '24",
    lastMessage: "Great, I'll review your CV before our session tomorrow!", lastTime: "2 hours ago",
    unread: 1, online: true,
    messages: [
      { id: 1, sender: "student", text: "Hi Sarah! I've updated my CV with the changes we discussed last time. Should I send it over before tomorrow?", time: "Yesterday, 4:30 PM" },
      { id: 2, sender: "coach", text: "Yes please! Send it over and I'll take a look before our session so we can hit the ground running.", time: "Yesterday, 5:15 PM" },
      { id: 3, sender: "student", text: "Amazing, just sent it to your email. I've also added a section on my extracurriculars like you suggested.", time: "Yesterday, 5:22 PM" },
      { id: 4, sender: "coach", text: "Great, I'll review your CV before our session tomorrow!", time: "2 hours ago" },
    ]
  },
  {
    id: 2, coach: "David W.", avatar: "DW", credential: "McKinsey Summer Associate",
    lastMessage: "For Sunday's mock, prepare a market sizing case — I'll throw you something you haven't seen before", lastTime: "5 hours ago",
    unread: 1, online: false,
    messages: [
      { id: 1, sender: "coach", text: "Hey Alex! Looking forward to our mock interview on Sunday. Quick heads up on what to prepare.", time: "5 hours ago" },
      { id: 2, sender: "coach", text: "For Sunday's mock, prepare a market sizing case — I'll throw you something you haven't seen before", time: "5 hours ago" },
    ]
  },
  {
    id: 3, coach: "James L.", avatar: "JL", credential: "Meta Software Engineer",
    lastMessage: "No worries, the dynamic programming approach was the right instinct. Practice those patterns and you'll nail it next time.", lastTime: "Jan 24",
    unread: 0, online: false,
    messages: [
      { id: 1, sender: "student", text: "Hey James, thanks for the session! I'm still not fully confident on the graph traversal problems though.", time: "Jan 23, 6:00 PM" },
      { id: 2, sender: "coach", text: "That's totally normal — graph problems are one of the trickier areas. I'd recommend doing 5-6 BFS/DFS problems on LeetCode this week. Start with 'Number of Islands' and 'Course Schedule'.", time: "Jan 23, 7:45 PM" },
      { id: 3, sender: "student", text: "Will do. Also, I tried the problem you mentioned about longest substring — I went with DP but got stuck on the edge cases.", time: "Jan 24, 10:00 AM" },
      { id: 4, sender: "coach", text: "No worries, the dynamic programming approach was the right instinct. Practice those patterns and you'll nail it next time.", time: "Jan 24, 11:30 AM" },
    ]
  },
];

const categories = ["All", "Investment Banking", "Consulting", "Law", "UCAT", "Oxbridge", "Software Engineering"];

// ============================================================
// COMPONENTS
// ============================================================

const StarRating = ({ rating, size = 13 }) => (
  <div style={{ display: "flex", gap: 1 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} width={size} height={size} viewBox="0 0 16 16"
        fill={star <= rating ? "#111" : "none"} stroke={star <= rating ? "#111" : "#ccc"} strokeWidth="1.2">
        <path d="M8 1.5l1.85 3.75L14 5.9l-3 2.92.71 4.13L8 10.88l-3.71 1.95L5 8.7 2 5.9l4.15-.65z" />
      </svg>
    ))}
  </div>
);

const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#bbb" strokeWidth="1.5">
    <rect x="2" y="3" width="12" height="11" rx="2" /><path d="M5 2v2M11 2v2M2 7h12" />
  </svg>
);

const ClockIcon = ({ color = "#bbb" }) => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" /><path d="M8 5v3.5l2.5 1.5" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#999" strokeWidth="1.5">
    <circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.5">
    <path d="M2 8l12-5-5 12-2-5z" /><path d="M14 3L7 10" />
  </svg>
);

// ============================================================
// MAIN DASHBOARD
// ============================================================

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Overview");
  const [hoveredCoach, setHoveredCoach] = useState(null);
  const [hoveredPast, setHoveredPast] = useState(null);
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Browse state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedCoach, setSelectedCoach] = useState(null);

  // Bookings state
  const [bookingsTab, setBookingsTab] = useState("upcoming");

  // Messages state
  const [activeConvo, setActiveConvo] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [localConvos, setLocalConvos] = useState(conversations);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConvo]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    const newMsg = { id: Date.now(), sender: "student", text: messageInput, time: "Just now" };
    const updated = localConvos.map(c =>
      c.id === activeConvo.id ? { ...c, messages: [...c.messages, newMsg], lastMessage: messageInput, lastTime: "Just now" } : c
    );
    setLocalConvos(updated);
    setActiveConvo(prev => ({ ...prev, messages: [...prev.messages, newMsg], lastMessage: messageInput, lastTime: "Just now" }));
    setMessageInput("");
  };

  const filteredCoaches = allCoaches.filter(c => {
    const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.credential.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.rate - b.rate;
    if (sortBy === "price-high") return b.rate - a.rate;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.sessions - a.sessions;
  });

  const unreviewedCount = pastBookings.filter(s => !s.reviewed).length;
  const totalUnread = localConvos.reduce((sum, c) => sum + c.unread, 0);

  const navItems = [
    { label: "Overview", dot: false },
    { label: "Browse Coaches", dot: false },
    { label: "My Bookings", dot: unreviewedCount > 0 },
    { label: "Messages", dot: totalUnread > 0 },
  ];

  // ============================================================
  // OVERVIEW PAGE
  // ============================================================
  const OverviewPage = () => (
    <>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, letterSpacing: "-0.02em", margin: 0 }}>
          {showEmptyState ? "Welcome to EarlyEdge" : "Welcome back, Alex"}
        </h1>
        <p style={{ fontSize: 14, color: "#999", margin: "6px 0 0" }}>
          {showEmptyState ? "Find a coach who just did what you're trying to do" : "Here's what's coming up"}
        </p>
      </div>

      {showEmptyState ? (
        <>
          <div style={{ background: "#111", borderRadius: 14, padding: "32px 32px 28px", marginBottom: 32, color: "#fff" }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.02em" }}>What are you working towards?</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Pick a category and we'll match you with coaches who just did it</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Spring Weeks", "Consulting", "Law", "UCAT", "Oxbridge", "Software Engineering"].map((cat) => (
                <button key={cat} onClick={() => { setActivePage("Browse Coaches"); setSelectedCategory(cat === "Spring Weeks" ? "Investment Banking" : cat); }} style={{
                  padding: "8px 18px", fontSize: 13, fontWeight: 500,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8, color: "#fff", cursor: "pointer", transition: "all 0.2s",
                }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "14px 24px", marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, color: "#666" }}><span style={{ fontWeight: 600, color: "#111" }}>Spring Week season is open</span> — most applications close in 6 weeks</div>
            <span onClick={() => { setActivePage("Browse Coaches"); setSelectedCategory("Investment Banking"); }} style={{ fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View Spring Week coaches →</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "12px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#666" }}><span style={{ fontWeight: 600, color: "#111" }}>Spring Week season is open</span> — applications close in 6 weeks</div>
            <span onClick={() => { setActivePage("Browse Coaches"); setSelectedCategory("Investment Banking"); }} style={{ fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#111" }}>View coaches →</span>
          </div>

          {/* Hero */}
          <div style={{ background: "#111", borderRadius: 14, padding: "28px 32px", marginBottom: 32, color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#666", fontWeight: 600 }}>Up next</div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 12px", fontSize: 11, fontWeight: 600, color: "#fff" }}>Tomorrow · 2:00 PM</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#222", border: "2px solid #444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: "#999" }}>SK</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 4 }}>CV Review</div>
                  <div style={{ fontSize: 13, color: "#888" }}>with <span style={{ color: "#ccc", fontWeight: 500 }}>Sarah K.</span> · Goldman Sachs Spring Week '24</div>
                  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: "#555" }}>45 min session</span>
                    <span onClick={() => { setActivePage("Messages"); setActiveConvo(localConvos[0]); }} style={{ fontSize: 12, color: "#555", cursor: "pointer", textDecoration: "underline", textDecorationColor: "#444", textUnderlineOffset: 2 }}>Send a message</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>Reschedule</span>
                <button style={{ background: "#fff", color: "#111", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Join call →</button>
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Upcoming</h2>
              <span onClick={() => setActivePage("My Bookings")} style={{ fontSize: 12, color: "#999", cursor: "pointer" }}>View all bookings →</span>
            </div>
            {upcomingSessions.filter(s => !s.isNext).map((session) => (
              <div key={session.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "16px 24px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#666" }}>{session.avatar}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{session.type}</span>
                      <span style={{ fontSize: 12, color: "#999" }}>with {session.coach}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
                      <CalendarIcon /> {session.date} at {session.time} <span style={{ color: "#ddd" }}>·</span> <ClockIcon /> {session.duration}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, alignItems: "center" }}>
                  {session.hasMessage && <span style={{ background: "#f0f0f0", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 500, color: "#666" }}>1 new message</span>}
                  <span style={{ color: "#999", cursor: "pointer" }}>Reschedule</span>
                  <span style={{ color: "#111", fontWeight: 500, cursor: "pointer" }}>View details →</span>
                </div>
              </div>
            ))}
          </div>

          {/* Review Nudge */}
          <div style={{ background: "#fff", border: "1px dashed #d0d0d0", borderRadius: 10, padding: "14px 24px", marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#999" strokeWidth="1.5"><path d="M8 1.5l1.85 3.75L14 5.9l-3 2.92.71 4.13L8 10.88l-3.71 1.95L5 8.7 2 5.9l4.15-.65z" /></svg>
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>
                {unreviewedCount === 1
                  ? <><span style={{ fontWeight: 500, color: "#111" }}>James L.</span> session on Jan 23 — you haven't left a review yet</>
                  : <>You have <span style={{ fontWeight: 500, color: "#111" }}>{unreviewedCount} sessions</span> to review</>}
              </div>
            </div>
            <span onClick={() => setActivePage("My Bookings")} style={{ fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#111" }}>
              {unreviewedCount === 1 ? "Leave review →" : "Review sessions →"}
            </span>
          </div>

          {/* Past Sessions */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Past sessions</h2>
              <span onClick={() => { setActivePage("My Bookings"); setBookingsTab("past"); }} style={{ fontSize: 12, color: "#999", cursor: "pointer" }}>View all →</span>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, overflow: "hidden" }}>
              {pastBookings.slice(0, 3).map((session, i) => (
                <div key={session.id} onMouseEnter={() => setHoveredPast(session.id)} onMouseLeave={() => setHoveredPast(null)}
                  style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < 2 ? "1px solid #f0f0f0" : "none", transition: "background 0.15s", background: hoveredPast === session.id ? "#fafafa" : "#fff" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{session.coach}</div>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{session.credential} · {session.type} · {session.date}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {session.reviewed ? <StarRating rating={session.rating} /> : <span style={{ fontSize: 12, color: "#999", cursor: "pointer", fontWeight: 500 }}>Leave review</span>}
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#111", cursor: "pointer", opacity: hoveredPast === session.id ? 1 : 0, transition: "opacity 0.2s" }}>Book again →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Coaches */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>{showEmptyState ? "Popular coaches" : "Coaches you might like"}</h2>
          <span onClick={() => setActivePage("Browse Coaches")} style={{ fontSize: 12, color: "#999", cursor: "pointer" }}>Browse all coaches →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {allCoaches.slice(0, 4).map((coach) => (
            <CoachCard key={coach.id} coach={coach} hovered={hoveredCoach === coach.id} onHover={setHoveredCoach} onSelect={setSelectedCoach} setPage={setActivePage} />
          ))}
        </div>
      </div>
    </>
  );

  // ============================================================
  // COACH CARD
  // ============================================================
  const CoachCard = ({ coach, hovered, onHover, onSelect, setPage, large }) => (
    <div
      onMouseEnter={() => onHover(coach.id)} onMouseLeave={() => onHover(null)}
      onClick={() => { onSelect(coach); setPage("Coach Profile"); }}
      style={{
        background: "#fff", border: hovered ? "1px solid #bbb" : "1px solid #e8e8e8",
        borderRadius: 12, padding: large ? "24px 26px 22px" : "22px 24px 20px", cursor: "pointer",
        transition: "all 0.25s ease", transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#666", border: "2px solid #e8e8e8" }}>{coach.avatar}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>{coach.name}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{coach.credential} · {coach.uni}</div>
          </div>
        </div>
        <div><div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.03em" }}>£{coach.rate}<span style={{ fontSize: 11, fontWeight: 400, color: "#999" }}>/hr</span></div></div>
      </div>
      <p style={{ fontSize: 12.5, color: "#555", lineHeight: 1.5, margin: "0 0 12px" }}>{coach.bio}</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="#111"><path d="M8 1.5l1.85 3.75L14 5.9l-3 2.92.71 4.13L8 10.88l-3.71 1.95L5 8.7 2 5.9l4.15-.65z" /></svg>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{coach.rating}</span>
          <span style={{ fontSize: 11, color: "#999" }}>({coach.reviews})</span>
        </div>
        <div style={{ fontSize: 11, color: "#999", display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#999" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="2" /><path d="M5 7h6M5 10h3" /></svg>
          {coach.sessions} sessions
        </div>
      </div>
      <div style={{ background: "#f8f8f8", borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{coach.packageName}</div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>{coach.packageSessions} sessions · £{Math.round(coach.packagePrice / coach.packageSessions)}/session</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>£{coach.packagePrice}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {coach.tags.slice(0, 3).map((tag) => (
            <span key={tag} style={{ fontSize: 10.5, padding: "3px 10px", background: "#f5f5f5", borderRadius: 20, color: "#666" }}>{tag}</span>
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", padding: "6px 14px", borderRadius: 6, background: hovered ? "#111" : "transparent", color: hovered ? "#fff" : "#111", transition: "all 0.2s" }}>
          {coach.hasBooked ? "Book again →" : "Free intro →"}
        </span>
      </div>
    </div>
  );

  // ============================================================
  // COACH PROFILE PAGE
  // ============================================================
  const CoachProfilePage = () => {
    if (!selectedCoach) return null;
    const c = selectedCoach;
    return (
      <>
        <div onClick={() => setActivePage("Browse Coaches")} style={{ fontSize: 13, color: "#999", cursor: "pointer", marginBottom: 24, display: "inline-flex", alignItems: "center", gap: 6 }}>
          ← Back to coaches
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
          {/* Left */}
          <div>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 28 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 600, color: "#666", border: "3px solid #e8e8e8", flexShrink: 0 }}>{c.avatar}</div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.03em" }}>{c.name}</h1>
                <div style={{ fontSize: 14, color: "#888", marginTop: 4 }}>{c.credential} · {c.uni}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="#111"><path d="M8 1.5l1.85 3.75L14 5.9l-3 2.92.71 4.13L8 10.88l-3.71 1.95L5 8.7 2 5.9l4.15-.65z" /></svg>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{c.rating}</span>
                    <span style={{ fontSize: 13, color: "#999" }}>({c.reviews} reviews)</span>
                  </div>
                  <span style={{ color: "#ddd" }}>·</span>
                  <span style={{ fontSize: 13, color: "#999" }}>{c.sessions} sessions completed</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.01em" }}>About</h3>
              <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.7, margin: 0 }}>{c.fullBio}</p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Specialities</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {c.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 12, padding: "6px 14px", background: "#f5f5f5", borderRadius: 20, color: "#555" }}>{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Reviews</h3>
              {[
                { name: "Alex M.", text: `${c.name} was incredibly helpful and gave me actionable feedback that I could implement immediately. Highly recommend.`, rating: 5, date: "Jan 28, 2026" },
                { name: "Sophie L.", text: "Really knowledgeable and patient. Felt like talking to a friend who genuinely wanted me to succeed.", rating: 5, date: "Jan 20, 2026" },
                { name: "Ravi P.", text: "Good session overall. Would have liked a bit more structure but the advice itself was very solid.", rating: 4, date: "Jan 14, 2026" },
              ].map((r, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 10, padding: "16px 20px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
                      <StarRating rating={r.rating} size={11} />
                    </div>
                    <span style={{ fontSize: 11, color: "#999" }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#555", lineHeight: 1.5, margin: 0 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "24px", position: "sticky", top: 40 }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>£{c.rate}<span style={{ fontSize: 14, fontWeight: 400, color: "#999" }}>/hr</span></div>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 20 }}>Single session</div>

              <button style={{ width: "100%", padding: "12px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 10, transition: "opacity 0.2s" }}>
                {c.hasBooked ? "Book a session" : "Book free intro"}
              </button>

              {!c.hasBooked && (
                <div style={{ fontSize: 11, color: "#999", textAlign: "center", marginBottom: 16 }}>15 min · No charge · See if it's a good fit</div>
              )}

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, marginTop: 6 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#999", fontWeight: 600, marginBottom: 10 }}>Package</div>
                <div style={{ background: "#f8f8f8", borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.packageName}</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>{c.packageSessions} sessions · £{Math.round(c.packagePrice / c.packageSessions)}/session</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 700 }}>£{c.packagePrice}</span>
                      <span style={{ fontSize: 12, color: "#999", marginLeft: 6, textDecoration: "line-through" }}>£{c.rate * c.packageSessions}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, background: "#eee", padding: "3px 8px", borderRadius: 4 }}>Save £{c.rate * c.packageSessions - c.packagePrice}</span>
                  </div>
                </div>
                <button style={{ width: "100%", padding: "10px", background: "#fff", color: "#111", border: "1px solid #e8e8e8", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 10, transition: "all 0.2s" }}>
                  Book package →
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // ============================================================
  // BROWSE COACHES PAGE
  // ============================================================
  const BrowsePage = () => (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, letterSpacing: "-0.02em", margin: 0 }}>Browse Coaches</h1>
        <p style={{ fontSize: 14, color: "#999", margin: "6px 0 0" }}>{filteredCoaches.length} coaches available</p>
      </div>

      {/* Search + Sort */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "10px 16px" }}>
          <SearchIcon />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search coaches, skills, or companies..."
            style={{ border: "none", outline: "none", fontSize: 13, flex: 1, background: "transparent", fontFamily: "inherit", color: "#111" }} />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#555", cursor: "pointer", fontFamily: "inherit", appearance: "none", paddingRight: 32, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
          <option value="recommended">Recommended</option>
          <option value="rating">Highest rated</option>
          <option value="price-low">Price: Low to high</option>
          <option value="price-high">Price: High to low</option>
        </select>
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "7px 16px", fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer",
              borderRadius: 20, transition: "all 0.2s", fontFamily: "inherit",
              background: selectedCategory === cat ? "#111" : "#fff",
              color: selectedCategory === cat ? "#fff" : "#666",
              borderColor: selectedCategory === cat ? "#111" : "#e8e8e8",
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Coach Grid */}
      {filteredCoaches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No coaches found</div>
          <div style={{ fontSize: 13 }}>Try adjusting your filters or search terms</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {filteredCoaches.map(coach => (
            <CoachCard key={coach.id} coach={coach} hovered={hoveredCoach === coach.id} onHover={setHoveredCoach} onSelect={setSelectedCoach} setPage={setActivePage} large />
          ))}
        </div>
      )}
    </>
  );

  // ============================================================
  // MY BOOKINGS PAGE
  // ============================================================
  const BookingsPage = () => (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, letterSpacing: "-0.02em", margin: 0 }}>My Bookings</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: "1px solid #e8e8e8" }}>
        {["upcoming", "past"].map(tab => (
          <button key={tab} onClick={() => setBookingsTab(tab)} style={{
            padding: "10px 20px", fontSize: 13, fontWeight: bookingsTab === tab ? 600 : 400,
            color: bookingsTab === tab ? "#111" : "#999", background: "none", border: "none",
            borderBottom: bookingsTab === tab ? "2px solid #111" : "2px solid transparent",
            cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize",
            marginBottom: -1, transition: "all 0.2s",
          }}>
            {tab} {tab === "upcoming" && `(${upcomingSessions.length})`}
            {tab === "past" && `(${pastBookings.length})`}
          </button>
        ))}
      </div>

      {bookingsTab === "upcoming" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {upcomingSessions.map(session => (
            <div key={session.id} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, color: "#666", border: "2px solid #e8e8e8" }}>{session.avatar}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>{session.type}</div>
                    <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>with {session.coach} · {session.credential}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>£{session.price}</div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Confirmed</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 24, marginTop: 18, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888" }}>
                  <CalendarIcon /> {session.date}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888" }}>
                  <ClockIcon /> {session.time} · {session.duration}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {session.isNext && <button style={{ padding: "8px 20px", background: "#111", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Join call →</button>}
                <button onClick={() => { setActivePage("Messages"); const convo = localConvos.find(c => c.avatar === session.avatar); if (convo) setActiveConvo(convo); }}
                  style={{ padding: "8px 20px", background: "#fff", color: "#111", border: "1px solid #e8e8e8", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Message coach</button>
                <button style={{ padding: "8px 20px", background: "#fff", color: "#999", border: "1px solid #e8e8e8", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Reschedule</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pastBookings.map(session => (
            <div key={session.id} onMouseEnter={() => setHoveredPast(session.id)} onMouseLeave={() => setHoveredPast(null)}
              style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "20px 24px", transition: "all 0.15s", borderColor: hoveredPast === session.id ? "#ccc" : "#e8e8e8" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#666" }}>{session.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{session.type} <span style={{ fontWeight: 400, color: "#999" }}>with {session.coach}</span></div>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 3, display: "flex", alignItems: "center", gap: 8 }}>
                      {session.date} <span style={{ color: "#ddd" }}>·</span> £{session.price} <span style={{ color: "#ddd" }}>·</span> {session.credential}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {session.reviewed ? <StarRating rating={session.rating} /> : (
                    <button style={{ padding: "6px 14px", background: "#111", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Leave review</button>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 500, cursor: "pointer", color: "#111", opacity: hoveredPast === session.id ? 1 : 0, transition: "opacity 0.2s" }}>
                    Book again →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  // ============================================================
  // MESSAGES PAGE
  // ============================================================
  const MessagesPage = () => (
    <div style={{ display: "flex", height: "calc(100vh - 80px)", margin: "-40px -48px", marginLeft: -48 }}>
      {/* Conversation List */}
      <div style={{ width: 320, borderRight: "1px solid #e8e8e8", background: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px 16px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Messages</h2>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {localConvos.map(convo => (
            <div key={convo.id} onClick={() => setActiveConvo(convo)}
              style={{
                padding: "16px 20px", cursor: "pointer", transition: "background 0.15s",
                background: activeConvo?.id === convo.id ? "#f5f5f5" : "#fff",
                borderBottom: "1px solid #f0f0f0",
              }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#666" }}>{convo.avatar}</div>
                  {convo.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 8, height: 8, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{convo.coach}</span>
                    <span style={{ fontSize: 10, color: "#999" }}>{convo.lastTime}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>{convo.credential}</div>
                  <div style={{ fontSize: 12, color: convo.unread > 0 ? "#111" : "#999", fontWeight: convo.unread > 0 ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {convo.lastMessage}
                  </div>
                </div>
                {convo.unread > 0 && (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>{convo.unread}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fafafa" }}>
        {/* Chat Header */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid #e8e8e8", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#666" }}>{activeConvo?.avatar}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{activeConvo?.coach}</div>
              <div style={{ fontSize: 11, color: "#999" }}>{activeConvo?.credential}</div>
            </div>
          </div>
          <button onClick={() => { const coach = allCoaches.find(c => c.avatar === activeConvo?.avatar); if (coach) { setSelectedCoach(coach); setActivePage("Coach Profile"); } }}
            style={{ padding: "6px 14px", background: "#fff", border: "1px solid #e8e8e8", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            View profile
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          {activeConvo?.messages.map((msg) => (
            <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "student" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "70%" }}>
                <div style={{
                  padding: "12px 16px", borderRadius: 12, fontSize: 13, lineHeight: 1.6,
                  background: msg.sender === "student" ? "#111" : "#fff",
                  color: msg.sender === "student" ? "#fff" : "#111",
                  border: msg.sender === "student" ? "none" : "1px solid #e8e8e8",
                  borderBottomRightRadius: msg.sender === "student" ? 4 : 12,
                  borderBottomLeftRadius: msg.sender === "student" ? 12 : 4,
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 10, color: "#999", marginTop: 4, textAlign: msg.sender === "student" ? "right" : "left", paddingLeft: 4, paddingRight: 4 }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid #e8e8e8", background: "#fff" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1, background: "#f5f5f5", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center" }}>
              <input
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type a message..."
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, flex: 1, fontFamily: "inherit", color: "#111" }}
              />
            </div>
            <button onClick={sendMessage}
              style={{
                width: 40, height: 40, borderRadius: 10, background: messageInput.trim() ? "#111" : "#ddd",
                border: "none", cursor: messageInput.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", flexShrink: 0,
              }}>
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#fafafa", color: "#111" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <aside style={{ width: 220, background: "#fff", borderRight: "1px solid #e8e8e8", padding: "32px 0", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        <div>
          <div style={{ padding: "0 28px", marginBottom: 48 }}>
            <span onClick={() => setActivePage("Overview")} style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, letterSpacing: "-0.02em", cursor: "pointer" }}>
              Early<span style={{ fontWeight: 700 }}>Edge</span>
            </span>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map((item) => (
              <div key={item.label} onClick={() => setActivePage(item.label)}
                style={{
                  padding: "10px 28px", fontSize: 14, cursor: "pointer",
                  fontWeight: activePage === item.label || (item.label === "Browse Coaches" && activePage === "Coach Profile") ? 600 : 400,
                  color: activePage === item.label || (item.label === "Browse Coaches" && activePage === "Coach Profile") ? "#111" : "#888",
                  borderLeft: activePage === item.label || (item.label === "Browse Coaches" && activePage === "Coach Profile") ? "2px solid #111" : "2px solid transparent",
                  transition: "all 0.2s ease", letterSpacing: "-0.01em",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                {item.label}
                {item.dot && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#111" }} />}
              </div>
            ))}
          </nav>
        </div>
        <div style={{ padding: "0 28px" }}>
          {activePage === "Overview" && (
            <div style={{ marginBottom: 20, display: "flex", gap: 6 }}>
              <button onClick={() => setShowEmptyState(false)} style={{ padding: "3px 8px", fontSize: 10, border: "1px solid #ddd", borderRadius: 3, background: !showEmptyState ? "#111" : "#fff", color: !showEmptyState ? "#fff" : "#999", cursor: "pointer", fontWeight: 500 }}>Active</button>
              <button onClick={() => setShowEmptyState(true)} style={{ padding: "3px 8px", fontSize: 10, border: "1px solid #ddd", borderRadius: 3, background: showEmptyState ? "#111" : "#fff", color: showEmptyState ? "#fff" : "#999", cursor: "pointer", fontWeight: 500 }}>New User</button>
            </div>
          )}
          <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>AC</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Alex Chen</div>
                <div style={{ fontSize: 11, color: "#999" }}>alex@example.com</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#999" }}>
              <span style={{ cursor: "pointer" }}>Settings</span>
              <span style={{ cursor: "pointer" }}>Log out</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, padding: activePage === "Messages" ? "40px 48px" : "40px 48px", maxWidth: activePage === "Messages" ? "none" : 920 }}>
        {activePage === "Overview" && <OverviewPage />}
        {activePage === "Browse Coaches" && <BrowsePage />}
        {activePage === "Coach Profile" && <CoachProfilePage />}
        {activePage === "My Bookings" && <BookingsPage />}
        {activePage === "Messages" && <MessagesPage />}
      </main>
    </div>
  );
};

export default Dashboard;
