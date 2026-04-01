import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SPEAKERS } from "@/data/springWeekData";
import {
  CheckCircle2,
  Clock,
  Mail,
  ArrowRight,
  Building2,
  User,
  MessageSquare,
  CalendarCheck,
  FileText,
  Send,
} from "lucide-react";

/* ---------------------------------------------------------------
   Coaching tier data
--------------------------------------------------------------- */
interface CoachingTier {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  includes: string[];
  recommended?: boolean;
}

const COACHING_TIERS: CoachingTier[] = [
  {
    id: "strategy-call",
    name: "30-min Strategy Call",
    duration: "30 min",
    price: "35",
    description:
      "A focused session for students who want rapid, targeted advice. Get specific answers from someone who has been inside the firm you are targeting.",
    includes: [
      "Quick-fire Q&A on your specific firm",
      "Priority areas to focus on before and during the programme",
      "What the firm actually evaluates day-to-day",
      "One or two actionable changes to make immediately",
    ],
  },
  {
    id: "deep-dive",
    name: "60-min Deep Dive",
    duration: "60 min",
    price: "59",
    description:
      "A thorough session covering your full spring week preparation. Walk away with a personalised action plan written around your exact situation.",
    includes: [
      "Full CV review for the spring week context",
      "Mock interview with firm-specific feedback",
      "Conversion strategy tailored to your programme",
      "Personalised action plan to work through after the session",
      "Follow-up by email if you have questions after the call",
    ],
    recommended: true,
  },
];

/* ---------------------------------------------------------------
   What coaches can help with, by category
--------------------------------------------------------------- */
interface FirmHelp {
  firm: string;
  note?: string;
  helpWith: string[];
}

const FIRM_HELP: FirmHelp[] = [
  {
    firm: "Jefferies",
    helpWith: [
      "What makes Jefferies culture different from bulge brackets",
      "How to build relationships with senior staff in a smaller cohort",
      "What the final presentation really requires",
    ],
  },
  {
    firm: "Forbes",
    helpWith: [
      "How media spring weeks differ from finance programmes",
      "What evaluators look for in the final pitch",
      "Building the right commercial awareness before the programme",
    ],
  },
  {
    firm: "Nomura",
    helpWith: [
      "How Nomura's culture differs from US banks",
      "The cross-divisional signals that drive conversion",
      "What the group project evaluators are actually looking for",
    ],
  },
  {
    firm: "Citi",
    note: "Return offer",
    helpWith: [
      "How the conversion decision is split between desk and HR",
      "Week-one habits that determine your reputation",
      "What to do in the final-week group presentation",
    ],
  },
  {
    firm: "Barclays",
    helpWith: [
      "The informal mid-programme checkpoint most people do not know about",
      "How to use the second rotation to recover from a slow first week",
      "The skills sessions as underrated conversion opportunities",
    ],
  },
  {
    firm: "Optiver",
    helpWith: [
      "How trading firms assess you differently from banks",
      "What the market-making challenge is actually testing",
      "How to handle being wrong in a prop trading environment",
    ],
  },
  {
    firm: "Bank of America",
    helpWith: [
      "How the analyst buddy relationship drives conversion",
      "The divisional track structure and what it means for visibility",
      "Deadline culture and how to manage it",
    ],
  },
  {
    firm: "Millennium",
    helpWith: [
      "How hedge fund spring weeks differ from banking",
      "Pod-level networking strategy vs programme-level impressions",
      "What intellectual curiosity looks like in practice at Millennium",
    ],
  },
  {
    firm: "PwC",
    helpWith: [
      "What Big 4 partners look for beyond the case simulations",
      "Client empathy signals that separate top converters",
      "How to structure a presentation that impresses partners",
    ],
  },
  {
    firm: "Citadel",
    helpWith: [
      "Quantitative preparation strategy for the programme",
      "How to reason through ambiguous problems in quant sessions",
      "What intellectual curiosity looks like to Citadel evaluators",
    ],
  },
  {
    firm: "Morgan Stanley",
    helpWith: [
      "The week-one and week-two check-ins and how to handle them",
      "What the top converters had in common beyond technical performance",
      "How to handle the final interview after the case study",
    ],
  },
];

/* ---------------------------------------------------------------
   How it works steps
--------------------------------------------------------------- */
const HOW_IT_WORKS = [
  {
    icon: Mail,
    step: "01",
    title: "Email to book",
    description:
      "Email team@earlyedge.co with the firm you are targeting and which session type you want. We match you with the right speaker.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Prep your questions",
    description:
      "We send you a short prep sheet. Bring your CV, your specific concerns, and any questions you want to work through.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "1-on-1 session",
    description:
      "A focused Zoom call with your speaker. They have been inside the firm and know exactly what the programme involves.",
  },
  {
    icon: Send,
    step: "04",
    title: "Follow up",
    description:
      "After the session you get a summary of the key points covered. Deep Dive sessions include email follow-up support.",
  },
];

/* ---------------------------------------------------------------
   Speaker card component
--------------------------------------------------------------- */
function SpeakerCard({ firmHelp }: { firmHelp: FirmHelp }) {
  const speakerData = SPEAKERS.find((s) => s.firm === firmHelp.firm);
  const note = speakerData?.note ?? firmHelp.note;

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-[#888]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-semibold text-[#111]">
              {firmHelp.firm}
            </p>
            {note && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {note}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <User className="w-3 h-3 text-[#CCC]" />
            <p className="text-[12px] text-[#999] font-light">Speaker TBC</p>
          </div>
        </div>
      </div>

      {/* What they can help with */}
      <div>
        <p className="text-[10px] font-semibold text-[#BBB] uppercase tracking-wider mb-2">
          Can help with
        </p>
        <ul className="space-y-1.5">
          {firmHelp.helpWith.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-[12px] text-[#555] font-light leading-snug">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Main page
--------------------------------------------------------------- */
export default function SpringWeekCoaching() {
  useEffect(() => {
    document.title = "1-on-1 Spring Week Coaching | EarlyEdge";

    const metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    const prevDescription = metaDescription?.content ?? "";
    if (metaDescription) {
      metaDescription.content =
        "Get firm-specific advice from students who completed spring weeks at Goldman, Citi, Barclays, Optiver, and more. Book a 1-on-1 coaching session and get a personalised conversion strategy for your programme.";
    }

    const setMeta = (name: string, content: string): HTMLMetaElement => {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[name="${name}"], meta[property="${name}"]`
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(name.startsWith("og:") ? "property" : "name", name);
        document.head.appendChild(el);
      }
      el.content = content;
      return el;
    };

    const ogTitle = "1-on-1 Spring Week Coaching | EarlyEdge";
    const ogDescription =
      "Book 1-on-1 coaching with students who converted spring weeks at top firms. 30-min and 60-min sessions available.";

    setMeta("og:title", ogTitle);
    setMeta("og:description", ogDescription);
    setMeta("og:type", "website");
    setMeta("og:url", window.location.href);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", ogTitle);
    setMeta("twitter:description", ogDescription);

    return () => {
      document.title = "Early Edge";
      if (metaDescription) {
        metaDescription.content = prevDescription;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-16">

        {/* ── Hero ── */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-10 pb-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#999] mb-3">
            1-on-1 Coaching
          </p>
          <h1 className="text-3xl md:text-[38px] font-bold tracking-tight text-[#111] leading-tight mb-4">
            Continue your spring week preparation
          </h1>
          <p className="text-[16px] text-[#555] font-light leading-relaxed max-w-2xl mb-6">
            Work directly with someone who completed a spring week at the firm
            you are targeting. Get firm-specific advice, conversion strategies,
            and honest answers from someone who has been inside the programme.
          </p>
          <a
            href="mailto:team@earlyedge.co?subject=Spring%20Week%20Coaching%20Booking"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111] text-white text-[14px] font-semibold hover:bg-[#222] transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email to book
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* ── Speakers grid ── */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 mb-14">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-[18px] font-semibold text-[#111]">
                Available coaches
              </h2>
              <p className="text-[13px] text-[#888] font-light mt-0.5">
                Each coach has first-hand experience from inside the programme
              </p>
            </div>
            <span className="text-[11px] text-[#BBB] font-light hidden sm:block">
              {FIRM_HELP.length} firms covered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIRM_HELP.map((fh) => (
              <SpeakerCard key={fh.firm} firmHelp={fh} />
            ))}
          </div>
        </div>

        {/* ── Coaching tiers ── */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 mb-14">
          <h2 className="text-[18px] font-semibold text-[#111] mb-1">
            Choose a session type
          </h2>
          <p className="text-[13px] text-[#888] font-light mb-6">
            Both sessions are 1-on-1 Zoom calls with your chosen coach
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COACHING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-white rounded-xl p-6 flex flex-col gap-4 transition-all ${
                  tier.recommended
                    ? "border-2 border-[#111] shadow-md"
                    : "border border-[#E8E8E8]"
                }`}
              >
                {tier.recommended && (
                  <span className="absolute -top-3 left-5 bg-[#111] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                )}

                {/* Tier header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#111]">
                      {tier.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-[#999]" />
                      <span className="text-[12px] text-[#888]">
                        {tier.duration}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[22px] font-bold text-[#111]">
                      &pound;{tier.price}
                    </p>
                    <p className="text-[11px] text-[#AAA]">per session</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-[#666] font-light leading-relaxed">
                  {tier.description}
                </p>

                {/* Includes */}
                <ul className="space-y-2">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[12px] text-[#555]">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={`mailto:team@earlyedge.co?subject=${encodeURIComponent(
                    `${tier.name} booking request`
                  )}`}
                  className={`mt-auto flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                    tier.recommended
                      ? "bg-[#111] text-white hover:bg-[#222]"
                      : "bg-[#F5F5F5] text-[#111] hover:bg-[#EBEBEB]"
                  }`}
                >
                  Book {tier.name}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 mb-14">
          <h2 className="text-[18px] font-semibold text-[#111] mb-1">
            How it works
          </h2>
          <p className="text-[13px] text-[#888] font-light mb-6">
            From booking to follow-up in four steps
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-white border border-[#E8E8E8] rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#888]" />
                    </div>
                    <span className="text-[11px] font-bold text-[#CCC] tracking-widest">
                      {step.step}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#111] mb-1">
                    {step.title}
                  </p>
                  <p className="text-[12px] text-[#777] font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Testimonials placeholder ── */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 mb-14">
          <h2 className="text-[18px] font-semibold text-[#111] mb-1">
            What students say
          </h2>
          <p className="text-[13px] text-[#888] font-light mb-5">
            Testimonials will appear here after the first coaching sessions
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-[#FAFAFA] border border-dashed border-[#E0E0E0] rounded-xl p-5 flex flex-col items-center justify-center text-center min-h-[120px]"
              >
                <CalendarCheck className="w-5 h-5 text-[#DDD] mb-2" />
                <p className="text-[11px] text-[#CCC] font-light">
                  Session feedback coming soon
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-br from-[#111] to-[#1a1a2e] rounded-2xl p-8 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-2">
              Ready to start
            </p>
            <h2 className="text-[20px] font-semibold mb-2">
              Book your coaching session
            </h2>
            <p className="text-[13px] text-white/60 font-light leading-relaxed mb-6 max-w-xl">
              Email us with the firm you are targeting and the session type you
              want. We will match you with the right coach and confirm your
              booking within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:team@earlyedge.co?subject=Spring%20Week%20Coaching%20Booking"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#111] text-[13px] font-semibold hover:bg-white/90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                team@earlyedge.co
              </a>
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white/60 font-light">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                Response within 24 hours
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
