import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Calendar, Shield, MessageSquare, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProfileCoach } from "@/data/coachStore";
import { getAllCoaches } from "@/data/sampleCoach";
import type { Coach } from "@/types/coach";

/* ─── Tiny reusable pieces ─────────────────────────────────── */

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center" style={{ gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(rating) ? "fill-foreground text-foreground" : "fill-none text-border"}
        />
      ))}
    </div>
  );
}

function AvatarCircle({ initials, size = 40, photo }: { initials: string; size?: number; photo?: string }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={initials}
        style={{ width: size, height: size }}
        className="rounded-full object-cover flex-shrink-0"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      className="rounded-full bg-foreground text-background flex items-center justify-center font-semibold flex-shrink-0 tracking-wide"
    >
      {initials}
    </div>
  );
}

function Badge({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${dark ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
        }`}
    >
      {children}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ─── Main Component ───────────────────────────────────────── */

const CoachProfile = () => {
  const { coachId } = useParams<{ coachId: string }>();
  const coach = getProfileCoach(coachId || "");

  if (!coach) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-[1100px] mx-auto px-6 py-16">
          <p className="text-center text-muted-foreground font-sans">Coach not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/dashboard/browse" className="hover:text-foreground transition-colors">Browse</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{coach.name}</span>
        </nav>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0">
            <HeroSection coach={coach} />
            <Divider />
            <AboutSection coach={coach} />
            <Divider />
            <ServicesSection coach={coach} />
            <Divider />
            <ExperienceSection coach={coach} />
            <EducationSection coach={coach} />
            {coach.ucatScores && (
              <>
                <Divider />
                <UCATScoreSection coach={coach} />
              </>
            )}
            <Divider />
            <ReviewsSection coach={coach} />
            <Divider />
            <SimilarCoachesSection currentCoachId={coach.id} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-4">
              <BookingSidebar coach={coach} />
              <AvailableSlots coach={coach} />
              <HowItWorks />
              {coach.upcomingEvent && <UpcomingEventCard event={coach.upcomingEvent} />}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3 flex gap-3 z-50">
        <button className="flex-1 py-3 rounded-lg bg-foreground text-background text-sm font-semibold">
          Schedule a free intro
        </button>
        <button className="flex-1 py-3 rounded-lg border border-border text-foreground text-sm font-medium">
          Book a session
        </button>
      </div>

      <Footer />
    </div>
  );
};

/* ─── Hero ─────────────────────────────────────────────────── */

function HeroSection({ coach }: { coach: Coach }) {
  return (
    <div className="flex gap-5 items-start">
      <AvatarCircle initials={getInitials(coach.name)} size={72} photo={coach.photo} />
      <div className="flex-1 min-w-0">
        {/* Name row */}
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{coach.name}</h1>
          <span className="bg-foreground text-background text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wider uppercase">
            VERIFIED
          </span>
          <div className="flex items-center gap-1.5 ml-1">
            <StarRating rating={coach.rating} size={12} />
            <span className="text-[13px] font-semibold text-foreground">{coach.rating}</span>
            <span className="text-xs text-muted-foreground">({coach.reviewCount})</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[15px] text-muted-foreground leading-snug mb-2">{coach.tagline}</p>

        {/* Stats */}
        <div className="flex gap-3 text-[13px] text-muted-foreground mb-3">
          <span>{coach.sessionsCompleted} sessions</span>
          <span>·</span>
          <span>{coach.followers} followers</span>
        </div>

        {/* Credential badges */}
        <div className="flex gap-2.5 flex-wrap mb-3">
          {coach.university && (
            <div className="flex items-center gap-2.5 bg-muted/60 rounded-lg px-3.5 py-2">
              {coach.university.logo && (
                <img src={coach.university.logo} alt="" className="w-7 h-7 object-contain rounded flex-shrink-0" />
              )}
              <span className="text-[13px] text-muted-foreground">
                Studied at <strong className="text-foreground">{coach.university.name.replace("University of ", "")}</strong>
              </span>
            </div>
          )}
          {coach.company && (
            <div className="flex items-center gap-2.5 bg-muted/60 rounded-lg px-3.5 py-2">
              {coach.company.logo && (
                <img src={coach.company.logo} alt="" className="w-7 h-7 object-contain rounded flex-shrink-0" />
              )}
              <span className="text-[13px]">
                <strong className="text-foreground">{coach.company.role}</strong>
                <span className="text-muted-foreground"> at {coach.company.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Success companies */}
        {coach.successCompanies && coach.successCompanies.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-semibold text-foreground">Landed offers at</span>
            <div className="flex gap-1.5">
              {coach.successCompanies.map((c) => (
                <div
                  key={c.name}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden"
                  title={c.name}
                >
                  {c.logo ? (
                    <img src={c.logo} alt={c.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <span className="text-[8px] font-bold text-muted-foreground">{c.name.slice(0, 2)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Landed offer labels (for coaches without logo data) */}
        {coach.landedOfferLabels && coach.landedOfferLabels.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <span className="text-xs font-semibold text-foreground">Landed offers at</span>
            {coach.landedOfferLabels.map((label) => (
              <span key={label} className="text-[11px] bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-medium">
                ✓ {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── About ────────────────────────────────────────────────── */

function AboutSection({ coach }: { coach: Coach }) {
  const [expanded, setExpanded] = useState(false);
  const bioPreview = coach.bio.length > 280 ? coach.bio.substring(0, 280) + "..." : coach.bio;

  return (
    <div className="mb-2">
      <h2 className="text-[17px] font-bold text-foreground mb-3">About {coach.name.split(" ")[0]}</h2>
      <div className="text-[14px] text-muted-foreground leading-relaxed whitespace-pre-line">
        {expanded ? coach.bio : bioPreview}
        {coach.bio.length > 280 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-foreground font-semibold text-[13.5px] hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
      <div className="mt-4">
        <div className="text-xs text-muted-foreground font-medium mb-2">Can help with:</div>
        <div className="flex gap-1.5 flex-wrap">
          {coach.skills.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Services ─────────────────────────────────────────────── */

function ServicesSection({ coach }: { coach: Coach }) {
  return (
    <div className="mb-2">
      <h2 className="text-[17px] font-bold text-foreground mb-4">Coaching Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {coach.services.map((s, i) => (
          <div
            key={i}
            className="border border-border rounded-xl p-5 flex flex-col justify-between hover:border-muted-foreground/40 transition-colors cursor-pointer"
          >
            <div>
              <div className="text-[14.5px] font-semibold text-foreground mb-1">{s.name}</div>
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {s.duration}
              </div>
              <p className="text-[13px] text-muted-foreground leading-snug">{s.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-base font-bold text-foreground">£{s.price}</span>
              <button className="px-4 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                Book now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Package highlight */}
      {coach.package && (
        <div className="mt-4 bg-foreground rounded-xl px-6 py-5 text-background flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[14.5px] font-semibold">{coach.package.name}</span>
              <span className="bg-white/15 text-[11px] font-medium px-2 py-0.5 rounded-full">
                SAVE £{coach.package.originalPrice - coach.package.price}
              </span>
            </div>
            <div className="text-xs text-background/80">{coach.package.sessions} sessions · {coach.package.includes}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-lg font-bold">£{coach.package.price}</span>
              <span className="text-xs text-background/40 line-through ml-1.5">£{coach.package.originalPrice}</span>
            </div>
            <button className="bg-background text-foreground rounded-lg px-5 py-2 text-xs font-semibold hover:bg-background/90 transition-colors">
              Book package
            </button>
          </div>
        </div>
      )}

      {/* Custom hourly */}
      <div className="mt-3 px-5 py-3 rounded-xl border border-dashed border-border flex justify-between items-center">
        <div>
          <span className="text-[13.5px] font-semibold text-foreground">Custom Hourly</span>
          <span className="text-[13px] text-muted-foreground ml-2">£{coach.hourlyRate}/hr</span>
          <div className="text-xs text-muted-foreground">Get help with specific questions or topics</div>
        </div>
        <button className="text-foreground text-xs font-semibold hover:underline">Buy coaching →</button>
      </div>
    </div>
  );
}

/* ─── Experience ───────────────────────────────────────────── */

function ExperienceSection({ coach }: { coach: Coach }) {
  return (
    <div className="mb-7">
      <h2 className="text-[17px] font-bold text-foreground mb-4">Experience</h2>
      <div className="flex flex-col gap-5">
        {coach.experience.map((exp, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
              {exp.logo ? (
                <img src={exp.logo} alt={exp.company} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">{exp.company.slice(0, 2)}</span>
              )}
            </div>
            <div>
              <div className="text-[14px] font-semibold text-foreground">{exp.role}</div>
              <div className="text-[13px] text-foreground">{exp.company}</div>
              <div className="text-xs text-muted-foreground mb-1">{exp.dates}</div>
              {exp.description && (
                <div className="text-[13px] text-muted-foreground leading-snug">{exp.description}</div>
              )}
              {exp.skills && exp.skills.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {exp.skills.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Education ────────────────────────────────────────────── */

function EducationSection({ coach }: { coach: Coach }) {
  return (
    <div className="mb-2">
      <h2 className="text-[17px] font-bold text-foreground mb-4">Education</h2>
      <div className="flex flex-col gap-4">
        {coach.education.map((edu, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
              {edu.logo ? (
                <img src={edu.logo} alt={edu.institution} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">{edu.institution.slice(0, 3)}</span>
              )}
            </div>
            <div>
              <div className="text-[14px] font-semibold text-foreground">{edu.institution}</div>
              <div className="text-[13px] text-muted-foreground">{edu.degree}</div>
              <div className="text-xs text-muted-foreground">{edu.years}</div>
              {edu.achievement && (
                <div className="text-xs text-muted-foreground mt-0.5">{edu.achievement}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── UCAT Score Breakdown ─────────────────────────────────── */

function UCATScoreSection({ coach }: { coach: Coach }) {
  if (!coach.ucatScores) return null;
  return (
    <div className="mb-2">
      <h2 className="text-[17px] font-bold text-foreground mb-4">UCAT Score Breakdown</h2>
      <div className="grid grid-cols-5 gap-2.5">
        {coach.ucatScores.map((s, i) => {
          const isTotal = i === coach.ucatScores!.length - 1;
          return (
            <div
              key={i}
              className={`rounded-xl px-3 py-4 text-center ${isTotal ? "bg-foreground text-background" : "bg-muted/50 border border-border"
                }`}
            >
              <div className={`text-[11px] font-semibold mb-1.5 tracking-wider ${isTotal ? "text-background/70" : "text-muted-foreground"}`}>
                {s.section}
              </div>
              <div className={`text-xl font-bold ${isTotal ? "text-background" : "text-foreground"}`}>{s.score}</div>
              <div className={`text-[10.5px] mt-0.5 ${isTotal ? "text-background/50" : "text-muted-foreground/50"}`}>
                / {s.max}
              </div>
            </div>
          );
        })}
      </div>
      {coach.ucatSJTBand && (
        <div className="text-xs text-muted-foreground mt-2.5 flex items-center gap-1.5">
          🏆 SJT: Band {coach.ucatSJTBand}
        </div>
      )}
    </div>
  );
}

/* ─── Reviews ──────────────────────────────────────────────── */

function ReviewsSection({ coach }: { coach: Coach }) {
  const [filter, setFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const serviceNames = coach.services.map((s) => s.name);
  const filterTabs = ["All", ...serviceNames];

  // Reviews don't have tags in the current data model, so "All" shows everything
  const displayReviews = showAll ? coach.reviews : coach.reviews.slice(0, 4);

  return (
    <div className="mb-2">
      <div className="mb-5">
        <h2 className="text-[17px] font-bold text-foreground mb-2">{coach.reviewCount} Reviews</h2>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-muted-foreground">Overall:</span>
          <StarRating rating={coach.rating} size={14} />
          <span className="text-[15px] font-bold text-foreground">{coach.rating}</span>
        </div>
      </div>

      {/* Rating breakdown */}
      <div className="flex gap-6 mb-5 px-5 py-3.5 bg-muted/40 rounded-xl">
        {Object.entries(coach.ratings).map(([k, v]) => (
          <div key={k}>
            <div className="text-[11.5px] text-muted-foreground mb-0.5 capitalize">{k}</div>
            <div className="text-base font-bold text-foreground">{v}</div>
          </div>
        ))}
      </div>

      {/* Outcome badges */}
      {coach.successCompanies && coach.successCompanies.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs font-semibold text-foreground">Successful clients at</span>
          {coach.successCompanies.map((c) => (
            <span key={c.name} className="text-[11.5px] bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-medium">
              ✓ {c.name}
            </span>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {filterTabs.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f
              ? "bg-foreground text-background border border-foreground"
              : "bg-background text-muted-foreground border border-border hover:border-muted-foreground/40"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Review cards */}
      <div className="flex flex-col">
        {displayReviews.map((r, i) => (
          <div key={i} className={`py-5 ${i > 0 ? "border-t border-border/50" : ""}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[14px] font-semibold text-foreground">{r.name}</span>
                <span className="text-xs text-muted-foreground/60 ml-2">{r.date}</span>
              </div>
              <StarRating rating={r.rating} size={12} />
            </div>
            <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-2.5">{r.text}</p>
            {r.outcome && (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-foreground bg-muted px-2.5 py-1 rounded-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {r.outcome}
              </span>
            )}
          </div>
        ))}
      </div>

      {coach.reviews.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 rounded-xl border border-border text-[13px] font-semibold text-foreground hover:bg-muted/50 transition-colors mt-2"
        >
          {showAll ? "Show fewer reviews" : "Load more reviews"}
        </button>
      )}
    </div>
  );
}

/* ─── Similar Coaches ──────────────────────────────────────── */

function SimilarCoachesSection({ currentCoachId }: { currentCoachId: string }) {
  const allCoaches = getAllCoaches();
  const similar = allCoaches.filter((c) => c.id !== currentCoachId).slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div>
      <h2 className="text-[17px] font-bold text-foreground mb-4">Similar coaches</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {similar.map((c) => (
          <Link
            key={c.id}
            to={`/coach/${c.id}`}
            className="border border-border rounded-xl p-4 hover:border-muted-foreground/40 transition-colors block"
          >
            <div className="flex gap-2.5 items-center mb-2.5">
              <AvatarCircle initials={getInitials(c.name)} size={36} photo={c.photo} />
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold text-foreground truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate">{c.company?.role} at {c.company?.name}</div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <StarRating rating={c.rating} size={10} />
                <span className="text-xs text-muted-foreground">{c.rating} ({c.reviewCount})</span>
              </div>
              <span className="text-[13px] font-semibold text-foreground">£{c.hourlyRate}/hr</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {c.skills.slice(0, 2).map((s) => (
                <span key={s} className="text-[11px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Sidebar Components ───────────────────────────────────── */

function BookingSidebar({ coach }: { coach: Coach }) {
  return (
    <div className="border border-border rounded-2xl p-6 bg-background">
      {/* Availability indicator */}
      <div className="flex items-center gap-2 mb-4 text-[13px] text-green-600 font-medium">
        <span className="w-2 h-2 rounded-full bg-green-600" />
        Available: {coach.availability.nextSlot}
      </div>

      <button className="w-full py-3 rounded-xl bg-foreground text-background text-[14px] font-semibold mb-2 hover:opacity-90 transition-opacity">
        Schedule a free intro
      </button>
      <button className="w-full py-3 rounded-xl border border-border text-foreground text-[13.5px] font-medium hover:bg-muted transition-colors">
        Book a session
      </button>

      {/* Protected badge */}
      <div className="mt-4 p-3 rounded-xl bg-muted/40 flex items-center gap-2.5">
        <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div>
          <div className="text-xs font-semibold text-foreground">Protected by EarlyEdge</div>
          <div className="text-[11px] text-muted-foreground">100% Guarantee</div>
        </div>
      </div>

      {/* Message */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground mb-1.5">
          Questions? Message {coach.name.split(" ")[0]} before you get started.
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:underline">
          <MessageSquare className="w-3.5 h-3.5" />
          Send a message
        </button>
      </div>
    </div>
  );
}

function AvailableSlots({ coach }: { coach: Coach }) {
  const [showAll, setShowAll] = useState(false);
  const slots = coach.availableSlots || [
    { day: "Today", time: coach.availability.nextSlot.replace(/^(Today|Tomorrow) /, "") },
  ];
  const displaySlots = showAll ? slots : slots.slice(0, 3);

  return (
    <div className="border border-border rounded-2xl px-6 py-5">
      <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
        Next available slots
      </div>
      <div className="flex flex-col gap-1.5">
        {displaySlots.map((s, i) => (
          <div key={i} className="flex justify-between items-center px-3 py-2 rounded-lg bg-muted/40 text-xs">
            <span className="text-muted-foreground">{s.day}</span>
            <span className="font-semibold text-foreground">{s.time}</span>
          </div>
        ))}
      </div>
      {slots.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-semibold text-foreground mt-2 hover:underline"
        >
          {showAll ? "Show less" : `View all ${slots.length} slots →`}
        </button>
      )}
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { num: "1", text: "Book a free 15-min intro" },
    { num: "2", text: "Choose sessions or a package" },
    { num: "3", text: "Meet on video call" },
  ];

  return (
    <div className="border border-border rounded-2xl px-6 py-5">
      <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3.5">
        How it works
      </div>
      {steps.map((step, i) => (
        <div key={i} className={`flex gap-3 items-center ${i < 2 ? "mb-2.5" : ""}`}>
          <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            {step.num}
          </div>
          <span className="text-xs text-muted-foreground">{step.text}</span>
        </div>
      ))}
    </div>
  );
}

function UpcomingEventCard({ event }: { event: NonNullable<Coach["upcomingEvent"]> }) {
  return (
    <div className="rounded-2xl px-6 py-5 bg-foreground text-background relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)]" />
      <div className="flex items-center gap-1.5 mb-3.5">
        <span className="bg-white/12 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wider uppercase">
          🔴 LIVE EVENT
        </span>
      </div>
      <div className="text-[15px] font-bold mb-1.5">{event.title}</div>
      <p className="text-xs text-background/80 leading-snug mb-3.5">{event.description}</p>
      <div className="flex gap-3.5 text-xs mb-4">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {event.date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {event.time}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[15px] font-bold">{event.price}</span>
          <span className="text-[11px] ml-1.5">{event.spotsLeft} spots left</span>
        </div>
        <button className="bg-background text-foreground rounded-lg px-4 py-2 text-xs font-bold hover:bg-background/90 transition-colors">
          Register →
        </button>
      </div>
    </div>
  );
}

/* ─── Divider ──────────────────────────────────────────────── */

function Divider() {
  return <div className="h-px bg-border my-6" />;
}

export default CoachProfile;
