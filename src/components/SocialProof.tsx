import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import student3 from "@/assets/student-3.jpg";
import student4 from "@/assets/student-4.jpg";
import student5 from "@/assets/student-5.jpg";
import student6 from "@/assets/student-6.jpg";

const students = [
  { img: student1, badge: "Oxford" },
  { img: student2, badge: "Goldman" },
  { img: student3, badge: "Cambridge" },
  { img: student4, badge: "McKinsey" },
  { img: student5, badge: "Imperial" },
  { img: student6, badge: "Clifford Chance" },
];

const SocialProof = () => {
  return (
    <section className="py-10 bg-secondary/50 border-y border-border/50">
      <div className="container mx-auto px-4">
        {/* Stats Line */}
        <p className="text-center text-sm md:text-base tracking-wide text-muted-foreground mb-8">
          <span className="font-medium text-foreground">JOIN 1,000+ STUDENTS ACHIEVING THEIR GOALS</span>
          <span className="mx-3">·</span>
          <span>⭐ 500+ REVIEWS (AVG 4.98)</span>
        </p>

        {/* Student Photos Scroll */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-slide-left hover:[animation-play-state:paused]">
            {[...students, ...students, ...students].map((student, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img
                  src={student.img}
                  alt="Student"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover grayscale"
                />
                <div className="absolute -bottom-1 -right-1 bg-card text-[10px] px-1.5 py-0.5 rounded-full shadow-sm text-muted-foreground font-medium">
                  {student.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
