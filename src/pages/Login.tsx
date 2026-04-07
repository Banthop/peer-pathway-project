import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const IS_WEBINAR_ONLY = import.meta.env.VITE_WEBINAR_ONLY === "true";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "coach">("student");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  // Always ensure /login has ?redirect=/portal
  useEffect(() => {
    if (!redirectTo) {
      setSearchParams({ redirect: "/portal" }, { replace: true });
    }
  }, [redirectTo, setSearchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error, userType } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } else {
      // If a redirect URL was provided (e.g. from /portal), use that
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate("/portal");
      }
    }
  };

  return (
    <AuthLayout>
      {/* First-time visitor banner when redirected from portal */}
      {redirectTo === "/portal" && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
          <p className="text-sm font-sans text-blue-900 font-medium mb-1">
            New here? Create a free account to access resources.
          </p>
          <Link
            to="/signup?redirect=/portal"
            className="inline-block rounded-md bg-[#111] text-white text-sm font-sans font-medium px-5 py-2 hover:bg-[#333] transition-colors mt-2"
          >
            Create free account
          </Link>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-sans font-light text-foreground">
          {redirectTo === "/portal" ? "Or log in" : "Welcome back"}
        </h1>
      </div>

      {/* Role Toggle */}
      {!IS_WEBINAR_ONLY && (
      <div className="flex justify-center mb-6">
        <div className="relative inline-flex rounded-full p-1 bg-muted">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-2px)] bg-foreground rounded-full transition-transform duration-200 ease-out ${role === "coach"
                ? "translate-x-[calc(100%+4px)]"
                : "translate-x-0"
              }`}
          />
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-sans transition-colors duration-200 ${role === "student"
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("coach")}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-sans transition-colors duration-200 ${role === "coach"
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Coach
          </button>
        </div>
      </div>
      )}

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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans font-light"
          disabled={loading}
        >
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <p className="text-sm font-sans text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;