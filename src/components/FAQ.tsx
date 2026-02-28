import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const studentFAQs: FAQItem[] = [
    {
        question: "What is EarlyEdge?",
        answer:
            "EarlyEdge is a platform where students and recent graduates coach people one step behind them. Whether you're applying to university, preparing for admissions tests like UCAT, or going for Spring Weeks and internships, we match you with someone who just did it and can show you exactly how.",
    },
    {
        question: "How is this different from a normal tutor or career coach?",
        answer:
            "Traditional coaches charge £150+/hour and often did the thing years ago. Our coaches are students and recent grads who achieved what you're aiming for within the last 1–2 years. They remember the exact questions, the current process, and what actually worked — at a fraction of the price.",
    },
    {
        question: "How much does it cost?",
        answer:
            "Sessions start from £25/hour. Most coaches charge between £30–50. You can also book packages (bundles of sessions) at a discount. Every coach offers a free 10-minute intro call so you can see if they're the right fit before paying anything.",
    },
    {
        question: "What's a free intro call?",
        answer:
            "A 10-minute video call with a coach to chat about your goals, ask questions, and see if you're a good match. No charge, no commitment. If it's not the right fit, no worries.",
    },
    {
        question: "What can I get coached on?",
        answer:
            "Our coaches cover investment banking (Spring Weeks, summer internships), consulting (case interviews, applications), law (vacation schemes, training contracts), UCAT and medical school admissions, Oxbridge applications, personal statements, software engineering interviews, and more. Browse our coaches to see what's available.",
    },
    {
        question: "What happens if I'm not happy with my session?",
        answer:
            "We want you to have a great experience. If you're not satisfied with your first session, email us within 24 hours for a full refund. No questions asked.",
    },
    {
        question: "How do sessions work?",
        answer:
            "Sessions happen over video call (Zoom or Google Meet). You book a time that works for both you and your coach, and you'll receive a meeting link before your session. It's 1-on-1 and completely tailored to what you need help with.",
    },
];

const coachFAQs: FAQItem[] = [
    {
        question: "Who can become a coach?",
        answer:
            "Anyone who recently achieved something competitive. That could be landing a Spring Week, getting into Oxbridge, scoring in the top percentiles on UCAT, securing a training contract, or getting a tech internship. If you did it within the last 2–3 years and can help someone do the same, you can coach on EarlyEdge.",
    },
    {
        question: "How much can I earn?",
        answer:
            "You set your own prices and availability. Most coaches charge £30–50/hour. If you coach 5 hours a week at £40/hour, that's £200/week. Founding coaches keep 100% of their earnings for the first 3 months (normally we take 20%).",
    },
    {
        question: "How do I get paid?",
        answer:
            "Payments are handled securely through Stripe. You'll set up a Stripe account when you join, and earnings are transferred directly to your bank account.",
    },
];

const AccordionItem = ({
    item,
    isOpen,
    onToggle,
}: {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
}) => (
    <div className="border-b border-border last:border-b-0">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between py-5 px-1 text-left group transition-colors"
        >
            <span className="font-sans font-medium text-foreground text-base pr-6">
                {item.question}
            </span>
            <ChevronDown
                className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                    }`}
            />
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
                }`}
        >
            <p className="font-sans font-light text-muted-foreground text-sm leading-relaxed px-1">
                {item.answer}
            </p>
        </div>
    </div>
);

const FAQ = () => {
    const [activeTab, setActiveTab] = useState<"students" | "coaches">(
        "students"
    );
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const currentFAQs = activeTab === "students" ? studentFAQs : coachFAQs;

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleTabChange = (tab: "students" | "coaches") => {
        setActiveTab(tab);
        setOpenIndex(0);
    };

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                {/* Section heading */}
                <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-10 md:mb-14 text-center">
                    Frequently asked questions
                </h2>

                {/* Tab toggle */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex bg-secondary rounded-full p-1">
                        <button
                            onClick={() => handleTabChange("students")}
                            className={`px-5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 ${activeTab === "students"
                                    ? "bg-foreground text-background shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            For Students
                        </button>
                        <button
                            onClick={() => handleTabChange("coaches")}
                            className={`px-5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 ${activeTab === "coaches"
                                    ? "bg-foreground text-background shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            For Coaches
                        </button>
                    </div>
                </div>

                {/* Accordion */}
                <div className="max-w-2xl mx-auto">
                    {currentFAQs.map((item, index) => (
                        <AccordionItem
                            key={`${activeTab}-${index}`}
                            item={item}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
