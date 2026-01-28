import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import PopularCategories from "@/components/PopularCategories";
import FeaturedCoaches from "@/components/FeaturedCoaches";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import LogosBar from "@/components/LogosBar";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ScrollReveal>
          <SocialProof />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <PopularCategories />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <FeaturedCoaches />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Reviews />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <LogosBar />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <FinalCTA />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
