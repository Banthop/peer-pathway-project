 import { useState } from "react";
 import { Link } from "react-router-dom";
 import AuthLayout from "@/components/auth/AuthLayout";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 
 const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
  const [role, setRole] = useState<'student' | 'coach'>('student');
 
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
 
      {/* Role Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-full p-1 bg-muted">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`px-6 py-2 rounded-full text-sm font-sans transition-colors ${
              role === 'student'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('coach')}
            className={`px-6 py-2 rounded-full text-sm font-sans transition-colors ${
              role === 'coach'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Coach
          </button>
        </div>
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
            {role === 'student' ? (
              <Link
                to="/signup"
                className="text-foreground hover:underline"
              >
                Sign up
              </Link>
            ) : (
              <Link
                to="/coach/signup"
                className="text-foreground hover:underline"
              >
                Apply to coach
              </Link>
            )}
         </p>
       </div>
     </AuthLayout>
   );
 };
 
 export default Login;