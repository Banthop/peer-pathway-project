import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast({ title: "Failed to send reset link", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-sans font-light text-foreground">
          Reset your password
        </h1>
        <p className="text-sm font-sans font-light text-muted-foreground mt-2">
          {sent
            ? "Check your email — we've sent you a reset link."
            : "Enter your email and we'll send you a reset link."}
        </p>
      </div>

      {!sent && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans font-light">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="font-sans" disabled={loading} />
          </div>

          <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 font-sans font-light" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      {sent && (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground font-sans">
            Didn't get the email? Check your spam folder or{" "}
            <button onClick={() => setSent(false)} className="text-foreground hover:underline">try again</button>.
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm font-sans text-muted-foreground hover:text-foreground hover:underline">
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;