import { ArrowRight } from "lucide-react";
import coachSarah from "@/assets/coach-sarah.jpg";
import coachDavid from "@/assets/coach-david.jpg";
import coachJames from "@/assets/coach-james.jpg";
import coachEmily from "@/assets/coach-emily.jpg";

const reviews = [
  {
    name: "Tom H.",
    date: "December 2024",
    quote: "Sarah helped me nail my Goldman Sachs interviews. Her insights into the process were invaluable.",
    outcome: "Landed Goldman Spring Week",
    coachName: "Sarah K.",
    coachImg: coachSarah,
  },
  {
    name: "Priya S.",
    date: "November 2024",
    quote: "David's case interview prep was exactly what I needed. He made complex frameworks feel intuitive.",
    outcome: "McKinsey Summer Internship",
    coachName: "David W.",
    coachImg: coachDavid,
  },
  {
    name: "Alex M.",
    date: "October 2024",
    quote: "James reviewed my CV and helped me prepare for Meta interviews. Now I have a return offer!",
    outcome: "Meta SWE Internship",
    coachName: "James L.",
    coachImg: coachJames,
  },
  {
    name: "Sophie L.",
    date: "November 2024",
    quote: "Emily's guidance on vacation scheme applications was spot on. She knew exactly what firms look for.",
    outcome: "Clifford Chance TC",
    coachName: "Emily R.",
    coachImg: coachEmily,
  },
  {
    name: "Rahul K.",
    date: "December 2024",
    quote: "Got into Oxford PPE thanks to Sarah's interview coaching. She helped me think critically about my answers.",
    outcome: "Oxford PPE Offer",
    coachName: "Sarah K.",
    coachImg: coachSarah,
  },
  {
    name: "Emma W.",
    date: "October 2024",
    quote: "David's structured approach to consulting prep gave me confidence. Highly recommend!",
    outcome: "Bain Summer Intern",
    coachName: "David W.",
    coachImg: coachDavid,
  },
];

const Reviews = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-sans font-light text-foreground">
            Reviews
          </h2>
          <a
            href="#all-reviews"
            className="inline-flex items-center gap-1 text-sm font-sans font-light text-primary hover:underline"
          >
            See all
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Review Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 card-shadow hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="font-sans font-medium text-foreground">{review.name}</p>
                <p className="text-sm text-muted-foreground font-sans font-light">{review.date}</p>
              </div>
              
              {/* Quote */}
              <p className="text-muted-foreground mb-4 line-clamp-3 font-sans font-light">
                "{review.quote}"
              </p>
              
              {/* Outcome Badge */}
              <div className="inline-block bg-primary text-primary-foreground text-xs font-sans font-light px-3 py-1.5 rounded-full mb-4">
                {review.outcome}
              </div>
              
              {/* Coach */}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <img
                  src={review.coachImg}
                  alt={review.coachName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-sm text-muted-foreground font-sans font-light">
                  Coached by <span className="text-foreground font-medium">{review.coachName}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
