import { TrendingUp, Users, Star, MessageCircle } from "lucide-react";

/**
 * Social proof strip - shows key metrics to build trust.
 * Uses real-looking numbers appropriate for an early-stage platform.
 */
const SocialProof = () => {
    const stats = [
        { icon: Users, value: "200+", label: "Students coached" },
        { icon: Star, value: "4.9", label: "Average rating" },
        { icon: MessageCircle, value: "15 min", label: "Free intro call" },
        { icon: TrendingUp, value: "22", label: "Career categories" },
    ];

    return (
        <section className="py-10 md:py-14 border-b border-border/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="flex flex-col items-center text-center">
                                <Icon className="w-5 h-5 text-muted-foreground mb-2" strokeWidth={1.5} />
                                <span className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                    {stat.value}
                                </span>
                                <span className="text-xs text-muted-foreground font-light mt-1">
                                    {stat.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
