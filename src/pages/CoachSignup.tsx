 import { useState } from "react";
 import { Link } from "react-router-dom";
 import AuthLayout from "@/components/auth/AuthLayout";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 import { Linkedin } from "lucide-react";
 
 const CoachSignup = () => {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
 
   const handleLinkedInSignup = () => {
     // Will be connected to LinkedIn OAuth later
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     // Will be connected to Supabase later
   };
 
   return (
     <AuthLayout>
       <div className="text-center mb-8">
         <h1 className="text-3xl font-sans font-light text-foreground">
           Apply to coach
         </h1>
         <p className="text-sm font-sans font-light text-muted-foreground mt-2">
           This takes about 3 minutes
         </p>
       </div>
 
       {/* LinkedIn Button */}
       <Button
         type="button"
         onClick={handleLinkedInSignup}
         className="w-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 font-sans font-light mb-6"
       >
         <Linkedin className="w-5 h-5 mr-2" />
         Continue with LinkedIn
       </Button>
 
       {/* Divider */}
       <div className="relative mb-6">
         <div className="absolute inset-0 flex items-center">
           <span className="w-full border-t border-border" />
         </div>
         <div className="relative flex justify-center text-xs uppercase">
           <span className="bg-background px-2 text-muted-foreground font-sans">
             or
           </span>
         </div>
       </div>
 
       <form onSubmit={handleSubmit} className="space-y-4">
         <div className="space-y-2">
           <Label htmlFor="name" className="font-sans font-light">
             Name
           </Label>
           <Input
             id="name"
             type="text"
             placeholder="Your name"
             value={name}
             onChange={(e) => setName(e.target.value)}
             className="font-sans"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="email" className="font-sans font-light">
             Email
           </Label>
           <Input
             id="email"
             type="email"
             placeholder="you@example.com"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             className="font-sans"
           />
         </div>
 
         <div className="space-y-2">
           <Label htmlFor="password" className="font-sans font-light">
             Password
           </Label>
           <Input
             id="password"
             type="password"
             placeholder="••••••••"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             className="font-sans"
           />
         </div>
 
         <Button
           type="submit"
           className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans font-light"
         >
           Continue
         </Button>
       </form>
 
       <div className="mt-6 text-center">
         <p className="text-sm font-sans text-muted-foreground">
           Already have an account?{" "}
           <Link
             to="/login"
             className="text-foreground hover:underline"
           >
             Log in
           </Link>
         </p>
       </div>
     </AuthLayout>
   );
 };
 
 export default CoachSignup;