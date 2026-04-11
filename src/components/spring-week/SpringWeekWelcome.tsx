import { useState, useEffect, useRef } from "react";
import { useCountdown } from "./shared";
import { ArrowRight, Shield, ChevronDown } from "lucide-react";

interface SpringWeekWelcomeProps {
  onContinue: () => void;
}

// Spring weeks start: Monday April 13, 2026, 9am BST
const SW_START_ISO = "2026-04-13T09:00:00+01:00";

const FIRM_NAMES = [
  "Goldman Sachs", "Morgan Stanley", "JP Morgan", "Evercore", "Lazard", "UBS",
  "Barclays", "Citi", "HSBC", "Deutsche Bank", "Nomura",
  "Houlihan Lokey", "Jane Street", "Bank of America", "D.E. Shaw",
  "Macquarie", "BNP Paribas", "RBC", "EY", "McKinsey", "Deloitte",
  "Schroders", "Carlyle",
];

const CHECKLIST_ITEMS = [
  "Exactly what your Spring Week looks like at your specific firm",
  "Specific, niche advice from students who converted \u2014 the small things that actually made the difference",
  "How to network with senior bankers without being awkward, including actual scripts",
  "The mistakes that cost other students their offers (so you don't make them)",
  "Assessment centre and interview strategies that landed return offers at 25+ firms",
  "What students that converted their spring week did differently, and what they'd do again",
  "The full recording if you can't make it live",
];

const FAQS = [
  {
    q: "What if I can't make it live?",
    a: "The full recording is available within 24 hours. Every ticket tier includes access to the recording, so you won't miss anything.",
  },
  {
    q: "What's your refund policy?",
    a: "Full refund if it's not for you. If you attend and don't find it useful, email us and we'll refund you. It's that simple.",
  },
  {
    q: "What if my target firm isn't listed?",
    a: "The conversion strategies (networking, assessment centres, follow-ups) apply across all firms. We cover 25+ firms directly and the principles transfer to any spring week.",
  },
  {
    q: "How long does the session last?",
    a: "Approximately 2 hours. 10+ speakers, each doing a focused segment on their firm, followed by a live panel discussion and audience Q&A.",
  },
  {
    q: "What is included inside The Handbook?",
    a: "The Spring Week Conversion Handbook covers 45+ firms with day-by-day breakdowns, what helped each speaker stand out, the mistakes they saw others make, and whether they got a return offer. It's written in the speakers' own words, not AI-generated.",
  },
  {
    q: "I haven't secured a spring week yet. Is this still relevant for me?",
    a: "This session is specifically designed for students who already have a spring week starting soon. If you're still applying, our other resources may be more relevant, but the recording could still help you understand what firms are looking for.",
  },
  {
    q: "What does the prep call include?",
    a: "The Convert tier includes a 30-minute 1-on-1 call with one of the speakers before your spring week starts. You'll get tailored advice for your specific firm, situation, and goals.",
  },
];

/* ---- Fade-in on scroll ---- */
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.4s ${delay}ms ease, transform 0.4s ${delay}ms ease`,
      }}
    >
      {children}
    </div>
  );
}

/* ---- Section label ---- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#2EE6A8",
        textAlign: "center",
        marginBottom: 20,
      }}
    >
      {children}
    </p>
  );
}

/* ---- CTA button ---- */
function CTABtn({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        maxWidth: 480,
        height: 56,
        background: hovered ? "#26CC96" : "#2EE6A8",
        color: "#0A0A0A",
        fontWeight: 700,
        fontSize: 18,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: hovered ? "0 0 30px rgba(46, 230, 168, 0.15)" : "none",
        letterSpacing: "0.02em",
      }}
    >
      Get Ready Before Monday
      <ArrowRight style={{ width: 18, height: 18 }} />
    </button>
  );
}

/* ---- FAQ item ---- */
function FAQItem({
  q,
  a,
  defaultOpen,
}: {
  q: string;
  a: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #222222",
        borderRadius: 8,
        marginBottom: 8,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#ffffff",
              lineHeight: 1.4,
            }}
          >
            {q}
          </span>
          <ChevronDown
            style={{
              width: 18,
              height: 18,
              color: "#666666",
              flexShrink: 0,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </div>
        {open && (
          <p
            style={{
              fontSize: 15,
              fontWeight: 400,
              color: "#A0A0A0",
              marginTop: 12,
              lineHeight: 1.6,
            }}
          >
            {a}
          </p>
        )}
      </button>
    </div>
  );
}

/* ---- Main component ---- */
export function SpringWeekWelcome({ onContinue }: SpringWeekWelcomeProps) {
  const countdown = useCountdown(SW_START_ISO);

  const ctaCountdown =
    countdown.days > 0
      ? `${countdown.days} day${countdown.days !== 1 ? "s" : ""}, ${countdown.hours} hour${countdown.hours !== 1 ? "s" : ""}`
      : `${countdown.hours} hour${countdown.hours !== 1 ? "s" : ""}, ${countdown.minutes} minute${countdown.minutes !== 1 ? "s" : ""}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >

      {/* ================================================================
          SECTION 2: HERO
      ================================================================ */}
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          textAlign: "center",
        }}
      >
        {/* Top badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#161616",
              border: "1px solid #222222",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 500,
              color: "#A0A0A0",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#2EE6A8",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            SUNDAY APRIL 12 · 7PM BST
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontWeight: 800,
            fontSize: "clamp(36px, 7vw, 56px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            marginBottom: 20,
          }}
        >
          Your spring week starts Monday.
          <br />
          Will you <span style={{ color: "#2EE6A8" }}>convert</span> it?
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "#A0A0A0",
            lineHeight: 1.6,
            maxWidth: 540,
            margin: "0 auto 40px",
          }}
        >
          Only{" "}
          <span style={{ color: "#FFFFFF", fontWeight: 700 }}>10-15%</span> of
          spring interns convert on average. This Sunday,{" "}
          <span style={{ color: "#ffffff" }}>7 students</span> who converted{" "}
          <span style={{ color: "#ffffff" }}>25+ spring weeks</span> share exactly
          how they did it — the weekend before yours starts.
        </p>

        {/* CTA */}
        <div
          style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}
        >
          <CTABtn onClick={onContinue} />
        </div>

        {/* Proof line */}
        <p style={{ fontSize: 14, color: "#666666", textAlign: "center", marginBottom: 10 }}>
          Join 150+ students already registered · Full refund if it's not for you
        </p>

        {/* Recording badge */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span
            style={{
              background: "#161616",
              border: "1px solid #222222",
              borderRadius: 999,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#A0A0A0",
            }}
          >
            Recording Included
          </span>
        </div>

      </div>

      {/* ================================================================
          SPEAKERS WHO CONVERTED AT
      ================================================================ */}
      <FadeIn>
        <div
          style={{
            maxWidth: 720,
            margin: "80px auto 0",
            textAlign: "center",
          }}
        >
          <SectionLabel>Speakers Who Converted At</SectionLabel>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {FIRM_NAMES.map((firm) => (
              <span
                key={firm}
                style={{
                  background: "#161616",
                  border: "1px solid #222222",
                  borderRadius: 999,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#ffffff",
                  transition: "border-color 0.15s ease",
                  cursor: "default",
                  display: "inline-block",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#2EE6A8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#222222")
                }
              >
                {firm}
              </span>
            ))}
            <span
              style={{
                background: "transparent",
                border: "1px solid #444444",
                borderRadius: 999,
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 500,
                fontStyle: "italic",
                color: "#666666",
                display: "inline-block",
              }}
            >
              &amp; more
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#A0A0A0",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            Every speaker completed and converted their spring week. They'll
            share exactly what they did.
          </p>
          <p
            style={{
              color: "#666666",
              fontSize: 13,
              fontWeight: 400,
              textAlign: "center",
              fontStyle: "italic",
              marginTop: 16,
            }}
          >
            Don't see your firm? Email{" "}
            <a
              href="mailto:dylan@yourearlyedge.co.uk"
              style={{
                color: "#A0A0A0",
                fontStyle: "normal",
                textDecoration: "underline",
                textDecorationColor: "#444444",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.color = "#FFFFFF";
                t.style.textDecorationColor = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.color = "#A0A0A0";
                t.style.textDecorationColor = "#444444";
              }}
            >
              dylan@yourearlyedge.co.uk
            </a>{" "}
            and we'll connect you with someone who's done it.
          </p>
        </div>
      </FadeIn>

      {/* ================================================================
          SECTION 3: PROBLEM AGITATION - "THE REALITY"
      ================================================================ */}
      <FadeIn>
        <div
          style={{
            maxWidth: 720,
            margin: "80px auto 0",
            textAlign: "center",
          }}
        >
          <SectionLabel>The Reality</SectionLabel>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 28px)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: 32,
            }}
          >
            Most spring interns don't get invited back.
          </h2>
          <div
            style={{
              maxWidth: 580,
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "#A0A0A0",
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              You've done the hard part: applications, interviews, aptitude
              tests. But the spring week itself is where{" "}
              <span style={{ color: "#FFFFFF", fontWeight: 600 }}>most people fall apart</span>.{" "}
              <span style={{ color: "#FFFFFF", fontWeight: 600 }}>Firms are watching from Day 1</span>,
              and most students don't realise the assessment starts the moment they walk in.
            </p>
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "#A0A0A0",
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              The final day is usually an assessment centre. By then,{" "}
              <span style={{ color: "#FFFFFF", fontWeight: 600 }}>it's too late to course-correct</span>.
              The students who convert are the ones who showed up on Monday
              already knowing what to expect, how to network without being
              awkward, and what the assessment would look like.
            </p>
            <p
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "#FFFFFF",
                lineHeight: 1.7,
                marginTop: 24,
                textAlign: "center",
              }}
            >
              That's what this session is for.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ================================================================
          SECTION 4: WHAT YOU'LL KNOW BY MONDAY MORNING
      ================================================================ */}
      <FadeIn>
        <div style={{ maxWidth: 720, margin: "80px auto 0" }}>
          <SectionLabel>What You'll Know By Monday Morning</SectionLabel>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            {CHECKLIST_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "14px 0",
                  borderBottom:
                    i < CHECKLIST_ITEMS.length - 1
                      ? "1px solid #1a1a1a"
                      : "none",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#2EE6A8",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                  >
                    <path
                      d="M2.5 5.5l2.5 2.5L9 3"
                      stroke="#0A0A0A"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#ffffff",
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ================================================================
          "FROM £19" PRICING SECTION
      ================================================================ */}
      <FadeIn>
        <div
          style={{
            maxWidth: 580,
            margin: "0 auto",
            textAlign: "center",
            padding: "64px 20px",
          }}
        >
          <SectionLabel>The Session</SectionLabel>

          {/* Price line */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <span style={{ color: "#A0A0A0", fontSize: 28, fontWeight: 400 }}>
              From
            </span>
            <span style={{ color: "#FFFFFF", fontSize: 48, fontWeight: 800 }}>
              £19
            </span>
          </div>

          {/* Supporting line */}
          <p
            style={{
              color: "#A0A0A0",
              fontSize: 16,
              fontWeight: 400,
              marginBottom: 32,
            }}
          >
            One live panel. 7 speakers. 25+ spring weeks covered. Recording included.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <CTABtn onClick={onContinue} />
          </div>

          {/* Trust line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginTop: 12,
            }}
          >
            <Shield style={{ width: 14, height: 14, color: "#666666" }} />
            <span style={{ fontSize: 14, color: "#666666" }}>
              Full refund · Secure Stripe checkout
            </span>
          </div>
        </div>
      </FadeIn>

      {/* ================================================================
          SECTION 9: CHECKLIST CALLOUT
      ================================================================ */}
      <FadeIn>
        <div style={{ maxWidth: 720, margin: "80px auto 0" }}>
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              background: "#111111",
              border: "1px solid #2EE6A8",
              borderRadius: 12,
              padding: 28,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#2EE6A8",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Free With Every Ticket
            </p>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 14,
                lineHeight: 1.3,
              }}
            >
              The Spring Week Conversion Checklist
            </h3>
            <p
              style={{
                fontSize: 15,
                color: "#A0A0A0",
                lineHeight: 1.6,
                marginBottom: 12,
              }}
            >
              A step-by-step guide to standing out from Day 1. Covers what to
              wear, what to say in your first conversation, how to ask for
              feedback without being awkward, and how to follow up after the
              week ends.
            </p>
            <p style={{ fontSize: 13, color: "#666666" }}>
              Also available as a free download if you're not ready to buy yet.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ================================================================
          SECTION 10: WHY THIS WEEKEND
      ================================================================ */}
      <FadeIn>
        <div style={{ maxWidth: 720, margin: "80px auto 0" }}>
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              background: "#161616",
              borderLeft: "3px solid #2EE6A8",
              borderTop: "1px solid #222222",
              borderRight: "1px solid #222222",
              borderBottom: "1px solid #222222",
              borderRadius: "0 12px 12px 0",
              padding: 24,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#2EE6A8",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Why This Weekend?
            </p>
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "#ffffff",
                lineHeight: 1.7,
              }}
            >
              Spring weeks start{" "}
              <strong style={{ fontWeight: 700 }}>Monday April 13</strong>.
              Most firms run the assessment centre on the{" "}
              <strong style={{ fontWeight: 700 }}>final day</strong>, so the
              students who convert are the ones who showed up ready from Day 1.
              This is the last weekend to prepare with students who already
              converted.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ================================================================
          SECTION 11: FAQs
      ================================================================ */}
      <FadeIn>
        <div style={{ maxWidth: 720, margin: "80px auto 0" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <SectionLabel>Common Questions</SectionLabel>
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                q={faq.q}
                a={faq.a}
                defaultOpen={i < 3}
              />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ================================================================
          SECTION 12: FINAL CTA
      ================================================================ */}
      <FadeIn>
        <div
          style={{
            maxWidth: 720,
            margin: "80px auto 0",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.3,
              marginBottom: 12,
            }}
          >
            Your spring week starts in {ctaCountdown}.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#A0A0A0",
              marginBottom: 32,
            }}
          >
            Prepare with students who already converted.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <CTABtn onClick={onContinue} />
          </div>
          <p style={{ fontSize: 14, color: "#666666" }}>
            150+ students already registered · Recording included · Full refund
          </p>
        </div>
      </FadeIn>

      {/* ================================================================
          SECTION 13: FOOTER
      ================================================================ */}
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          marginTop: 80,
          paddingBottom: 40,
          borderTop: "1px solid #222222",
          paddingTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>
          Early<span style={{ fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Edge</span>
        </p>
        <p style={{ fontSize: 13, color: "#444444" }}>
          &copy; 2026 EarlyEdge
        </p>
      </div>
    </div>
  );
}
