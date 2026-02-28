import { useState } from "react";
import { FileText, Video, Link2, Bookmark, ArrowRight, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import coachSarah from "@/assets/coach-sarah.jpg";
import coachDavid from "@/assets/coach-david.jpg";
import coachJames from "@/assets/coach-james.jpg";
import coachEmily from "@/assets/coach-emily.jpg";

type ResourceType = "article" | "video" | "template" | "guide";

interface Resource {
    id: number;
    title: string;
    description: string;
    type: ResourceType;
    category: string;
    coachName: string;
    coachImage: string;
    coachCredential: string;
    timeAgo: string;
    readTime?: string;
}

const resources: Resource[] = [
    {
        id: 1,
        title: "How I Landed a Spring Week at Goldman Sachs — Step by Step",
        description:
            "Everything I did from October to December. The application timeline, what I wrote in my cover letter, how I prepped for the online tests, and what actually came up in my interview. No fluff — just what worked.",
        type: "guide",
        category: "Investment Banking",
        coachName: "Sarah K.",
        coachImage: coachSarah,
        coachCredential: "Oxford PPE '24 · Goldman Sachs",
        timeAgo: "2 days ago",
        readTime: "8 min read",
    },
    {
        id: 2,
        title: "The 5 Case Frameworks That Got Me Into McKinsey",
        description:
            "Forget memorising 20 different frameworks. These are the 5 I actually used in every case interview, from first round to final. I break down when to use each one and show real examples.",
        type: "article",
        category: "Consulting",
        coachName: "David W.",
        coachImage: coachDavid,
        coachCredential: "Cambridge Economics · McKinsey",
        timeAgo: "4 days ago",
        readTime: "6 min read",
    },
    {
        id: 3,
        title: "My Vacation Scheme Application — What Actually Made It Stand Out",
        description:
            "I applied to 12 firms and got offers from 3. Here's the exact approach I took to commercial awareness questions, the research I did before each application, and the one thing most applicants get wrong.",
        type: "article",
        category: "Law",
        coachName: "Emily R.",
        coachImage: coachEmily,
        coachCredential: "LSE Law · Clifford Chance",
        timeAgo: "1 week ago",
        readTime: "7 min read",
    },
    {
        id: 4,
        title: "UCAT Prep: How I Scored 3100+ in 6 Weeks",
        description:
            "My week-by-week study plan, the free and paid resources I used, time management strategies for each section, and the practice test scores that show my progression.",
        type: "guide",
        category: "UCAT",
        coachName: "Sarah K.",
        coachImage: coachSarah,
        coachCredential: "Oxford PPE '24 · Goldman Sachs",
        timeAgo: "1 week ago",
        readTime: "10 min read",
    },
    {
        id: 5,
        title: "System Design Interview Template (Google SWE)",
        description:
            "The exact template I used to structure every system design answer. Covers requirement gathering, high-level design, deep dives, and trade-off discussions. Includes 3 worked examples.",
        type: "template",
        category: "Software Engineering",
        coachName: "James L.",
        coachImage: coachJames,
        coachCredential: "Imperial Computing · Google",
        timeAgo: "2 weeks ago",
        readTime: "5 min read",
    },
    {
        id: 6,
        title: "How to Write an Oxbridge Personal Statement That Gets Interviews",
        description:
            "I read 50+ successful personal statements before writing mine. Here are the patterns that work, the mistakes everyone makes, and a paragraph-by-paragraph structure you can follow.",
        type: "guide",
        category: "Oxbridge",
        coachName: "David W.",
        coachImage: coachDavid,
        coachCredential: "Cambridge Economics · McKinsey",
        timeAgo: "2 weeks ago",
        readTime: "9 min read",
    },
];

const categories = [
    "All",
    "Investment Banking",
    "Consulting",
    "Law",
    "UCAT",
    "Oxbridge",
    "Software Engineering",
];

const typeIcons: Record<ResourceType, typeof FileText> = {
    article: FileText,
    video: Video,
    template: Download,
    guide: Bookmark,
};

const typeLabels: Record<ResourceType, string> = {
    article: "Article",
    video: "Video",
    template: "Template",
    guide: "Guide",
};

const ResourceBank = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredResources =
        selectedCategory === "All"
            ? resources
            : resources.filter((r) => r.category === selectedCategory);

    return (
        <section className="py-16 md:py-24 bg-[#FAFAFA]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-foreground text-background rounded-full text-xs font-sans font-semibold uppercase tracking-wider mb-5">
                        <span>Free</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-3">
                        Resource Bank
                    </h2>
                    <p className="text-muted-foreground font-sans font-light text-base max-w-lg mx-auto">
                        Free guides, templates, and insights from coaches who've been there. Browse by category or scroll the feed.
                    </p>
                </div>

                {/* Category filter pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-10 mt-8">
                    {categories.map((cat) => (
                        <Badge
                            key={cat}
                            variant="outline"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 text-sm cursor-pointer font-sans font-light transition-colors ${selectedCategory === cat
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background text-foreground border-border hover:border-foreground"
                                }`}
                        >
                            {cat}
                        </Badge>
                    ))}
                </div>

                {/* Resource feed — LinkedIn-style cards */}
                <div className="max-w-2xl mx-auto space-y-4">
                    {filteredResources.map((resource) => {
                        const TypeIcon = typeIcons[resource.type];

                        return (
                            <div
                                key={resource.id}
                                className="bg-card rounded-xl border border-border/50 p-6 hover:border-border hover:shadow-md transition-all duration-300 group cursor-pointer"
                            >
                                {/* Author header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src={resource.coachImage}
                                        alt={resource.coachName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-sans font-medium text-sm text-foreground">
                                            {resource.coachName}
                                        </p>
                                        <p className="font-sans font-light text-xs text-muted-foreground truncate">
                                            {resource.coachCredential}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-sans font-light shrink-0">
                                        {resource.timeAgo}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="font-sans font-semibold text-foreground text-base mb-2 group-hover:underline decoration-foreground/20 underline-offset-2">
                                    {resource.title}
                                </h3>
                                <p className="font-sans font-light text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                                    {resource.description}
                                </p>

                                {/* Footer: type badge + category + read time */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary rounded-full text-xs font-sans font-light text-muted-foreground">
                                            <TypeIcon className="w-3 h-3" />
                                            {typeLabels[resource.type]}
                                        </span>
                                        <span className="px-2.5 py-1 bg-secondary rounded-full text-xs font-sans font-light text-muted-foreground">
                                            {resource.category}
                                        </span>
                                        {resource.readTime && (
                                            <span className="text-xs text-muted-foreground font-sans font-light">
                                                · {resource.readTime}
                                            </span>
                                        )}
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View all CTA */}
                <div className="text-center mt-10">
                    <Button
                        variant="outline"
                        className="font-sans font-light border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors px-6"
                    >
                        Browse all resources
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ResourceBank;
