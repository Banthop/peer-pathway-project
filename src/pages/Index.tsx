import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import FeaturedCoaches from "@/components/FeaturedCoaches";
import ResourceBank from "@/components/ResourceBank";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import SeasonalBanner from "@/components/SeasonalBanner";
import ScrollReveal from "@/components/ScrollReveal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SeasonalBanner />
        <Hero />
        <SocialProof />
        <ScrollReveal delay={0.1}>
          <HowItWorks />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <FeaturedCoaches />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ResourceBank />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <FAQ />
        </ScrollReveal>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
