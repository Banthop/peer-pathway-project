import { useState } from "react";

const coach = {
  name: "Priya M.",
  initials: "PM",
  headline: "UCAT 3200, top 1%. I'll show you exactly how to prepare.",
  credential: "Cambridge Medicine '24",
  credentialDate: "2024",
  uni: "University of Cambridge",
  uniLogo: "🟥",
  degree: "Medicine (Clinical), Year 2",
  gradYear: "2024 – present",
  rate: 40,
  sessions: 38,
  followers: 64,
  rating: 4.9,
  reviewCount: 34,
  tags: ["UCAT", "Verbal Reasoning", "Quantitative Reasoning", "Abstract Reasoning", "Situational Judgement", "Medicine Applications"],
  bio: `I scored 3200 on UCAT (top 1%) and got into Cambridge Medicine on my first attempt. I went from averaging 2400 in my first practice test to 3200 on test day, so I know exactly what it takes to improve quickly.

I break down each section into clear strategies so you know what to do before you even see the question. My students typically improve 300-500 points across our sessions together.

I also help with the broader medicine application, including personal statements, MMI prep, and choosing the right universities based on your UCAT score.`,
  nextAvailable: "Tomorrow, 11:00 AM",
  landedOffers: 8,
};

const services = [
  { name: "UCAT Diagnostic & Strategy", duration: "60 min", price: 40, desc: "Full diagnostic test review. I'll identify your weak areas and build a personalised study plan for each section." },
  { name: "Section-Specific Deep Dive", duration: "45 min", price: 35, desc: "Focused session on any single UCAT section. Learn the patterns, timing tricks, and strategies that got me 3200." },
  { name: "Full Mock + Review", duration: "75 min", price: 50, desc: "Sit a timed mock under real conditions, then we go through every mistake together and fix your approach." },
  { name: "Medicine Application Review", duration: "60 min", price: 40, desc: "Personal statement feedback, university shortlisting based on your UCAT score, and interview prep advice." },
];

const experience = [
  { role: "Medical Student", company: "University of Cambridge", logo: "🟥", period: "2024 – Present", desc: "Year 2 Medicine. Active in student mentoring and outreach programmes.", tags: ["Medicine", "Mentoring"] },
  { role: "UCAT Tutor", company: "Self-employed", logo: "📚", period: "2024 – Present", desc: "Coached 30+ students on UCAT prep. Average student improvement of 400+ points.", tags: ["UCAT", "Tutoring"] },
];

const reviews = [
  { name: "Sophie T.", time: "2 weeks ago", rating: 5, text: "Priya completely changed my approach to Verbal Reasoning. I was running out of time on every section and she taught me a skimming method that saved me 3 minutes per passage. Went from 620 to 780.", outcome: "Cambridge Medicine Offer", tags: ["Section-Specific Deep Dive"] },
  { name: "Arun P.", time: "3 weeks ago", rating: 5, text: "Had 5 sessions with Priya covering all sections. She spotted patterns in my mistakes I never would have noticed. My mock scores jumped from 2500 to 2950 in three weeks.", outcome: "UCAT Score: 2950", tags: ["UCAT Diagnostic & Strategy"] },
  { name: "Isla M.", time: "1 month ago", rating: 5, text: "The mock review session was incredibly detailed. Priya went through every question I got wrong and explained the fastest way to solve each type. Really practical, no waffle.", tags: ["Full Mock + Review"] },
  { name: "James W.", time: "1 month ago", rating: 4, text: "Really helpful for understanding how to pick universities based on my predicted UCAT band. Priya also gave my personal statement honest, constructive feedback which made it much stronger.", outcome: "Bristol Medicine Offer", tags: ["Medicine Application Review"] },
  { name: "Zara K.", time: "2 months ago", rating: 5, text: "I was panicking about Abstract Reasoning and Priya calmed me down and gave me a systematic approach for every pattern type. Got 830 on test day which I never thought was possible.", outcome: "UCAT Score: 3100", tags: ["Section-Specific Deep Dive"] },
];

const reviewBreakdown = { Knowledge: 5.0, Value: 4.9, Responsiveness: 4.8, Supportiveness: 5.0 };

const availableSlots = [
  { day: "Tomorrow", time: "11:00 AM" },
  { day: "Tomorrow", time: "4:00 PM" },
  { day: "Thu, Feb 13", time: "10:00 AM" },
  { day: "Thu, Feb 13", time: "2:00 PM" },
  { day: "Sat, Feb 15", time: "9:00 AM" },
  { day: "Sat, Feb 15", time: "1:00 PM" },
  { day: "Sun, Feb 16", time: "11:00 AM" },
];

const similarCoaches = [
  { name: "Omar H.", initials: "OH", credential: "UCAT 3150, Edinburgh Medicine '24", rate: 35, rating: 4.8, reviews: 22, tags: ["UCAT", "SJT"] },
  { name: "Lucy F.", initials: "LF", credential: "UCAT 3050, UCL Medicine '24", rate: 35, rating: 4.7, reviews: 18, tags: ["UCAT", "QR"] },
  { name: "Daniel K.", initials: "DK", credential: "UCAT 3180, Oxford Medicine '23", rate: 45, rating: 4.9, reviews: 41, tags: ["UCAT", "MMI Prep"] },
];

function StarRating({ rating, size = 13 }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#111" : "#ddd"} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

function Avatar({ initials, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: "#111", color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 600, flexShrink: 0, letterSpacing: "0.02em",
    }}>{initials}</div>
  );
}

function Badge({ children, dark }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 100,
      fontSize: 12, fontWeight: 500, background: dark ? "#111" : "#f3f3f3",
      color: dark ? "#fff" : "#555", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

export default function CoachProfile() {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [activeReviewFilter, setActiveReviewFilter] = useState("All");
  const [showAllSlots, setShowAllSlots] = useState(false);

  const filteredReviews = activeReviewFilter === "All"
    ? reviews
    : reviews.filter(r => r.tags?.includes(activeReviewFilter));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');`}</style>

      {/* NAV */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 48px", borderBottom: "1px solid #eee", position: "sticky",
        top: 0, background: "#fff", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontStyle: "italic", color: "#111", fontWeight: 400 }}>EarlyEdge</span>
          <div style={{ display: "flex", gap: 24, fontSize: 13.5, color: "#666" }}>
            <span style={{ cursor: "pointer" }}>Browse ▾</span>
            <span style={{ cursor: "pointer" }}>Become a Coach</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 13.5, color: "#666", cursor: "pointer" }}>Log in</span>
          <button style={{
            background: "#111", color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>Get Started</button>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 80px", display: "flex", gap: 32 }}>

        {/* LEFT COLUMN */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* HERO */}
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 20 }}>
            <Avatar initials={coach.initials} size={72} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#111" }}>{coach.name}</h1>
                <span style={{
                  background: "#111", color: "#fff", fontSize: 10, fontWeight: 600,
                  padding: "2px 8px", borderRadius: 100, letterSpacing: "0.04em",
                }}>VERIFIED</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 4 }}>
                  <StarRating rating={coach.rating} size={12} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{coach.rating}</span>
                  <span style={{ fontSize: 12.5, color: "#999" }}>({coach.reviewCount})</span>
                </div>
              </div>
              <p style={{ fontSize: 14.5, color: "#555", margin: "0 0 8px 0", lineHeight: 1.4 }}>{coach.headline}</p>
              <div style={{ display: "flex", gap: 12, fontSize: 13, color: "#888" }}>
                <span>{coach.sessions} sessions</span>
                <span>·</span>
                <span>{coach.followers} followers</span>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 13, color: "#555", background: "#f7f7f7",
                  padding: "6px 14px", borderRadius: 8,
                }}>
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{coach.uniLogo}</span>
                  <span>Studying at <strong style={{ color: "#111" }}>Cambridge</strong></span>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 13, color: "#555", background: "#f7f7f7",
                  padding: "6px 14px", borderRadius: 8,
                }}>
                  <span style={{ fontSize: 22, lineHeight: 1 }}>🎯</span>
                  <span><strong style={{ color: "#111" }}>UCAT Score: 3200</strong> (Top 1%)</span>
                </div>
              </div>

              {/* Outcome badges */}
              {coach.landedOffers > 0 && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111" }}>
                    Landed offers at
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {["Cam", "Ox", "UCL", "Bris", "Edin", "KCL"].map((c, i) => (
                      <span key={i} style={{
                        width: 28, height: 22, borderRadius: 100, background: "#f0f0f0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 8.5, fontWeight: 700, color: "#555", padding: "0 4px",
                      }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ height: 1, background: "#eee", margin: "24px 0" }} />

          {/* ABOUT */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 12 }}>About {coach.name.split(" ")[0]}</h2>
            <div style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>
              {bioExpanded ? coach.bio : coach.bio.substring(0, 260) + "..."}
              <button
                onClick={() => setBioExpanded(!bioExpanded)}
                style={{
                  background: "none", border: "none", color: "#111", fontWeight: 600,
                  cursor: "pointer", fontSize: 13.5, marginLeft: 4, fontFamily: "'DM Sans', sans-serif",
                }}
              >{bioExpanded ? "Show less" : "Read more"}</button>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 8, fontWeight: 500 }}>Can help with:</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {coach.tags.map(t => <Badge key={t}>{t}</Badge>)}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "#eee", margin: "24px 0" }} />

          {/* COACHING SERVICES */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 16 }}>Coaching Services</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {services.map((s, i) => (
                <div key={i} style={{
                  border: "1px solid #eee", borderRadius: 12, padding: "18px 20px",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  transition: "border-color 0.15s ease", cursor: "pointer",
                }} onMouseEnter={e => e.currentTarget.style.borderColor = "#ccc"}
                   onMouseLeave={e => e.currentTarget.style.borderColor = "#eee"}>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: "#111", marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#999", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {s.duration}
                    </div>
                    <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>£{s.price}</span>
                    <button style={{
                      background: "transparent", border: "1px solid #ddd", borderRadius: 8,
                      padding: "6px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", color: "#111",
                    }}>Book now</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Package highlight */}
            <div style={{
              marginTop: 14, background: "#111", borderRadius: 12, padding: "18px 22px",
              color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>UCAT Score Boost</span>
                  <span style={{
                    background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: 100,
                    fontSize: 11, fontWeight: 500, color: "#fff",
                  }}>SAVE £25</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#fff" }}>5 sessions · Diagnostic, all sections, full mock</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>£175</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "line-through", marginLeft: 6 }}>£200</span>
                </div>
                <button style={{
                  background: "#fff", border: "none", color: "#111", borderRadius: 8,
                  padding: "8px 18px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Book package</button>
              </div>
            </div>

            {/* Custom hourly */}
            <div style={{
              marginTop: 10, padding: "12px 20px", borderRadius: 10, border: "1px dashed #ddd",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#111" }}>Custom Hourly</span>
                <span style={{ fontSize: 13, color: "#999", marginLeft: 8 }}>£{coach.rate}/hr</span>
                <div style={{ fontSize: 12, color: "#999" }}>Get help with specific questions or topics</div>
              </div>
              <button style={{
                background: "transparent", border: "none", color: "#111", fontSize: 12.5,
                fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>Buy coaching →</button>
            </div>
          </div>

          <div style={{ height: 1, background: "#eee", margin: "24px 0" }} />

          {/* EXPERIENCE */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 16 }}>Experience</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {experience.map((exp, i) => (
                <div key={i} style={{ display: "flex", gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 10, background: "#f3f3f3",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, flexShrink: 0,
                  }}>{exp.logo}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{exp.role}</div>
                    <div style={{ fontSize: 13, color: "#111" }}>{exp.company}</div>
                    <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>{exp.period}</div>
                    <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{exp.desc}</div>
                    {exp.tags && (
                      <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                        {exp.tags.map(t => <Badge key={t}>{t}</Badge>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDUCATION */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 16 }}>Education</h2>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10, background: "#8B1A32",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>CAM</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{coach.uni}</div>
                <div style={{ fontSize: 13, color: "#555" }}>{coach.degree}</div>
                <div style={{ fontSize: 12, color: "#999" }}>{coach.gradYear}</div>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "#eee", margin: "24px 0" }} />

          {/* UCAT SCORE BREAKDOWN */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 16 }}>UCAT Score Breakdown</h2>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 10,
            }}>
              {[
                { section: "VR", score: 800, max: 900 },
                { section: "DM", score: 810, max: 900 },
                { section: "QR", score: 820, max: 900 },
                { section: "AR", score: 770, max: 900 },
                { section: "Total", score: 3200, max: 3600 },
              ].map((s, i) => (
                <div key={i} style={{
                  background: i === 4 ? "#111" : "#fafafa",
                  borderRadius: 10, padding: "14px 12px", textAlign: "center",
                  border: i === 4 ? "none" : "1px solid #eee",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: i === 4 ? "rgba(255,255,255,0.7)" : "#999", marginBottom: 6, letterSpacing: "0.04em" }}>{s.section}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: i === 4 ? "#fff" : "#111" }}>{s.score}</div>
                  <div style={{ fontSize: 10.5, color: i === 4 ? "rgba(255,255,255,0.5)" : "#ccc", marginTop: 2 }}>/ {s.max}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11 }}>🏆</span> SJT: Band 1
            </div>
          </div>

          <div style={{ height: 1, background: "#eee", margin: "24px 0" }} />

          {/* REVIEWS */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111", margin: "0 0 8px 0" }}>
                  {coach.reviewCount} Reviews
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#888" }}>Overall:</span>
                  <StarRating rating={coach.rating} size={14} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{coach.rating}</span>
                </div>
              </div>
            </div>

            {/* Rating breakdown */}
            <div style={{
              display: "flex", gap: 24, marginBottom: 20, padding: "14px 20px",
              background: "#fafafa", borderRadius: 10,
            }}>
              {Object.entries(reviewBreakdown).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11.5, color: "#999", marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Outcome badges row */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
              flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111" }}>Landed offers at</span>
              {["Cambridge", "Oxford", "UCL", "Bristol", "Edinburgh"].map(c => (
                <span key={c} style={{
                  fontSize: 11.5, background: "#f0f0f0", padding: "4px 10px",
                  borderRadius: 100, color: "#555", fontWeight: 500,
                }}>✓ {c}</span>
              ))}
            </div>

            {/* Review filter tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
              {["All", ...services.map(s => s.name)].map(f => (
                <button key={f} onClick={() => setActiveReviewFilter(f)} style={{
                  padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500,
                  border: activeReviewFilter === f ? "1.5px solid #111" : "1px solid #e0e0e0",
                  background: activeReviewFilter === f ? "#111" : "#fff",
                  color: activeReviewFilter === f ? "#fff" : "#666",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>{f}</button>
              ))}
            </div>

            {/* Review cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {filteredReviews.map((r, i) => (
                <div key={i} style={{
                  padding: "18px 0",
                  borderTop: i > 0 ? "1px solid #f0f0f0" : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{r.name}</span>
                      <span style={{ fontSize: 12, color: "#bbb", marginLeft: 8 }}>{r.time}</span>
                    </div>
                    <StarRating rating={r.rating} size={12} />
                  </div>
                  <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.6, margin: "0 0 10px 0" }}>{r.text}</p>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    {r.outcome && (
                      <span style={{
                        fontSize: 11.5, fontWeight: 600, color: "#111",
                        background: "#f0f0f0", padding: "3px 10px", borderRadius: 100,
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {r.outcome}
                      </span>
                    )}
                    {r.tags?.map(t => (
                      <span key={t} style={{ fontSize: 11, color: "#999", background: "#fafafa", padding: "3px 8px", borderRadius: 100 }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button style={{
              width: "100%", padding: "12px", borderRadius: 10, border: "1px solid #eee",
              background: "#fff", fontSize: 13, fontWeight: 600, color: "#111",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 8,
            }}>Load more reviews</button>
          </div>

          <div style={{ height: 1, background: "#eee", margin: "24px 0" }} />

          {/* SIMILAR COACHES */}
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 16 }}>Similar coaches</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {similarCoaches.map((c, i) => (
                <div key={i} style={{
                  border: "1px solid #eee", borderRadius: 12, padding: "16px",
                  cursor: "pointer", transition: "border-color 0.15s ease",
                }} onMouseEnter={e => e.currentTarget.style.borderColor = "#ccc"}
                   onMouseLeave={e => e.currentTarget.style.borderColor = "#eee"}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                    <Avatar initials={c.initials} size={36} />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{c.credential}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <StarRating rating={c.rating} size={10} />
                      <span style={{ fontSize: 12, color: "#888" }}>{c.rating} ({c.reviews})</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>£{c.rate}/hr</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {c.tags.map(t => <span key={t} style={{ fontSize: 11, background: "#f3f3f3", padding: "3px 8px", borderRadius: 100, color: "#666" }}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Booking CTA */}
            <div style={{
              border: "1px solid #eee", borderRadius: 14, padding: "22px",
              background: "#fff",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6, marginBottom: 16,
                fontSize: 13, color: "#22863a", fontWeight: 500,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22863a" }} />
                Available: {coach.nextAvailable}
              </div>

              <button style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: "#111", color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 8,
              }}>Schedule a free intro</button>

              <button style={{
                width: "100%", padding: "11px", borderRadius: 10,
                border: "1px solid #ddd", background: "#fff", color: "#111",
                fontSize: 13.5, fontWeight: 500, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}>Book a session</button>

              <div style={{
                marginTop: 16, padding: "12px", borderRadius: 10, background: "#fafafa",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>Protected by EarlyEdge</div>
                  <div style={{ fontSize: 11, color: "#999" }}>100% Guarantee</div>
                </div>
              </div>

              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Questions? Message {coach.name.split(" ")[0]} before you get started.</div>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6, background: "none",
                  border: "none", color: "#111", fontSize: 12.5, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Send a message
                </button>
              </div>
            </div>

            {/* Availability snapshot */}
            <div style={{
              border: "1px solid #eee", borderRadius: 14, padding: "18px 22px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Next available slots
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(showAllSlots ? availableSlots : availableSlots.slice(0, 3)).map((s, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px", borderRadius: 8, background: "#fafafa",
                    fontSize: 12.5,
                  }}>
                    <span style={{ color: "#555" }}>{s.day}</span>
                    <span style={{ fontWeight: 600, color: "#111" }}>{s.time}</span>
                  </div>
                ))}
              </div>
              {availableSlots.length > 3 && (
                <button onClick={() => setShowAllSlots(!showAllSlots)} style={{
                  background: "none", border: "none", color: "#111", fontSize: 12,
                  fontWeight: 600, cursor: "pointer", marginTop: 8, padding: 0,
                  fontFamily: "'DM Sans', sans-serif",
                }}>{showAllSlots ? "Show less" : `View all ${availableSlots.length} slots →`}</button>
              )}
            </div>

            {/* How it works */}
            <div style={{
              border: "1px solid #eee", borderRadius: 14, padding: "18px 22px",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#111", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>
                How it works
              </div>
              {[
                { num: "1", text: "Book a free 15-min intro" },
                { num: "2", text: "Choose sessions or a package" },
                { num: "3", text: "Meet on video call" },
              ].map((step, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "center",
                  marginBottom: i < 2 ? 10 : 0,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", background: "#111",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>{step.num}</div>
                  <span style={{ fontSize: 12.5, color: "#555" }}>{step.text}</span>
                </div>
              ))}
            </div>

            {/* Upcoming Event */}
            <div style={{
              borderRadius: 14, padding: "20px 22px",
              background: "#111", color: "#fff",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -40, right: -40, width: 120, height: 120,
                background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                <span style={{
                  background: "rgba(255,255,255,0.12)", padding: "3px 10px", borderRadius: 100,
                  fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                  color: "#fff",
                }}>
                  🔴 LIVE EVENT
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 5 }}>
                UCAT Strategy Workshop
              </div>
              <p style={{ fontSize: 12, color: "#fff", lineHeight: 1.5, margin: "0 0 14px 0" }}>
                Live group session covering the top scoring strategies for each UCAT section. Bring your questions!
              </p>
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#fff", marginBottom: 16 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Sat, Feb 15
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  3:00 PM
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>£5</span>
                  <span style={{ fontSize: 11, color: "#fff", marginLeft: 6 }}>18 spots left</span>
                </div>
                <button style={{
                  background: "#fff", border: "none", color: "#111", borderRadius: 8,
                  padding: "8px 18px", fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Register →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid #eee", padding: "48px", background: "#fafafa",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontStyle: "italic", color: "#111" }}>EarlyEdge</span>
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              {["𝕏", "in", "📷"].map((s, i) => (
                <span key={i} style={{
                  width: 30, height: 30, borderRadius: "50%", background: "#eee",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, cursor: "pointer", color: "#555",
                }}>{s}</span>
              ))}
            </div>
          </div>
          {[
            { title: "Welcome", links: ["Get started", "Log in", "Become a coach"] },
            { title: "Categories", links: ["Banking", "Consulting", "Law", "Oxbridge", "UCAT"] },
            { title: "Company", links: ["Careers", "Terms", "Privacy", "Support"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 12 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 13, color: "#888", marginBottom: 8, cursor: "pointer" }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 960, margin: "24px auto 0", paddingTop: 20, borderTop: "1px solid #eee", fontSize: 12, color: "#bbb" }}>
          © 2025 EarlyEdge. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
