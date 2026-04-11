import { useState, useEffect, useRef } from "react";
import {
  Check,
  Lock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  Users,
  ShieldCheck,
  ArrowRight,
  Info,
  Phone,
  Zap,
  Play,
  Shield,
  X,
} from "lucide-react";
import {
  SPRING_WEEK_NIGHTS,
  type NightComboKey,
} from "@/data/springWeekData";
import type { WebinarFormData } from "@/hooks/useWebinarForm";

interface SpringWeekNightPickerProps {
  formData: WebinarFormData;
  onCheckout: (comboKey: NightComboKey, stripeLink: string) => void;
}

// Live panel: Sunday April 12, 2026, 7pm BST
const SESSION_START_ISO = "2026-04-12T19:00:00+01:00";

// ---- Countdown ----
function useCountdown(targetISO: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(targetISO).getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);
  return timeLeft;
}

// ---- Animated price ----
function AnimatedPrice({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    if (prevRef.current === value) return;
    const start = prevRef.current;
    const end = value;
    const dur = 300;
    const t0 = performance.now();
    function step(now: number) {
      const p = Math.min((now - t0) / dur, 1);
      setDisplayValue(+(start + (end - start) * (1 - Math.pow(1 - p, 3))).toFixed(2));
      if (p < 1) requestAnimationFrame(step);
      else { setDisplayValue(end); prevRef.current = end; }
    }
    requestAnimationFrame(step);
  }, [value]);
  const int = Math.floor(displayValue);
  const dec = Math.round((displayValue - int) * 100).toString().padStart(2, "0");
  return <span>&pound;{int}<span className="text-[0.65em] font-normal">.{dec}</span></span>;
}

// ---- Bullet component ----
function Bullet({ children, size = 16 }: { children: React.ReactNode; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
      <Check style={{ width: 15, height: 15, marginTop: 3, flexShrink: 0, color: "#2EE6A8" }} strokeWidth={2.5} />
      <span style={{ fontSize: size, color: "#FFFFFF", lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

const B = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontWeight: 600 }}>{children}</span>
);
const G = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontWeight: 600, color: "#2EE6A8" }}>{children}</span>
);

// ---- FAQ ----
const FAQ_ITEMS: { q: string; a: string; defaultOpen: boolean }[] = [
  { q: "Will there be a recording?", a: "Yes. The full recording is included with every tier. If you can't make it live, you won't miss out.", defaultOpen: true },
  { q: "What if my firm isn't covered?", a: "The conversion strategies our speakers share work across every firm and every area of finance. The networking, assessment centre, and follow-up strategies work at every firm.", defaultOpen: true },
  { q: "Can I get a refund?", a: "Yes. Full refund if it's not for you. Just email us and we'll process it. We'd rather you try it risk-free than wonder what you missed.", defaultOpen: true },
  { q: "How long is the panel?", a: "About 1.5 hours. 10+ speakers sharing their conversion stories, followed by a live Q&A where you can ask about your specific firm.", defaultOpen: false },
  { q: "What's in the Handbook?", a: "Firm-by-firm breakdowns for 45+ firms. What the spring week looks like, what the assessment day involves, networking scripts, and conversion tactics.", defaultOpen: false },
  { q: "What's the prep call in the Convert tier?", a: "A 1-on-1 call with someone who actually converted their spring week at your firm. They'll tell you what to expect, what caught them off guard, and exactly what got them the offer.", defaultOpen: false },
  { q: "Can I upgrade later?", a: "These prices are only available at checkout. Once you've purchased, the Prepare and Convert add-ons may not be available at the same price.", defaultOpen: false },
];

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 0", textAlign: "left", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.8)", background: "none", border: "none", cursor: "pointer" }}>
        {q}
        <ChevronDown style={{ width: 16, height: 16, flexShrink: 0, color: "rgba(255,255,255,0.3)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
      </button>
      {open && <p style={{ paddingBottom: 16, fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{a}</p>}
    </div>
  );
}

// ---- "What's included" items ----
const WEBINAR_ITEMS = [
  "Exactly what your Spring Week looks like at your specific firm",
  "Specific, niche advice from students who converted - the small things that actually made the difference",
  "How to network with senior bankers without being awkward, including actual scripts",
  "The mistakes that cost other students their offers (so you don't make them)",
  "Assessment centre and interview strategies that landed return offers at 25+ firms",
  "What students that converted their spring week did differently, and what they'd do again",
  "The full recording if you can't make it live",
];

// ---- Handbook bullets (split for "see more") ----
const HANDBOOK_BULLETS = [
  "Firm-by-firm breakdowns: what each day looks like, who you'll meet, what they're assessing",
  "Assessment centre and interview formats - what to expect and how to prepare",
  "Networking scripts and conversation starters that don't feel forced",
  "The specific things to do right before each session during your spring week",
  "3 follow-up email templates to send after your spring week ends",
  "Common mistakes at each firm - and what the students who converted did instead",
  "Culture breakdowns so you know what each firm actually values (not what their website says)",
  "A pre-spring-week checklist: what to research, what to wear, what to bring, who to contact",
];

// ---- Tier data ----
import {
  STRIPE_SW_WATCH,
  STRIPE_SW_PREPARE,
  STRIPE_SW_CONVERT,
  SPEAKERS,
} from "@/data/springWeekData";

type TierId = "watch" | "prepare" | "convert";
const TIER_LINKS: Record<TierId, string> = { watch: STRIPE_SW_WATCH, prepare: STRIPE_SW_PREPARE, convert: STRIPE_SW_CONVERT };
const TIER_PRICES: Record<TierId, number> = { watch: 19, prepare: 39, convert: 79 };
const TIER_NAMES: Record<TierId, string> = { watch: "Watch", prepare: "Prepare", convert: "Convert" };

// ---- Main component ----
export function SpringWeekNightPicker({ formData, onCheckout }: SpringWeekNightPickerProps) {
  const [selectedTier, setSelectedTier] = useState<TierId>("prepare");
  const [showPreview, setShowPreview] = useState(false);
  const [handbookMore, setHandbookMore] = useState(false);
  const [webinarExpanded, setWebinarExpanded] = useState(false);
  const countdown = useCountdown(SESSION_START_ISO);

  // Lock body scroll when modal open
  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showPreview]);

  function handleCheckout() {
    onCheckout(selectedTier as unknown as NightComboKey, TIER_LINKS[selectedTier]);
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">

      {/* ---- 1. HEADER ---- */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 32px)", fontWeight: 700, color: "#ffffff", lineHeight: 1.2, marginBottom: 8 }}>
          Choose your tier
        </h1>
        <p style={{ fontSize: 16, fontWeight: 400, color: "#A0A0A0", maxWidth: 500, margin: "0 auto" }}>
          One live panel. {SPEAKERS.length} speakers who converted. Every tier includes the full recording.
        </p>
      </div>

      {/* ---- 2. COUNTDOWN ---- */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 20px" }}>
        <Clock style={{ width: 14, height: 14, color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: "#A0A0A0" }}>Live panel starts in</span>
        <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#2EE6A8", letterSpacing: "0.05em" }}>
          {countdown.days > 0 && <>{countdown.days}d </>}
          {String(countdown.hours).padStart(2, "0")}h{" "}
          {String(countdown.minutes).padStart(2, "0")}m{" "}
          {String(countdown.seconds).padStart(2, "0")}s
        </span>
      </div>

      {/* ---- 3. SOCIAL PROOF PILLS ---- */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px 24px", padding: "4px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Clock style={{ width: 16, height: 16, color: "#2EE6A8" }} />
          <span style={{ fontSize: 14, fontWeight: 500, color: "#A0A0A0" }}>~1.5 hours of conversion strategies</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Users style={{ width: 16, height: 16, color: "#2EE6A8" }} />
          <span style={{ fontSize: 14, fontWeight: 500, color: "#A0A0A0" }}>20+ students have already purchased</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Play style={{ width: 16, height: 16, color: "#2EE6A8" }} />
          <span style={{ fontSize: 14, fontWeight: 500, color: "#A0A0A0" }}>Full recording included</span>
        </div>
      </div>

      {/* ---- 4. 78% CHOOSE BUNDLE BAR ---- */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(46,230,168,0.1)", border: "1px solid rgba(46,230,168,0.3)", borderRadius: 999, padding: "10px 24px", maxWidth: 400 }}>
          <Users style={{ width: 16, height: 16, color: "#2EE6A8", flexShrink: 0 }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: "#2EE6A8" }}>78% of students choose the bundle</span>
        </div>
      </div>

      {/* ---- 5. WHAT'S INCLUDED IN THE WEBINAR (Change 1: renamed + moved here) ---- */}
      <div style={{ background: "#161616", border: "1px solid #222222", borderRadius: 8, overflow: "hidden" }}>
        <button
          type="button"
          onClick={() => setWebinarExpanded(!webinarExpanded)}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Info style={{ width: 16, height: 16, color: "#2EE6A8", flexShrink: 0 }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>What's included in the webinar?</span>
          </div>
          <ChevronDown style={{ width: 16, height: 16, color: "rgba(255,255,255,0.3)", flexShrink: 0, transform: webinarExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
        </button>
        {webinarExpanded && (
          <div style={{ padding: "0 20px 20px", borderTop: "1px solid #222222", paddingTop: 16 }}>
            {WEBINAR_ITEMS.map((item, i) => (
              <Bullet key={i} size={15}>{item}</Bullet>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================
          6. WATCH TIER (Change 3: border follows selection)
      ================================================================ */}
      <div
        onClick={() => setSelectedTier("watch")}
        style={{
          background: "#111111",
          border: selectedTier === "watch" ? "2px solid #2EE6A8" : "1px solid #222222",
          borderRadius: 12,
          padding: 28,
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
      >
        {/* Badge row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ background: "rgba(46,230,168,0.15)", color: "#2EE6A8", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>
            <Zap style={{ width: 12, height: 12, display: "inline", verticalAlign: "-1px", marginRight: 4 }} />
            34% OFF
          </span>
          <span style={{ color: "#FF4D4D", fontSize: 13, fontWeight: 600, fontStyle: "italic" }}>Valid for next 12 hours only</span>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>Watch</h2>
        <p style={{ fontSize: 14, color: "#A0A0A0", marginBottom: 16 }}>Full 1.5-hour panel - watch live or anytime after</p>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 22, color: "#666666", textDecoration: "line-through" }}>&pound;29</span>
          <span style={{ fontSize: 36, fontWeight: 800, color: "#FFFFFF" }}>&pound;19</span>
        </div>

        <Bullet>Full <B>1.5-hour</B> live panel recording</Bullet>
        <Bullet>Hear how students converted at <B>JP Morgan</B>, <B>Jane Street</B>, <B>Evercore</B> and more</Bullet>
        <Bullet>Direct Q&amp;A with the speakers</Bullet>
        <Bullet><G>Lifetime access</G> to the recording - watch anytime, anywhere</Bullet>
        <Bullet>Extra <G>free resources</G> included</Bullet>

        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); setSelectedTier("prepare"); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); setSelectedTier("prepare"); } }}
          style={{ display: "inline-block", marginTop: 16, fontSize: 14, fontWeight: 600, color: "#2EE6A8", cursor: "pointer" }}
        >
          Upgrade to Prepare for the Handbook &rarr;
        </span>
      </div>

      {/* ================================================================
          7. PREPARE TIER (Change 3: border follows selection; Change 4: see more; Change 5: modal; Change 6: MOST POPULAR)
      ================================================================ */}
      <div
        onClick={() => setSelectedTier("prepare")}
        style={{
          background: "#111111",
          border: selectedTier === "prepare" ? "2px solid #2EE6A8" : "1px solid #222222",
          borderRadius: 12,
          padding: "40px 28px 28px",
          position: "relative",
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
      >
        {/* MOST POPULAR badge (Change 6: stays permanently) */}
        <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#2EE6A8", color: "#0A0A0A", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 999, whiteSpace: "nowrap" }}>
          Most Popular
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ background: "rgba(46,230,168,0.15)", color: "#2EE6A8", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>
            <Zap style={{ width: 12, height: 12, display: "inline", verticalAlign: "-1px", marginRight: 4 }} />
            BEST VALUE
          </span>
          <span style={{ color: "#2EE6A8", fontSize: 13, fontWeight: 600 }}>This week only</span>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>Prepare</h2>
        <p style={{ fontSize: 14, color: "#A0A0A0", marginBottom: 16 }}>Everything in Watch, plus the complete handbook that covers 45+ firms</p>

        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: "#FFFFFF" }}>&pound;39</span>
        </div>

        <Bullet>Full <B>1.5-hour</B> live panel recording</Bullet>
        <Bullet>Hear how students converted at <B>JP Morgan</B>, <B>Jane Street</B>, <B>Evercore</B> and more</Bullet>
        <Bullet>Direct Q&amp;A with the speakers</Bullet>
        <Bullet><G>Lifetime access</G> to the recording - watch anytime, anywhere</Bullet>
        <Bullet>Extra <G>free resources</G> included</Bullet>

        <div style={{ height: 1, background: "#222222", margin: "20px 0" }} />

        <Bullet size={15}>
          <B>The Spring Week Conversion Handbook</B>{" "}
          <span style={{ color: "#A0A0A0" }}>- get access instantly, and apply the strategies while you watch</span>
        </Bullet>

        {/* ---- Handbook detail card ---- */}
        <div style={{ background: "#1A1A1A", border: "1px solid #333333", borderRadius: 8, padding: 20, margin: "16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <BookOpen style={{ width: 16, height: 16, color: "#2EE6A8", flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.05em" }}>The Spring Week Conversion Handbook</span>
          </div>

          <p style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF", marginBottom: 8 }}>
            This is the most detailed spring week preparation resource available anywhere.
          </p>
          <p style={{ fontSize: 14, color: "#A0A0A0", lineHeight: 1.6, marginBottom: 12 }}>
            Covering 45+ firms with insider breakdowns from students who actually converted. This is not generic careers advice - it's real, specific intel from people who were in your seat last year.
          </p>
          <p style={{ fontSize: 14, color: "#A0A0A0", lineHeight: 1.6, marginBottom: 16 }}>
            Use it alongside the live panel to go deeper on <B>your target firm</B>.
          </p>

          {/* Change 5: Image opens modal, not inline expand */}
          <div
            onClick={(e) => { e.stopPropagation(); setShowPreview(true); }}
            style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid #333333", marginBottom: 8, cursor: "pointer", maxHeight: 200 }}
          >
            <img
              src="/images/handbook-preview-hsbc.png"
              alt="Preview of the HSBC Spring Week section from the handbook"
              style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: "top" }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(transparent, #1A1A1A)", borderRadius: "0 0 8px 8px", pointerEvents: "none" }} />
          </div>
          <p
            onClick={(e) => { e.stopPropagation(); setShowPreview(true); }}
            style={{ fontSize: 12, color: "#666666", fontStyle: "italic", marginBottom: 16, textAlign: "center", cursor: "pointer" }}
          >
            Preview of the HSBC section - tap to expand
          </p>

          {/* Toggle pill button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setHandbookMore(!handbookMore); }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "12px 20px",
              background: "rgba(46, 230, 168, 0.1)",
              border: "1px solid rgba(46, 230, 168, 0.3)",
              borderRadius: 8,
              color: "#2EE6A8",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 12,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(46, 230, 168, 0.2)"; e.currentTarget.style.borderColor = "rgba(46, 230, 168, 0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(46, 230, 168, 0.1)"; e.currentTarget.style.borderColor = "rgba(46, 230, 168, 0.3)"; }}
          >
            {handbookMore ? "Hide Handbook details" : "See what's inside the Handbook"}
            <ChevronDown style={{ width: 14, height: 14, transform: handbookMore ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
          </button>

          {/* All handbook bullets inside toggle */}
          <div
            style={{
              maxHeight: handbookMore ? 600 : 0,
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}
          >
            <div style={{ fontSize: 14, paddingTop: 12 }}>
              {HANDBOOK_BULLETS.map((b, i) => (
                <Bullet key={i} size={14}>{b}</Bullet>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ================================================================
          8. CONVERT TIER (Change 3: border follows selection)
      ================================================================ */}
      <div
        onClick={() => setSelectedTier("convert")}
        style={{
          background: "#111111",
          border: selectedTier === "convert" ? "2px solid #2EE6A8" : "1px solid #333333",
          borderRadius: 12,
          padding: 28,
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <span style={{ background: "rgba(255,184,77,0.15)", color: "#FFB84D", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>BEST VALUE</span>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>Convert</h2>
        <p style={{ fontSize: 14, color: "#A0A0A0", marginBottom: 16 }}>Walk in ready to get the offer</p>

        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: "#FFFFFF" }}>&pound;79</span>
        </div>

        <p style={{ fontSize: 16, fontWeight: 500, color: "#FFFFFF", marginBottom: 16 }}>Everything in Prepare, plus:</p>

        <div style={{ background: "#1A1A1A", border: "1px solid #333333", borderRadius: 8, padding: 20, margin: "12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Phone style={{ width: 16, height: 16, color: "#2EE6A8", flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.05em" }}>30-Minute 1-on-1 Prep Call</span>
          </div>

          <p style={{ fontSize: 14, color: "#A0A0A0", lineHeight: 1.6, marginBottom: 16 }}>
            A private 30-minute call with a speaker who completed and converted their spring week at <B>your target firm</B>. They'll walk you through exactly what to expect - day by day - and give you <B>tailored advice</B> for your specific situation, your firm's culture, and your goals.
          </p>

          <Bullet size={14}>Matched to a speaker who converted at your specific firm</Bullet>
          <Bullet size={14}>Covers your week's schedule, the assessment format, and what they're really looking for</Bullet>
          <Bullet size={14}>Personalised networking strategy - who to talk to, when, and what to say</Bullet>
          <Bullet size={14}>Conducted before your conversion so you walk in fully prepared</Bullet>

          <p style={{ fontSize: 13, color: "#A0A0A0", fontStyle: "italic", marginTop: 12 }}>
            This is the closest thing to having a mentor who's already been through it.
          </p>
        </div>
      </div>

      {/* ---- 9. STICKY PURCHASE BAR (Change 2: space in button text) ---- */}
      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              {selectedTier === "watch" && (
                <span style={{ fontSize: 18, color: "#666666", textDecoration: "line-through" }}>&pound;29</span>
              )}
              <span style={{ fontSize: 32, fontWeight: 800, color: selectedTier === "prepare" ? "#2EE6A8" : "#FFFFFF", letterSpacing: "-0.02em" }}>
                <AnimatedPrice value={TIER_PRICES[selectedTier]} />
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#666666", marginTop: 4 }}>{TIER_NAMES[selectedTier]} tier selected</p>
          </div>
        </div>

        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 10 }}>
          78% of students choose the bundle &middot; {SPEAKERS.length} speakers who converted their spring weeks
        </p>

        <button
          type="button"
          onClick={handleCheckout}
          style={{ width: "100%", padding: "16px 0", borderRadius: 12, fontSize: 16, fontWeight: 700, background: "#2EE6A8", color: "#0A0A0A", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#26CC96"; e.currentTarget.style.boxShadow = "0 0 30px rgba(46,230,168,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#2EE6A8"; e.currentTarget.style.boxShadow = "none"; }}
        >
          Get {TIER_NAMES[selectedTier]}{" "}for &pound;{TIER_PRICES[selectedTier]}
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ShieldCheck style={{ width: 12, height: 12 }} /> Full refund</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Lock style={{ width: 12, height: 12 }} /> Secure Stripe checkout</span>
        </div>
      </div>

      {/* ---- 10. REFUND GUARANTEE PILL ---- */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(46,230,168,0.1)", border: "1px solid rgba(46,230,168,0.3)", borderRadius: 999, padding: "10px 20px" }}>
          <Shield style={{ width: 16, height: 16, color: "#2EE6A8", flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#2EE6A8" }}>Full refund included if not satisfied</span>
        </div>
      </div>

      {/* ---- 11. FAQ ---- */}
      <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Frequently asked questions</p>
        </div>
        <div style={{ padding: "0 20px" }}>
          {FAQ_ITEMS.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} defaultOpen={item.defaultOpen} />)}
        </div>
      </div>

      {/* ---- 12. BOTTOM URGENCY BAR ---- */}
      <div style={{ background: "#161616", borderLeft: "3px solid #2EE6A8", borderTop: "1px solid #222222", borderRight: "1px solid #222222", borderBottom: "1px solid #222222", borderRadius: "0 12px 12px 0", padding: "14px 18px" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.4 }}>The live panel is Sunday April 12 at 7pm BST.</p>
        <p style={{ fontSize: 13, fontWeight: 400, color: "#A0A0A0", marginTop: 4, lineHeight: 1.5 }}>Spring weeks start the next morning. This is the last weekend to prepare.</p>
      </div>

      {/* ---- Change 5: Handbook preview modal ---- */}
      {showPreview && (
        <div
          onClick={() => setShowPreview(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            cursor: "pointer",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              borderRadius: 12,
              border: "1px solid #333333",
              backgroundColor: "#111111",
            }}
          >
            <button
              onClick={() => setShowPreview(false)}
              style={{
                position: "sticky",
                top: 12,
                float: "right",
                marginRight: 12,
                background: "rgba(0,0,0,0.6)",
                border: "1px solid #444444",
                borderRadius: "50%",
                width: 32,
                height: 32,
                color: "#FFFFFF",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1001,
              }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
            <img
              src="/images/handbook-preview-hsbc.png"
              alt="Full preview of the HSBC Spring Week section"
              style={{ width: "100%", display: "block", borderRadius: 12 }}
            />
            <p style={{ color: "#666666", fontSize: 13, fontStyle: "italic", textAlign: "center", padding: 12 }}>
              HSBC Spring Week - full section preview
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
