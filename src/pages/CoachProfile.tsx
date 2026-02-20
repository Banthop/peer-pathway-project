import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Calendar, Shield, MessageSquare, ChevronRight } from "lucide-react";
import { MessageModal } from "@/components/MessageModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/coach/booking/BookingDialog";
import { getProfileCoach } from "@/data/coachStore";
import { getAllCoaches } from "@/data/sampleCoach";
import type { Coach, CoachService } from "@/types/coach";
import type { BookingType, SelectedService } from "@/types/booking";

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
      className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${dark ? "bg-foreground text-background" : "bg-background text-foreground/80 border border-border"
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

/** Map a company/university name to a domain for Clearbit Logo API */
const domainMap: Record<string, string> = {
  "Goldman Sachs": "goldmansachsbdc.com",
  "JP Morgan": "jpmorganchasecc.com",
  "J.P. Morgan": "jpmorgan.com",
  "Morgan Stanley": "morganstanley.com",
  "Citi": "citi.com",
  "Barclays": "barclays.com",
  "McKinsey": "mckinsey.com",
  "BCG": "bcg.com",
  "Bain": "bain.com",
  "Google": "google.com",
  "Meta": "meta.com",
  "Apple": "apple.com",
  "Amazon": "amazon.com",
  "Microsoft": "microsoft.com",
  "Deloitte": "deloitte.com",
  "PwC": "pwc.com",
  "EY": "ey.com",
  "KPMG": "kpmg.com",
  "Clifford Chance": "cliffordchance.com",
  "Linklaters": "linklaters.com",
  "Allen & Overy": "allenovery.com",
  "Freshfields": "freshfields.com",
  "Slaughter and May": "slaughterandmay.com",
  "University of Oxford": "ox.ac.uk",
  "Oxford": "ox.ac.uk",
  "University of Cambridge": "cam.ac.uk",
  "Cambridge": "cam.ac.uk",
  "UCL": "ucl.ac.uk",
  "Imperial College London": "imperial.ac.uk",
  "Imperial": "imperial.ac.uk",
  "LSE": "lse.ac.uk",
  "London School of Economics": "lse.ac.uk",
  "King's College London": "kcl.ac.uk",
  "University of Edinburgh": "ed.ac.uk",
  "University of Warwick": "warwick.ac.uk",
  "University of Bristol": "bristol.ac.uk",
  "Durham University": "durham.ac.uk",
  "University of St Andrews": "st-andrews.ac.uk",
  "University of Manchester": "manchester.ac.uk",
  "University of Birmingham": "birmingham.ac.uk",
  "University of Nottingham": "nottingham.ac.uk",
  "University of Leeds": "leeds.ac.uk",
};

function getLogoUrl(name: string, size = 128): string | null {
  const domain = domainMap[name];
  const d = domain || (name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com");
  return `https://img.logo.dev/${d}?token=pk_Z3IZl0C_TzO4RqLGSGD5LQ&size=${size}&format=png`;
}

/** Build srcSet string for responsive logo loading at multiple densities */
function getLogoSrcSet(name: string, displaySize: number): string | null {
  const domain = domainMap[name];
  const d = domain || (name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com");
  const base = `https://img.logo.dev/${d}?token=pk_Z3IZl0C_TzO4RqLGSGD5LQ&format=png`;
  return `${base}&size=${displaySize} 1x, ${base}&size=${displaySize * 2} 2x, ${base}&size=${displaySize * 3} 3x`;
}

/** Img with Clearbit fallback and error handling */
function LogoImg({
  src,
  fallbackName,
  alt,
  className,
}: {
  src?: string;
  fallbackName: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  const [clearbitErrored, setClearbitErrored] = useState(false);

  const clearbitUrl = getLogoUrl(fallbackName);

  // Has a real logo that hasn't errored
  if (src && !errored) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setErrored(true)}
      />
    );
  }

  // Try clearbit fallback
  if (clearbitUrl && !clearbitErrored) {
    return (
      <img
        src={clearbitUrl}
        alt={alt}
        className={className}
        onError={() => setClearbitErrored(true)}
      />
    );
  }

  // No logo at all — return null so parent can show text fallback
  return null;
}

/** Self-contained org logo: tries src → Logo.dev → text initials */
function OrgLogo({
  src,
  name,
  size = 44,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  const [srcErrored, setSrcErrored] = useState(false);
  const [fallbackErrored, setFallbackErrored] = useState(false);
  const fallbackUrl = getLogoUrl(name, size);
  const fallbackSrcSet = getLogoSrcSet(name, size);
  const imgSize = Math.round(size * 0.85);

  return (
    <div
      className="rounded-xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {src && !srcErrored ? (
        <img src={src} alt={name} style={{ width: imgSize, height: imgSize }} className="object-contain" onError={() => setSrcErrored(true)} />
      ) : fallbackUrl && !fallbackErrored ? (
        <img src={fallbackUrl} srcSet={fallbackSrcSet || undefined} alt={name} style={{ width: imgSize, height: imgSize }} className="object-contain" onError={() => setFallbackErrored(true)} />
      ) : (
        <span className="text-xs font-bold text-foreground/30">{getInitials(name)}</span>
      )}
    </div>
  );
}

/** Company pill: logo + name in a bordered pill */
function CompanyPill({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5">
      <LogoImg
        src={logo}
        fallbackName={name}
        alt={name}
        className="w-5 h-5 object-contain flex-shrink-0"
      />
      <span className="text-[12px] font-medium text-foreground/80">{name}</span>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

function serviceToSelected(s: CoachService): SelectedService {
  return { name: s.name, duration: s.duration, price: s.price, description: s.description };
}

function parseDayToDate(day: string): Date | undefined {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (day === "Today") return today;
  if (day === "Tomorrow") {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }
  return undefined;
}

const CoachProfile = () => {
  const { coachId } = useParams<{ coachId: string }>();
  const coach = getProfileCoach(coachId || "");

  // Booking dialog state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>("free-intro");
  const [initialService, setInitialService] = useState<SelectedService | undefined>();
  const [initialDate, setInitialDate] = useState<Date | undefined>();
  const [initialTime, setInitialTime] = useState<string | undefined>();
  const [messageOpen, setMessageOpen] = useState(false);

  const openBooking = (
    type: BookingType,
    service?: SelectedService,
    date?: Date,
    time?: string,
  ) => {
    setBookingType(type);
    setInitialService(service);
    setInitialDate(date);
    setInitialTime(time);
    setBookingOpen(true);
  };

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
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-12">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-sm text-muted-foreground">
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
            <ServicesSection coach={coach} onBook={openBooking} />
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
              <BookingSidebar coach={coach} onBook={openBooking} onMessage={() => setMessageOpen(true)} />
              <AvailableSlots coach={coach} coachId={coach.id} onSlotClick={(day, time) => {
                openBooking("session", undefined, parseDayToDate(day), time);
              }} />
              <HowItWorks />
              {coach.upcomingEvent && <UpcomingEventCard event={coach.upcomingEvent} />}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3.5 flex gap-3 z-50">
        <button
          onClick={() => openBooking("free-intro")}
          className="flex-1 py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
        >
          Schedule a free intro
        </button>
        <button
          onClick={() => openBooking("session")}
          className="flex-1 py-3 rounded-xl border border-foreground/20 text-foreground text-sm font-medium hover:bg-foreground hover:text-background transition-all duration-200"
        >
          Book a session
        </button>
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        coach={coach}
        type={bookingType}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialService={initialService}
        initialDate={initialDate}
        initialTime={initialTime}
      />

      {/* Message Modal */}
      <MessageModal
        open={messageOpen}
        onOpenChange={setMessageOpen}
        coachName={coach.name}
      />

      <Footer />
    </div>
  );
};

/* ─── Hero ─────────────────────────────────────────────────── */

function HeroSection({ coach }: { coach: Coach }) {
  return (
    <div className="flex gap-6 items-start">
      <AvatarCircle initials={getInitials(coach.name)} size={80} photo={coach.photo} />
      <div className="flex-1 min-w-0">
        {/* Name row */}
        <div className="flex items-center gap-3 flex-wrap mb-1.5">
          <h1 className="text-[26px] font-bold tracking-tight text-foreground">{coach.name}</h1>
          <span className="bg-foreground text-background text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
            VERIFIED
          </span>
          <div className="flex items-center gap-1.5 ml-1">
            <StarRating rating={coach.rating} size={13} />
            <span className="text-[14px] font-bold text-foreground">{coach.rating}</span>
            <span className="text-xs text-muted-foreground">({coach.reviewCount})</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[15px] text-foreground/80 font-light leading-snug mb-2.5">{coach.tagline}</p>

        {/* Stats */}
        <div className="flex gap-3 text-[13px] text-foreground/60 font-light mb-4">
          <span>{coach.sessionsCompleted} sessions</span>
          <span>·</span>
          <span>{coach.followers} followers</span>
        </div>

        {/* Credential badges */}
        <div className="flex gap-3 flex-wrap mb-4">
          {coach.university && (
            <div className="flex items-center gap-3 bg-background border border-border rounded-lg px-4 py-2.5 hover:border-foreground/25 hover:shadow-sm transition-all duration-200">
              {coach.university.logo && (
                <div className="w-10 h-10 rounded-md bg-white border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={coach.university.logo} alt="" className="w-10 h-10 object-cover" />
                </div>
              )}
              <span className="text-[13.5px] font-light text-foreground/70">
                Studied at <strong className="text-foreground font-semibold">{coach.university.name.replace("University of ", "")}</strong>
              </span>
            </div>
          )}
          {coach.company && (
            <div className="flex items-center gap-3 bg-background border border-border rounded-lg px-4 py-2.5 hover:border-foreground/25 hover:shadow-sm transition-all duration-200">
              {coach.company.logo && (
                <div className="w-10 h-10 rounded-md bg-white border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={coach.company.logo} alt="" className="w-10 h-10 object-cover" />
                </div>
              )}
              <span className="text-[13.5px] font-light">
                <strong className="text-foreground font-semibold">{coach.company.role}</strong>
                <span className="text-foreground/70"> at {coach.company.name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Success companies — overlapping logo stack */}
        {coach.successCompanies && coach.successCompanies.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-light text-foreground/60">
              {coach.successCompanies.length === 1 ? "Landed an Offer at" : "Landed Offers at"}
            </span>
            <div className="flex items-center">
              {coach.successCompanies.map((c, i) => (
                <div
                  key={c.name}
                  className="relative group"
                  style={{ marginLeft: i === 0 ? 0 : -10, zIndex: coach.successCompanies!.length - i }}
                >
                  {/* Small overlapping logo */}
                  <div className="w-9 h-9 rounded-md overflow-hidden cursor-pointer transition-transform duration-200 group-hover:scale-110 group-hover:z-50 group-hover:shadow-lg">
                    <img
                      src={c.logo || getLogoUrl(c.name, 36) || ""}
                      srcSet={getLogoSrcSet(c.name, 36) || undefined}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Hover pop-out: larger logo + name */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[100] flex flex-col items-center gap-1.5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-xl border border-gray-100">
                      <img
                        src={c.logo || getLogoUrl(c.name, 64) || ""}
                        srcSet={getLogoSrcSet(c.name, 64) || undefined}
                        alt={c.name}
                        className="w-full h-full object-contain p-1.5"
                      />
                    </div>
                    <span className="px-2.5 py-1 bg-foreground text-background text-[10px] font-medium rounded-md whitespace-nowrap">
                      {c.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Landed offer labels (for coaches without logo data) */}
        {coach.landedOfferLabels && coach.landedOfferLabels.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-3">
            <span className="text-[12px] font-light text-foreground/60">
              {coach.landedOfferLabels.length === 1 ? "Landed an Offer at" : "Landed Offers at"}
            </span>
            {coach.landedOfferLabels.map((label) => (
              <span key={label} className="text-[11px] bg-background border border-border px-2.5 py-1 rounded-full text-foreground/80 font-medium">
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
      <h2 className="text-[18px] font-bold text-foreground mb-3">About {coach.name.split(" ")[0]}</h2>
      <div className="text-[14px] text-foreground/70 font-light leading-relaxed whitespace-pre-line">
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
      <div className="mt-5">
        <div className="text-[11px] text-foreground/50 font-medium uppercase tracking-wider mb-2.5">Can help with</div>
        <div className="flex gap-2 flex-wrap">
          {coach.skills.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Services ─────────────────────────────────────────────── */

function ServicesSection({ coach, onBook }: { coach: Coach; onBook: (type: BookingType, service?: SelectedService) => void }) {
  return (
    <div className="mb-2">
      <h2 className="text-[18px] font-bold text-foreground mb-5">Coaching Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coach.services.map((s, i) => (
          <div
            key={i}
            className="border border-border rounded-xl p-5 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/20 transition-all duration-200 cursor-pointer"
          >
            <div>
              <div className="text-[15px] font-semibold text-foreground mb-1">{s.name}</div>
              <div className="text-xs text-foreground/40 mb-2.5 flex items-center gap-1.5 font-light">
                <Clock className="w-3 h-3" />
                {s.duration}
              </div>
              <p className="text-[13px] text-foreground/60 font-light leading-relaxed">{s.description}</p>
            </div>
            <div className="flex justify-between items-center mt-5 pt-4 border-t border-border/50">
              <span className="text-[17px] font-bold text-foreground">£{s.price}</span>
              <button
                onClick={() => onBook("session", serviceToSelected(s))}
                className="px-5 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors"
              >
                Book now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Package highlight */}
      {coach.package && (
        <div className="mt-5 bg-foreground rounded-xl px-6 py-5 text-background flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-[15px] font-semibold">{coach.package.name}</span>
              <span className="bg-white/15 text-[11px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide">
                SAVE £{coach.package.originalPrice - coach.package.price}
              </span>
            </div>
            <div className="text-[13px] text-background/70 font-light">{coach.package.sessions} sessions · {coach.package.includes}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xl font-bold">£{coach.package.price}</span>
              <span className="text-xs text-background/40 line-through ml-2">£{coach.package.originalPrice}</span>
            </div>
            <button
              onClick={() => onBook("session", {
                name: coach.package!.name,
                duration: `${coach.package!.sessions} sessions`,
                price: coach.package!.price,
                description: coach.package!.includes,
              })}
              className="bg-background text-foreground rounded-lg px-5 py-2.5 text-xs font-semibold hover:bg-background/90 transition-colors"
            >
              Book package
            </button>
          </div>
        </div>
      )}

      {/* Custom hourly */}
      <div className="mt-4 px-5 py-3.5 rounded-xl border border-dashed border-foreground/20 flex justify-between items-center">
        <div>
          <span className="text-[14px] font-semibold text-foreground">Custom Hourly</span>
          <span className="text-[13px] text-foreground/50 font-light ml-2">£{coach.hourlyRate}/hr</span>
          <div className="text-[12px] text-foreground/40 font-light mt-0.5">Get help with specific questions or topics</div>
        </div>
        <button
          onClick={() => onBook("session", {
            name: "Custom Hourly",
            duration: "60 min",
            price: coach.hourlyRate,
            description: "Flexible time for specific questions or topics",
          })}
          className="text-foreground text-xs font-semibold hover:underline"
        >
          Buy coaching →
        </button>
      </div>
    </div>
  );
}

/* ─── Experience ───────────────────────────────────────────── */

function ExperienceSection({ coach }: { coach: Coach }) {
  return (
    <div className="mb-8">
      <h2 className="text-[18px] font-bold text-foreground mb-5">Experience</h2>
      <div className="flex flex-col gap-6">
        {coach.experience.map((exp, i) => (
          <div key={i} className="flex gap-4">
            <OrgLogo src={exp.logo} name={exp.company} size={48} />
            <div>
              <div className="text-[14px] font-semibold text-foreground">{exp.role}</div>
              <div className="text-[13px] font-medium text-foreground/70">{exp.company}</div>
              <div className="text-[12px] text-foreground/40 mb-1">{exp.dates}</div>
              {exp.description && (
                <div className="text-[13px] text-foreground/60 font-light leading-relaxed">{exp.description}</div>
              )}
              {exp.skills && exp.skills.length > 0 && (
                <div className="flex gap-2 mt-2.5 flex-wrap">
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
      <h2 className="text-[18px] font-bold text-foreground mb-5">Education</h2>
      <div className="flex flex-col gap-5">
        {coach.education.map((edu, i) => (
          <div key={i} className="flex gap-4">
            <OrgLogo src={edu.logo} name={edu.institution} size={48} />
            <div>
              <div className="text-[14px] font-semibold text-foreground">{edu.institution}</div>
              <div className="text-[13px] font-medium text-foreground/70">{edu.degree}</div>
              <div className="text-[12px] text-foreground/40">{edu.years}</div>
              {edu.achievement && (
                <div className="text-[12px] text-foreground/50 mt-0.5">{edu.achievement}</div>
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
      <h2 className="text-[18px] font-bold text-foreground mb-5">UCAT Score Breakdown</h2>
      <div className="grid grid-cols-5 gap-3">
        {coach.ucatScores.map((s, i) => {
          const isTotal = i === coach.ucatScores!.length - 1;
          return (
            <div
              key={i}
              className={`rounded-xl px-3 py-4 text-center ${isTotal ? "bg-foreground text-background shadow-lg" : "bg-background border border-border"
                }`}
            >
              <div className={`text-[10px] font-semibold mb-1.5 tracking-wider uppercase ${isTotal ? "text-background/60" : "text-foreground/40"}`}>
                {s.section}
              </div>
              <div className={`text-xl font-bold ${isTotal ? "text-background" : "text-foreground"}`}>{s.score}</div>
              <div className={`text-[10.5px] font-light mt-0.5 ${isTotal ? "text-background/40" : "text-foreground/30"}`}>
                / {s.max}
              </div>
            </div>
          );
        })}
      </div>
      {coach.ucatSJTBand && (
        <div className="text-xs text-foreground/50 font-light mt-3 flex items-center gap-1.5">
          SJT: Band {coach.ucatSJTBand}
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
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-foreground mb-2">{coach.reviewCount} Reviews</h2>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-foreground/50 font-light">Overall:</span>
          <StarRating rating={coach.rating} size={14} />
          <span className="text-[15px] font-bold text-foreground">{coach.rating}</span>
        </div>
      </div>

      {/* Rating breakdown */}
      <div className="flex gap-6 mb-6 px-5 py-4 bg-background border border-border rounded-xl">
        {Object.entries(coach.ratings).map(([k, v]) => (
          <div key={k}>
            <div className="text-[11px] text-foreground/40 font-light mb-0.5 capitalize">{k}</div>
            <div className="text-base font-bold text-foreground">{v}</div>
          </div>
        ))}
      </div>

      {/* Outcome badges — overlapping logo stack */}
      {coach.successCompanies && coach.successCompanies.length > 0 && (
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[12px] font-light text-foreground/60">
            {coach.successCompanies.length === 1 ? "Landed an Offer at" : "Landed Offers at"}
          </span>
          <div className="flex items-center">
            {coach.successCompanies.map((c, i) => (
              <div
                key={c.name}
                className="relative group"
                style={{ marginLeft: i === 0 ? 0 : -10, zIndex: coach.successCompanies!.length - i }}
              >
                {/* Small overlapping logo */}
                <div className="w-9 h-9 rounded-md overflow-hidden cursor-pointer transition-transform duration-200 group-hover:scale-110 group-hover:z-50 group-hover:shadow-lg">
                  <img
                    src={c.logo || getLogoUrl(c.name, 36) || ""}
                    srcSet={getLogoSrcSet(c.name, 36) || undefined}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Hover pop-out: larger logo + name */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[100] flex flex-col items-center gap-1.5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-xl border border-gray-100">
                    <img
                      src={c.logo || getLogoUrl(c.name, 64) || ""}
                      srcSet={getLogoSrcSet(c.name, 64) || undefined}
                      alt={c.name}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </div>
                  <span className="px-2.5 py-1 bg-foreground text-background text-[10px] font-medium rounded-md whitespace-nowrap">
                    {c.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filterTabs.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${filter === f
              ? "bg-foreground text-background border border-foreground"
              : "bg-background text-foreground/60 border border-border hover:border-foreground/30"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Review cards */}
      <div className="flex flex-col">
        {displayReviews.map((r, i) => (
          <div key={i} className={`py-5 ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[14px] font-semibold text-foreground">{r.name}</span>
                <span className="text-xs text-foreground/30 font-light ml-2">{r.date}</span>
              </div>
              <StarRating rating={r.rating} size={12} />
            </div>
            <p className="text-[13.5px] text-foreground/60 font-light leading-relaxed mb-2.5">{r.text}</p>
            {r.outcome && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground bg-background border border-foreground px-2.5 py-1 rounded-full">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {r.outcome}
              </span>
            )}
          </div>
        ))}
      </div>

      {
        coach.reviews.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 rounded-xl border border-foreground/20 text-[13px] font-semibold text-foreground hover:bg-foreground hover:text-background transition-all duration-200 mt-3"
          >
            {showAll ? "Show fewer reviews" : "Load more reviews"}
          </button>
        )
      }
    </div >
  );
}

/* ─── Similar Coaches ──────────────────────────────────────── */

function SimilarCoachesSection({ currentCoachId }: { currentCoachId: string }) {
  const allCoaches = getAllCoaches();
  const similar = allCoaches.filter((c) => c.id !== currentCoachId).slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div>
      <h2 className="text-[18px] font-bold text-foreground mb-5">Similar coaches</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {similar.map((c) => (
          <Link
            key={c.id}
            to={`/coach/${c.id}`}
            className="border border-border rounded-xl p-5 bg-gradient-to-b from-background to-[#fafafa] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg hover:border-foreground/20 transition-all duration-200 block"
          >
            <div className="flex gap-3 items-center mb-2">
              <AvatarCircle initials={getInitials(c.name)} size={40} photo={c.photo} />
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-foreground truncate">{c.name}</div>
                <div className="text-[12px] text-foreground/50 font-light truncate">{c.company?.role} at {c.company?.name}</div>
              </div>
            </div>
            {c.tagline && (
              <p className="text-[11.5px] text-foreground/40 font-light truncate mb-3">{c.tagline}</p>
            )}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <StarRating rating={c.rating} size={11} />
                <span className="text-[12px] text-foreground/50 font-light">{c.rating} ({c.reviewCount})</span>
              </div>
              <span className="text-[13px] font-bold text-foreground">From £{c.hourlyRate}/hr</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {c.skills.slice(0, 2).map((s) => (
                <span key={s} className="text-[11px] bg-background border border-border px-2.5 py-0.5 rounded-full text-foreground/60 font-medium">{s}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Sidebar Components ───────────────────────────────────── */

function BookingSidebar({ coach, onBook, onMessage }: { coach: Coach; onBook: (type: BookingType) => void; onMessage: () => void }) {
  return (
    <div className="border border-border rounded-2xl p-6 bg-background shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {/* Availability indicator */}
      <div className="flex items-center gap-2 mb-5 text-[13px] text-foreground font-medium">
        <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
        Available: {coach.availability.nextSlot}
      </div>

      <button
        onClick={() => onBook("free-intro")}
        className="w-full py-3 rounded-xl bg-foreground text-background text-[14px] font-semibold mb-2.5 hover:bg-foreground/90 transition-colors"
      >
        Schedule a free intro
      </button>
      <button
        onClick={() => onBook("session")}
        className="w-full py-3 rounded-xl border border-foreground/20 text-foreground text-[13.5px] font-medium hover:bg-foreground hover:text-background transition-all duration-200"
      >
        Book a session
      </button>

      {/* Protected badge */}
      <Link to="/guarantee" className="mt-5 p-3.5 rounded-xl border border-border flex items-center gap-2.5 hover:border-foreground/25 hover:shadow-sm transition-all duration-200">
        <Shield className="w-4 h-4 text-foreground flex-shrink-0" />
        <div>
          <div className="text-xs font-semibold text-foreground">Protected by EarlyEdge</div>
          <div className="text-[11px] text-foreground/40 font-light">100% Guarantee</div>
        </div>
      </Link>

      {/* Message */}
      <div className="mt-5 pt-5 border-t border-border">
        <div className="text-xs text-foreground/50 font-light mb-2">
          Questions? Message {coach.name.split(" ")[0]} before you get started.
        </div>
        <button onClick={onMessage} className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:underline cursor-pointer">
          <MessageSquare className="w-3.5 h-3.5" />
          Send a message
        </button>
      </div>
    </div>
  );
}

function AvailableSlots({ coach, coachId, onSlotClick }: { coach: Coach; coachId: string; onSlotClick: (day: string, time: string) => void }) {
  const [showAll, setShowAll] = useState(false);
  const slots = coach.availableSlots || [
    { day: "Today", time: coach.availability.nextSlot.replace(/^(Today|Tomorrow) /, "") },
  ];
  const displaySlots = showAll ? slots : slots.slice(0, 3);

  return (
    <div className="border border-border rounded-2xl px-6 py-5">
      <div className="text-[10px] font-semibold text-foreground uppercase tracking-widest mb-3">
        Next available slots
      </div>
      <div className="flex flex-col gap-2">
        {displaySlots.map((s, i) => (
          <button
            key={i}
            onClick={() => onSlotClick(s.day, s.time)}
            className="flex justify-between items-center px-3.5 py-2.5 rounded-lg border border-border text-xs hover:border-foreground/30 hover:shadow-sm transition-all duration-200"
          >
            <span className="text-foreground/50 font-light">{s.day}</span>
            <span className="font-semibold text-foreground">{s.time}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3">
        {slots.length > 3 ? (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold text-foreground hover:underline"
          >
            {showAll ? "Show less" : `View all ${slots.length} slots →`}
          </button>
        ) : (
          <span />
        )}
        <Link
          to={`/coaches/${coachId}/calendar`}
          className="text-xs font-semibold text-foreground/50 hover:text-foreground hover:underline transition-colors"
        >
          View calendar →
        </Link>
      </div>
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
      <div className="text-[10px] font-semibold text-foreground uppercase tracking-widest mb-4">
        How it works
      </div>
      {steps.map((step, i) => (
        <div key={i} className={`flex gap-3 items-center ${i < 2 ? "mb-3" : ""}`}>
          <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            {step.num}
          </div>
          <span className="text-[12px] text-foreground/60 font-light">{step.text}</span>
        </div>
      ))}
    </div>
  );
}

function UpcomingEventCard({ event }: { event: NonNullable<Coach["upcomingEvent"]> }) {
  return (
    <div className="rounded-2xl px-6 py-5 bg-foreground text-background relative overflow-hidden shadow-lg">
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)]" />
      <div className="flex items-center gap-1.5 mb-3.5">
        <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase">
          LIVE EVENT
        </span>
      </div>
      <div className="text-[15px] font-bold mb-1.5">{event.title}</div>
      <p className="text-[12px] text-background/70 font-light leading-snug mb-3.5">{event.description}</p>
      <div className="flex gap-3.5 text-xs text-background/60 font-light mb-4">
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
          <span className="text-[11px] text-background/50 font-light ml-1.5">{event.spotsLeft} spots left</span>
        </div>
        <button className="bg-background text-foreground rounded-lg px-4 py-2.5 text-xs font-semibold hover:bg-background/90 transition-colors">
          Register →
        </button>
      </div>
    </div>
  );
}

/* ─── Divider ──────────────────────────────────────────────── */

function Divider() {
  return <div className="h-px bg-border my-8" />;
}

export default CoachProfile;
