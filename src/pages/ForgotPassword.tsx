 import { useState } from "react";
 import { Link } from "react-router-dom";
 import AuthLayout from "@/components/auth/AuthLayout";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 
 const ForgotPassword = () => {
   const [email, setEmail] = useState("");
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     // Will be connected to Supabase later
   };
 
   return (
     <AuthLayout>
       <div className="text-center mb-8">
         <h1 className="text-3xl font-sans font-light text-foreground">
           Reset your password
         </h1>
         <p className="text-sm font-sans font-light text-muted-foreground mt-2">
           Enter your email and we'll send you a reset link.
         </p>
       </div>
 
       <form onSubmit={handleSubmit} className="space-y-4">
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
 
         <Button
           type="submit"
           className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans font-light"
         >
           Send reset link
         </Button>
       </form>
 
       <div className="mt-6 text-center">
         <Link
           to="/login"
           className="text-sm font-sans text-muted-foreground hover:text-foreground hover:underline"
         >
           Back to login
         </Link>
       </div>
     </AuthLayout>
   );
 };
 
 export default ForgotPassword;