import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import PopularCategories from "@/components/PopularCategories";
import FeaturedCoaches from "@/components/FeaturedCoaches";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import FloatingLogosSection from "@/components/FloatingLogosSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <PopularCategories />
        <FeaturedCoaches />
        <HowItWorks />
        <Reviews />
        <FloatingLogosSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
