import { FileText, Link as LinkIcon, Download } from "lucide-react";

const PLACEHOLDER_RESOURCES = [
  {
    title: "Resource Pack - Template",
    description: "Replace with your actual resource download link.",
    icon: Download,
    tag: "PDF",
  },
  {
    title: "Useful Link - Template",
    description: "Replace with a relevant tool or external link.",
    icon: LinkIcon,
    tag: "Link",
  },
  {
    title: "Guide - Template",
    description: "Replace with a step-by-step guide PDF.",
    icon: FileText,
    tag: "Guide",
  },
];

export default function GeneralResources() {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen">
      <div className="bg-white border-b border-[#E8E8E8]">
        <div className="px-6 py-6 md:px-10 lg:px-12">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111]">Resources</h1>
          <p className="text-sm text-[#666] mt-1.5 font-light">
            Everything you need to take action. Replace placeholders with your real resources.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-10 lg:px-12 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 max-w-2xl">
          <p className="text-sm text-amber-800 font-light">
            <span className="font-semibold">Template page:</span> These are placeholder resources. Replace each card with your actual download links, guides, or tools when you run a specific webinar.
          </p>
        </div>

        <div className="grid gap-4 max-w-2xl">
          {PLACEHOLDER_RESOURCES.map((resource) => (
            <div
              key={resource.title}
              className="bg-white border border-[#E8E8E8] rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow cursor-not-allowed opacity-70"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                <resource.icon className="w-5 h-5 text-[#888]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-semibold text-[#111]">{resource.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F0F0F0] text-[#888] px-2 py-0.5 rounded-full">
                    {resource.tag}
                  </span>
                </div>
                <p className="text-[12px] text-[#888] mt-1 font-light">{resource.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
