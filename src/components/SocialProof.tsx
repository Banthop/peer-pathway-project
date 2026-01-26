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
    <section className="py-10 bg-secondary/50 border-y border-border/50 w-full">
      <div className="w-full px-0">
        {/* Stats Line */}
        <p className="text-center text-sm md:text-base tracking-wide text-muted-foreground mb-8 px-4">
          <span className="font-medium text-foreground">JOIN 1,000+ STUDENTS ACHIEVING THEIR GOALS</span>
          <span className="mx-3">·</span>
          <span>⭐ 500+ REVIEWS (AVG 4.98)</span>
        </p>

        {/* Student Photos Scroll */}
        <div className="relative overflow-hidden w-full">
          <div className="flex gap-4 animate-slide-left hover:[animation-play-state:paused]">
            {[...students, ...students, ...students].map((student, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img
                  src={student.img}
                  alt="Student"
                  className="w-28 h-28 md:w-36 md:h-36 rounded-lg object-cover"
                  style={{ filter: 'saturate(1.1)' }}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card text-xs px-2 py-1 rounded-full shadow-sm text-muted-foreground font-medium whitespace-nowrap">
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
