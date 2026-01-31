import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoachHero from "@/components/coach/CoachHero";
import CoachAbout from "@/components/coach/CoachAbout";
import CoachServices from "@/components/coach/CoachServices";
import CoachExperience from "@/components/coach/CoachExperience";
import CoachEducation from "@/components/coach/CoachEducation";
import CoachReviews from "@/components/coach/CoachReviews";
import BookingSidebar from "@/components/coach/BookingSidebar";
import MobileBookingBar from "@/components/coach/MobileBookingBar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCoachById } from "@/data/sampleCoach";

const CoachProfile = () => {
  const { coachId } = useParams<{ coachId: string }>();
  const coach = getCoachById(coachId || "");

  if (!coach) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <p className="text-center text-muted-foreground font-sans font-light">
            Coach not found
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/"
                  className="font-sans font-light text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="font-sans font-light text-muted-foreground hover:text-foreground"
              >
                Coaches
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-sans font-light">
                {coach.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <CoachHero coach={coach} />
            <CoachAbout coach={coach} />
            <CoachServices coach={coach} />
            <CoachExperience coach={coach} />
            <CoachEducation coach={coach} />
            <CoachReviews coach={coach} />
          </div>

          {/* Sticky Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <BookingSidebar coach={coach} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Booking Bar */}
      <MobileBookingBar coach={coach} />

      <Footer />
    </div>
  );
};

export default CoachProfile;
