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
    <section className="py-8 bg-background border-y border-border/50 w-full">
      <div className="w-full px-0">
        {/* Stats Line */}
        <p 
          className="text-center text-sm md:text-base tracking-wide text-foreground mb-8 px-4"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
        >
          Coaches From 50+ Universities and Firms
        </p>

        {/* Student Photos Scroll */}
        <div className="relative overflow-hidden w-full">
          <div className="flex gap-4 animate-slide-left hover:[animation-play-state:paused]" style={{ width: 'max-content' }}>
            {[...students, ...students, ...students, ...students].map((student, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img
                  src={student.img}
                  alt="Student"
                  className="w-28 h-28 md:w-36 md:h-36 rounded-lg object-cover ring-1 ring-foreground/20"
                />
                {/* Company logo placeholder */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 bg-card rounded-md shadow-md border border-border flex items-center justify-center">
                  <span className="text-[8px] text-muted-foreground font-medium">{student.badge.substring(0, 2)}</span>
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
