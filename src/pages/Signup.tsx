 import { useState } from "react";
 import { Link } from "react-router-dom";
 import AuthLayout from "@/components/auth/AuthLayout";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 
 const Signup = () => {
   const [name, setName] = useState("");
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
           Create your account
         </h1>
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
           Create account
         </Button>
       </form>
 
       <div className="mt-6 text-center space-y-3">
         <p className="text-sm font-sans text-muted-foreground">
           Already have an account?{" "}
           <Link
             to="/login"
             className="text-foreground hover:underline"
           >
             Log in
           </Link>
         </p>
         
         <p className="text-xs font-sans text-muted-foreground pt-4 border-t border-border">
           Want to coach instead?{" "}
           <Link
             to="/become-a-coach"
             className="text-foreground hover:underline"
           >
             Apply here
           </Link>
         </p>
       </div>
     </AuthLayout>
   );
 };
 
 export default Signup;