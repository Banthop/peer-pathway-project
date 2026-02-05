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
   Quote,
 } from "lucide-react";
 
 const steps = [
   {
     icon: ClipboardCheck,
     title: "Apply",
     description: "Fill out a quick form with your credentials and what you'd coach on",
   },
   {
     icon: BadgeCheck,
     title: "Get verified",
     description: "We check your LinkedIn to make sure you're legit",
   },
   {
     icon: Settings,
     title: "Set your terms",
     description: "Choose your prices, availability, and services",
   },
   {
     icon: Wallet,
     title: "Start earning",
     description: "Students book you, we handle payments, you coach and get paid",
   },
 ];
 
 const benefits = [
   {
     icon: Trophy,
     title: "You're more qualified than you think",
     description: "You don't need 10 years of experience. You just did it — that's exactly what students need.",
   },
   {
     icon: UserCircle,
     title: "Build your personal brand",
     description: "Your profile, reviews, and sessions help you stand out. Some coaches add \"EarlyEdge Coach\" to their LinkedIn.",
   },
   {
     icon: PoundSterling,
     title: "Earn on your terms",
     description: "Set your own prices (most charge £30–50/hr). Keep 80% after your first 5 sessions. Coach 2 hours a week or 20.",
   },
 ];
 
 const categories = [
   { name: "Investment Banking", subtitle: "Spring Weeks, Internships" },
   { name: "Consulting", subtitle: "MBB, Big 4" },
   { name: "Law", subtitle: "Vacation Schemes, Training Contracts" },
   { name: "Oxbridge Applications", subtitle: "" },
   { name: "UCAT / Medicine", subtitle: "" },
   { name: "Software Engineering", subtitle: "" },
 ];
 
 const stats = [
   { value: "£30–50", label: "per hour, typical" },
   { value: "80%", label: "yours after 5 sessions" },
   { value: "£200+", label: "average monthly (5 hrs/week)" },
 ];
 
 const testimonials = [
   {
     quote: "I wished I had someone like me when I was applying. Now I get to be that person — and get paid for it.",
     name: "James T.",
     credential: "Goldman Spring Week '24",
     initials: "JT",
   },
   {
     quote: "Coaching fits perfectly around my degree. I do 3–4 sessions a week and it covers my rent.",
     name: "Priya M.",
     credential: "Oxford Law '25",
     initials: "PM",
   },
   {
     quote: "Students message me saying they got the offer. That feeling is incredible — and the money doesn't hurt either.",
     name: "Alex R.",
     credential: "McKinsey Intern '24",
     initials: "AR",
   },
 ];
 
 const BecomeACoach = () => {
   return (
     <div className="min-h-screen bg-background">
       <Header />
       <main>
         {/* Hero Section */}
         <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-background">
           <div className="container mx-auto px-4 text-center">
             <ScrollReveal>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
                 You did it. Now get paid to teach it.
               </h1>
             </ScrollReveal>
             <ScrollReveal delay={0.1}>
               <p className="text-lg md:text-xl font-sans font-light text-muted-foreground mb-8 max-w-2xl mx-auto">
                 Got a Spring Week, training contract, or top uni offer? Students will pay to learn exactly how you did it.
               </p>
             </ScrollReveal>
             <ScrollReveal delay={0.2}>
               <div className="flex flex-col items-center gap-3">
                 <Button
                   size="lg"
                   className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium px-8 py-6 text-base"
                 >
                   Apply to Coach
                 </Button>
                 <span className="text-sm font-sans font-light text-muted-foreground">
                   Takes 3 minutes
                 </span>
               </div>
             </ScrollReveal>
           </div>
         </section>
 
         {/* How It Works Section */}
         <section className="py-16 md:py-24 bg-secondary/30">
           <div className="container mx-auto px-4">
             <ScrollReveal>
               <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-12 md:mb-16 text-center">
                 How it works
               </h2>
             </ScrollReveal>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {steps.map((step, index) => (
                 <ScrollReveal key={step.title} delay={index * 0.1}>
                   <div className="flex flex-col items-center text-center">
                     {/* Step number and icon */}
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
         <section className="py-16 md:py-24 bg-background">
           <div className="container mx-auto px-4">
             <ScrollReveal>
               <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-12 md:mb-16 text-center">
                 Why coach on EarlyEdge
               </h2>
             </ScrollReveal>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
           </div>
         </section>
 
         {/* Who We're Looking For Section */}
         <section className="py-16 md:py-24 bg-secondary/30">
           <div className="container mx-auto px-4 text-center">
             <ScrollReveal>
               <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-6">
                 Who we're looking for
               </h2>
             </ScrollReveal>
             <ScrollReveal delay={0.1}>
               <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
                 {categories.map((category) => (
                   <div
                     key={category.name}
                     className="px-5 py-3 rounded-full border border-border bg-background text-foreground font-sans font-light text-sm md:text-base hover:bg-foreground hover:text-background transition-colors cursor-default"
                   >
                     {category.name}
                     {category.subtitle && (
                       <span className="text-muted-foreground ml-1">({category.subtitle})</span>
                     )}
                   </div>
                 ))}
               </div>
             </ScrollReveal>
             <ScrollReveal delay={0.2}>
               <p className="font-sans font-light text-muted-foreground max-w-xl mx-auto">
                 Recently achieved something competitive? You're exactly who students want to learn from.
               </p>
             </ScrollReveal>
           </div>
         </section>
 
         {/* Earnings Stats Section */}
         <section className="py-16 md:py-24 bg-background">
           <div className="container mx-auto px-4">
             <ScrollReveal>
               <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-12 md:mb-16 text-center">
                 What you could earn
               </h2>
             </ScrollReveal>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
               {stats.map((stat, index) => (
                 <ScrollReveal key={stat.label} delay={index * 0.1}>
                   <div className="text-center">
                     <div className="text-4xl md:text-5xl font-sans font-light text-foreground mb-2">
                       {stat.value}
                     </div>
                     <div className="font-sans font-light text-muted-foreground">
                       {stat.label}
                     </div>
                   </div>
                 </ScrollReveal>
               ))}
             </div>
           </div>
         </section>
 
         {/* Testimonials Section */}
         <section className="py-16 md:py-24 bg-secondary/30">
           <div className="container mx-auto px-4">
             <ScrollReveal>
               <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-12 md:mb-16 text-center">
                 Hear from our coaches
               </h2>
             </ScrollReveal>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
               {testimonials.map((testimonial, index) => (
                 <ScrollReveal key={testimonial.name} delay={index * 0.1}>
                   <div className="flex flex-col p-6 md:p-8 rounded-xl bg-card border border-border/50 shadow-sm h-full">
                     <Quote className="text-muted-foreground/30 mb-4" size={32} />
                     <p className="font-sans font-light text-foreground mb-6 flex-grow leading-relaxed">
                       "{testimonial.quote}"
                     </p>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-sans font-medium text-sm">
                         {testimonial.initials}
                       </div>
                       <div>
                         <div className="font-sans font-medium text-foreground text-sm">
                           {testimonial.name}
                         </div>
                         <div className="font-sans font-light text-muted-foreground text-sm">
                           {testimonial.credential}
                         </div>
                       </div>
                     </div>
                   </div>
                 </ScrollReveal>
               ))}
             </div>
           </div>
         </section>
 
         {/* Final CTA Section */}
         <section className="py-16 md:py-24 bg-foreground">
           <div className="container mx-auto px-4 text-center">
             <ScrollReveal>
               <h2 className="text-3xl md:text-4xl font-sans font-extralight text-background mb-4 max-w-3xl mx-auto">
                 Got into Oxford? Landed Goldman? Secured a TC at a magic circle firm?
               </h2>
             </ScrollReveal>
             <ScrollReveal delay={0.1}>
               <p className="text-lg font-sans font-light text-background/80 mb-8">
                 Students are looking for someone exactly like you.
               </p>
             </ScrollReveal>
             <ScrollReveal delay={0.2}>
               <div className="flex flex-col items-center gap-3">
                 <Button
                   size="lg"
                   className="bg-background text-foreground hover:bg-background/90 font-sans font-medium px-8 py-6 text-base"
                 >
                   Apply to Coach
                 </Button>
                 <span className="text-sm font-sans font-light text-background/60">
                   Takes 3 minutes. No commitment. Leave anytime.
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