import { Button } from "@/components/ui/button";
import { STRIPE_SW_PREPARE, STRIPE_SW_CONVERT } from "@/data/springWeekData";
import {
  CheckCircle2,
  Shield,
  FileText,
  Sparkles,
  Crown,
  Users,
} from "lucide-react";

interface SpringWeekPrepConversionProps {
  formData: {
    firstName: string;
    email: string;
    springWeekFirms: string;
    biggestConcern: string;
    industry: string;
  };
  onGetFreeDoc: () => void;
}

function buildStripeLink(base: string, email: string): string {
  const encoded = encodeURIComponent(email);
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}prefilled_email=${encoded}`;
}

const FREE_FEATURES = [
  "Key takeaways from converters",
  "Common mistakes to avoid",
  "Division-specific prep tips",
];

const PREPARE_FEATURES = [
  "Live panel this Sunday 2-5pm with all speakers",
  "Full recording if you can't make it live",
  "Spring Week Handbook covering 45+ firms, firm by firm",
  "Know your firm's conversion rate before you walk in",
];

const CONVERT_FEATURES_BASE = [
  "1 free prep call with someone who converted at YOUR firm (worth \u00A360)",
  "They'll tell you what the week is really like and what got them the offer",
  "Priority booking for additional prep calls",
];

function getConvertFeatures(firm: string): string[] {
  if (!firm) return CONVERT_FEATURES_BASE;
  return [
    `1 free prep call with someone who converted at ${firm} (worth \u00A360)`,
    "They'll tell you what the week is really like and what got them the offer",
    "Priority booking for additional prep calls",
  ];
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-sm">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export function SpringWeekPrepConversion({
  formData,
  onGetFreeDoc,
}: SpringWeekPrepConversionProps) {
  const { firstName, email, springWeekFirms: firm } = formData;

  const prepareLink = buildStripeLink(STRIPE_SW_PREPARE, email);
  const convertLink = buildStripeLink(STRIPE_SW_CONVERT, email);
  const convertFeatures = getConvertFeatures(firm);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      {/* Personalised Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Here's your plan, {firstName}
        </h1>
        {firm ? (
          <p className="text-gray-600 text-lg">
            Your spring week at {firm} starts soon. Here's how to make sure you
            convert.
          </p>
        ) : (
          <p className="text-gray-600 text-lg">
            Your spring week starts soon. Here's how to make sure you convert.
          </p>
        )}
      </div>

      {/* Tier Cards */}
      <div className="space-y-5">
        {/* TIER 1 - Free Doc (subtle) */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" />
            <h2 className="font-semibold text-gray-700">Free Doc</h2>
          </div>
          <p className="text-sm text-gray-500">
            Spring Week Conversion Notes
          </p>
          <FeatureList features={FREE_FEATURES} />
          <div className="pt-2 space-y-1.5">
            <Button
              variant="outline"
              className="w-full"
              onClick={onGetFreeDoc}
            >
              Get the Free Doc
            </Button>
            <p className="text-xs text-center text-gray-400">
              Delivered to your inbox
            </p>
          </div>
        </div>

        {/* TIER 2 - Prepare (RECOMMENDED, highlighted) */}
        <div className="relative rounded-xl border-2 border-emerald-500 bg-white p-6 space-y-4 shadow-md">
          <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-semibold text-white">
            <Sparkles className="h-3 w-3" />
            RECOMMENDED
          </span>
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-xl font-bold text-gray-900">Prepare</h2>
            <span className="text-2xl font-bold text-emerald-600">
              &pound;39
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Everything in the free doc, plus:
          </p>
          <FeatureList features={PREPARE_FEATURES} />
          <div className="pt-2">
            <a href={prepareLink} className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Get Prepare Tier
              </Button>
            </a>
          </div>
        </div>

        {/* TIER 3 - Convert (premium, dark) */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Convert</h2>
            </div>
            <span className="text-2xl font-bold text-white">&pound;69</span>
          </div>
          <p className="text-sm text-gray-400">
            Everything in Prepare, plus:
          </p>
          <ul className="space-y-3">
            {convertFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-gray-200"
              >
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <a href={convertLink} className="block">
              <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                Get Convert Tier
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Social Proof Bar */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Users className="h-4 w-4" />
        <span>
          Students from LSE, Warwick, UCL, Imperial, Bristol, Oxford and
          Cambridge
        </span>
      </div>

      {/* Risk Reversal */}
      <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
        <Shield className="h-5 w-5 text-emerald-500 shrink-0" />
        <p className="text-sm text-gray-600">
          Not what you expected? Full refund, no questions asked.
        </p>
      </div>
    </div>
  );
}
