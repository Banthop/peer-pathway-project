 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import Header from "@/components/Header";
 import Footer from "@/components/Footer";
 import ScrollReveal from "@/components/ScrollReveal";
 import {
   ClipboardCheck,
   BadgeCheck,
   Settings,
   Wallet,
   Trophy,
   UserCircle,
   PoundSterling,
 } from "lucide-react";
 
 const steps = [
   {
     icon: ClipboardCheck,
     title: "Apply",
    description: "Tell us what you achieved and what you'd coach on. Takes 3 minutes.",
   },
   {
     icon: BadgeCheck,
     title: "Get verified",
    description: "We review your profile to keep quality high. Most hear back within 48 hours.",
   },
   {
     icon: Settings,
     title: "Set your terms",
    description: "You choose your rate, availability, and what you offer.",
   },
   {
     icon: Wallet,
     title: "Start earning",
    description: "Students book you, we handle the rest. You coach, you get paid.",
   },
 ];
 
 const benefits = [
   {
     icon: Trophy,
    title: "You're already qualified",
     description: "You don't need years of experience. You just did it, that's exactly what students need.",
   },
   {
     icon: UserCircle,
    title: "Build your reputation",
    description: "Grow your profile, collect reviews, add 'EarlyEdge Coach' to your LinkedIn.",
   },
   {
     icon: PoundSterling,
    title: "Earn on your schedule",
     description: "Set your own rate (most charge £30–50/hr). Coach 2 hours a week or 20, your call.",
   },
 ];
 
 const BecomeACoach = () => {
   return (
     <div className="min-h-screen bg-background">
       <Header />
       <main>
         {/* Hero Section */}
          <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-background">
           <div className="container mx-auto px-4 text-center">
             <ScrollReveal>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
                  You figured it out. Now earn from it.
               </h1>
             </ScrollReveal>
             <ScrollReveal delay={0.1}>
               <p className="text-lg md:text-xl font-sans font-light text-muted-foreground mb-8 max-w-2xl mx-auto">
                You landed the offer, got into the uni, aced the test. Help students one step behind you - and get paid while you're at it.
               </p>
             </ScrollReveal>
             <ScrollReveal delay={0.2}>
               <div className="flex flex-col items-center gap-3">
                 <Button
                   size="lg"
                   className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium px-8 py-6 text-base"
                 >
                    Become a Coach
                 </Button>
                 <span className="text-sm font-sans font-light text-muted-foreground">
                    3 minute application
                 </span>
               </div>
             </ScrollReveal>
           </div>
         </section>
 
          {/* How It Works Section */}
           <section className="py-12 md:py-16 bg-background">
           <div className="container mx-auto px-4">
             <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-10 md:mb-12 text-center">
                 How it works
               </h2>
             </ScrollReveal>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {steps.map((step, index) => (
                 <ScrollReveal key={step.title} delay={index * 0.1}>
                   <div className="flex flex-col items-center text-center">
                     <div className="relative mb-6">
                       <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center shadow-md">
                         <step.icon className="text-background" size={28} strokeWidth={1.5} />
                       </div>
                       <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-sans font-medium">
                         {index + 1}
                       </span>
                     </div>
                     <h3 className="text-xl font-sans font-medium text-foreground mb-3">
                       {step.title}
                     </h3>
                     <p className="font-sans font-light text-muted-foreground max-w-[250px]">
                       {step.description}
                     </p>
                   </div>
                 </ScrollReveal>
               ))}
             </div>
           </div>
         </section>
 
        {/* Why Coach Section */}
           <section className="py-12 md:py-16 bg-background">
           <div className="container mx-auto px-4">
             <ScrollReveal>
                 <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-10 md:mb-12 text-center">
                  Why coach on EarlyEdge
               </h2>
             </ScrollReveal>

              {/* Benefit cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={benefit.title} delay={index * 0.1}>
                  <div className="group flex flex-col items-center text-center p-6 md:p-8 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-border transition-all duration-300 hover:scale-[1.02]">
                    <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="text-background" size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-foreground mb-3 font-sans font-medium text-xl">
                      {benefit.title}
                    </h3>
                    <p className="max-w-[280px] font-sans font-light text-base leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

              {/* Time commitment - FEATURED CALLOUT */}
               <ScrollReveal delay={0.3} className="w-full">
                 <div className="max-w-xl mx-auto py-5 px-6 md:py-6 md:px-8 rounded-xl bg-secondary/30 text-center w-full">
                   <p className="text-lg md:text-xl font-sans font-medium text-foreground mb-1">
                    Less effort than a part-time job.
                  </p>
                   <p className="text-sm md:text-base font-sans font-light text-muted-foreground">
                    A couple hours a week, on your schedule, from your laptop.
                  </p>
                </div>
              </ScrollReveal>
           </div>
         </section>

          {/* Did You Section - Qualifier */}
           <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4 text-center">
              <ScrollReveal>
                 <h2 className="text-2xl md:text-3xl font-sans font-extralight text-foreground mb-3">
                  Did you...
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                 <p className="text-base md:text-lg font-sans font-light text-muted-foreground mb-4 max-w-3xl mx-auto">
                  Get into Oxford? Land a Spring Week? Score 3000+ on UCAT? Secure a TC at a magic circle firm? Break into consulting?
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                 <p className="text-lg md:text-xl font-sans font-medium text-foreground mb-5">
                  Then you're ready.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <Button
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium px-8 py-6 text-base"
                >
                  Become a Coach
                </Button>
              </ScrollReveal>
            </div>
          </section>
 
         {/* Final CTA Section */}
          <section className="py-12 md:py-16 bg-foreground">
           <div className="container mx-auto px-4 text-center">
             <ScrollReveal>
               <h2 className="text-3xl md:text-4xl font-sans font-extralight text-background mb-4 max-w-3xl mx-auto">
                  Your experience is valuable. Literally.
               </h2>
             </ScrollReveal>
             <ScrollReveal delay={0.1}>
               <p className="text-lg font-sans font-light text-background/80 mb-8">
                  Students want help from someone who just did what they're trying to do. That's you.
               </p>
             </ScrollReveal>
             <ScrollReveal delay={0.2}>
               <div className="flex flex-col items-center gap-3">
                 <Button
                   size="lg"
                   className="bg-background text-foreground hover:bg-background/90 font-sans font-medium px-8 py-6 text-base"
                 >
                    Become a Coach
                 </Button>
                 <span className="text-sm font-sans font-light text-background/60">
                    No commitment. Leave whenever.
                 </span>
               </div>
             </ScrollReveal>
           </div>
         </section>
       </main>
       <Footer />
     </div>
   );
 };
 
 export default BecomeACoach;