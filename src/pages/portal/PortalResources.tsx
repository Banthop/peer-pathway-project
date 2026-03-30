import { useBuyerAuth } from "@/contexts/BuyerAuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, CheckSquare, ExternalLink, Download, FileText, Lock } from "lucide-react";

const GUIDE_LINK = "https://earlyedge-1758913924.subpage.co/Cold-Email-System-copy75c6db62";
const CHECKLIST_LINK = "https://webinar.yourearlyedge.co.uk/resources/cold-email-checklist";

interface ResourceItem {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  gradient: string;
  bundleOnly: boolean;
  type: string;
}

const resources: ResourceItem[] = [
  {
    title: "The Cold Email Guide 2.0",
    description:
      "The complete system Uthman used to land 20 internship offers. Email templates, follow-up sequences, lead generation, and the exact strategies that work.",
    icon: BookOpen,
    link: GUIDE_LINK,
    gradient: "from-[#111] to-[#333]",
    bundleOnly: true,
    type: "Guide",
  },
  {
    title: "Cold Email Checklist",
    description:
      "A quick reference checklist covering every step from finding leads to sending your first batch. Print it out and tick off each step.",
    icon: CheckSquare,
    link: CHECKLIST_LINK,
    gradient: "from-emerald-700 to-emerald-900",
    bundleOnly: false,
    type: "Checklist",
  },
];

export default function PortalResources() {
  const { buyerStatus } = useBuyerAuth();
  const isBundle = buyerStatus?.isBundle ?? false;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 md:px-10 lg:px-12">
        <p className="text-xs text-[#999] font-medium uppercase tracking-wider mb-1">
          Your Materials
        </p>
        <h1 className="text-2xl md:text-[26px] font-semibold tracking-tight text-[#111]">
          Resources
        </h1>
        <p className="text-sm text-[#888] mt-1 font-light">
          Everything included with your purchase
        </p>
      </div>

      {/* Resource grid */}
      <div className="px-6 md:px-10 lg:px-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {resources.map((resource) => {
            const locked = resource.bundleOnly && !isBundle;
            const Icon = resource.icon;

            return (
              <div
                key={resource.title}
                className={`bg-white border border-[#E8E8E8] rounded-xl overflow-hidden transition-all duration-200 ${
                  locked ? "opacity-60" : "hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                {/* Gradient header */}
                <div
                  className={`relative h-28 bg-gradient-to-br ${resource.gradient} px-5 py-4 flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {resource.type}
                    </span>
                    {locked && (
                      <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Bundle only
                      </span>
                    )}
                  </div>
                  <h3 className="text-white text-sm font-semibold leading-snug">
                    {resource.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="px-5 py-4">
                  <p className="text-[12px] text-[#888] leading-relaxed mb-4">
                    {resource.description}
                  </p>

                  {locked ? (
                    <div className="bg-[#F8F8F8] border border-[#E8E8E8] rounded-lg px-4 py-3 text-center">
                      <p className="text-[12px] text-[#999] font-light">
                        Upgrade to the bundle to unlock this resource
                      </p>
                    </div>
                  ) : (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-lg bg-[#111] text-white text-xs font-semibold hover:bg-[#222] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Resource
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bundle upgrade prompt for webinar-only buyers */}
        {!isBundle && (
          <div className="mt-8 bg-gradient-to-br from-[#F8F8F8] to-white border border-[#E8E8E8] rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#111] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#111]">
                  Want the full Cold Email Guide?
                </h3>
                <p className="text-sm text-[#888] font-light mt-1 leading-relaxed">
                  The guide contains every template, the 200+ firm list, follow-up sequences,
                  and the complete system. Most students who use it start sending emails the same day.
                </p>
                <a
                  href="https://buy.stripe.com/3cI14m1Uw11n4mC4WE2400c"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#111] text-white rounded-lg text-sm font-semibold hover:bg-[#222] transition-colors"
                >
                  Upgrade for £12
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
