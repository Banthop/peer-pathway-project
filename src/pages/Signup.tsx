import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name, "student");
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Check your email for a verification link." });
      navigate("/dashboard");
    }
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
    }
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
          <Label htmlFor="name" className="font-sans font-light">Name</Label>
          <Input id="name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="font-sans" disabled={loading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-sans font-light">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="font-sans" disabled={loading} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-sans font-light">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="font-sans" disabled={loading} />
        </div>

        <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans font-light" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      {/* Google OAuth */}
      <div className="mt-4">
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-sans">or</span>
          </div>
        </div>
        <Button type="button" variant="outline" className="w-full font-sans font-light" onClick={handleGoogle} disabled={loading}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </Button>
      </div>

      <div className="mt-6 text-center space-y-3">
        <p className="text-sm font-sans text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground hover:underline">Log in</Link>
        </p>
        <p className="text-xs font-sans text-muted-foreground pt-4 border-t border-border">
          Want to coach instead?{" "}
          <Link to="/coach/signup" className="text-foreground hover:underline">Apply here</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;