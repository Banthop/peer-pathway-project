import { FileText, Download, ChevronRight, LayoutTemplate } from "lucide-react";

export default function GeneralResources() {
  const genericResources = [
    {
      title: "[Topic Placeholder] Checklist",
      description: "A comprehensive checklist covering the main concepts from the webinar.",
      type: "PDF Document",
      icon: FileText,
      link: "#",
    },
    {
      title: "[Secondary Resource] Template",
      description: "A template you can use specifically designed to streamline your workflow.",
      type: "Google Doc",
      icon: LayoutTemplate,
      link: "#",
    },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8] pt-12 pb-10 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111] text-white text-[11px] font-semibold tracking-wider uppercase mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Included Materials
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#111] mb-4">
            Webinar Resources
          </h1>
          <p className="text-base text-[#666] max-w-2xl font-light leading-relaxed">
            All the additional slides, templates, and standard frameworks discussed during the webinar are stored securely below.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-10">
        <div className="grid md:grid-cols-2 gap-6">
          {genericResources.map((resource, i) => (
            <a
              key={i}
              href={resource.link}
              onClick={(e) => e.preventDefault()}
              className="group bg-white border border-[#E8E8E8] rounded-2xl p-6 hover:shadow-lg hover:border-[#DDD] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300 text-[#111]">
                {resource.type === "PDF Document" ? <Download className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </div>

              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                <resource.icon className="w-6 h-6 stroke-[1.5]" />
              </div>

              <h3 className="text-lg font-bold text-[#111] mb-2 pr-8">{resource.title}</h3>
              <p className="text-sm text-[#666] mb-5 font-light leading-relaxed">{resource.description}</p>
              
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#999] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0E0E0] group-hover:bg-emerald-400 transition-colors" />
                {resource.type}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
