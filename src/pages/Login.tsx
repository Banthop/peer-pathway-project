 import { useState } from "react";
 import { Link } from "react-router-dom";
 import AuthLayout from "@/components/auth/AuthLayout";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 
 const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     // Will be connected to Supabase later
   };
 
   return (
     <AuthLayout>
       <div className="text-center mb-8">
         <h1 className="text-3xl font-sans font-light text-foreground">
           Welcome back
         </h1>
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
           Log in
         </Button>
       </form>
 
       <div className="mt-6 text-center space-y-3">
         <Link
           to="/forgot-password"
           className="text-sm font-sans text-muted-foreground hover:text-foreground hover:underline"
         >
           Forgot password?
         </Link>
         
         <p className="text-sm font-sans text-muted-foreground">
           Don't have an account?{" "}
           <Link
             to="/signup"
             className="text-foreground hover:underline"
           >
             Sign up
           </Link>
         </p>
       </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-sm font-sans text-muted-foreground">
            Want to coach on EarlyEdge?{" "}
            <Link
              to="/coach/signup"
              className="text-foreground hover:underline"
            >
              Apply here
            </Link>
          </p>
        </div>
     </AuthLayout>
   );
 };
 
 export default Login;