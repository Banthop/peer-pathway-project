import { useState } from "react";
import { Link } from "react-router-dom";
import {
    CreditCard, CheckCircle, ArrowRight, Shield,
    Banknote, ExternalLink, AlertTriangle, Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ─── Hooks ─────────────────────────────────────────────────── */

function useStripeOnboardingStatus() {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['stripeOnboarding', user?.id],
        queryFn: async () => {
            if (!user) return null;
            const { data } = await supabase
                .from('coaches')
                .select('stripe_account_id, stripe_onboarded')
                .eq('id', user.id)
                .single();
            return data;
        },
        enabled: !!user,
    });
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function StripeConnect() {
    const { data: stripeStatus, isLoading } = useStripeOnboardingStatus();
    const [isConnecting, setIsConnecting] = useState(false);
    const queryClient = useQueryClient();

    const isOnboarded = stripeStatus?.stripe_onboarded;
    const hasAccountId = !!stripeStatus?.stripe_account_id;

    const handleConnect = async () => {
        setIsConnecting(true);
        // In production, this would call a Supabase Edge Function
        // that creates a Stripe Connect account and returns an onboarding URL.
        // For now, we simulate the flow.
        try {
            // Simulating Edge Function call:
            // const { data } = await supabase.functions.invoke('create-stripe-connect-account');
            // window.location.href = data.onboardingUrl;

            // Demo: just show a toast
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('In production, this will redirect you to Stripe Connect onboarding. Your Stripe account keys need to be configured in the Edge Functions.');
        } catch (err) {
            console.error('Error connecting to Stripe:', err);
        } finally {
            setIsConnecting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full px-6 py-8 md:px-10 lg:px-12">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-6 py-8 md:px-10 lg:px-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Payout Setup</h1>
                <p className="text-sm text-muted-foreground">
                    Connect your Stripe account to receive payments from students
                </p>
            </div>

            <div className="max-w-2xl space-y-6">
                {/* Status Card */}
                <div className={`border rounded-xl p-6 ${isOnboarded ? "border-emerald-200 bg-emerald-50/50" : "border-border bg-background"}`}>
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isOnboarded ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                            {isOnboarded ? <CheckCircle className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-foreground mb-1">
                                {isOnboarded ? "Stripe Connected ✓" : "Connect Stripe to Get Paid"}
                            </h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                {isOnboarded
                                    ? "Your Stripe account is connected and ready to receive payments. Payouts are processed automatically."
                                    : "Set up Stripe Connect to receive direct payouts when students book and pay for your sessions. It takes less than 5 minutes."
                                }
                            </p>
                            {!isOnboarded && (
                                <button
                                    onClick={handleConnect}
                                    disabled={isConnecting}
                                    className="px-6 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isConnecting ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Setting up...</>
                                    ) : (
                                        <><CreditCard className="w-4 h-4" /> Connect with Stripe <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            )}
                            {isOnboarded && (
                                <a
                                    href="https://dashboard.stripe.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-foreground hover:underline flex items-center gap-1.5"
                                >
                                    Open Stripe Dashboard <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* How it works */}
                {!isOnboarded && (
                    <div className="border border-border rounded-xl p-6 bg-background">
                        <h3 className="text-sm font-semibold text-foreground mb-4">How payouts work</h3>
                        <div className="space-y-4">
                            {[
                                { step: "1", title: "Connect Stripe", desc: "Create or connect your Stripe account in less than 5 minutes" },
                                { step: "2", title: "Students book & pay", desc: "Payment is collected securely when a student books a session" },
                                { step: "3", title: "Get paid automatically", desc: "Payouts are sent to your bank account after the session (minus our commission)" },
                            ].map((item) => (
                                <div key={item.step} className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        {item.step}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Commission Info */}
                <div className="border border-border rounded-xl p-6 bg-background">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Banknote className="w-4 h-4" /> Commission Structure
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <div>
                                <p className="text-sm font-medium text-foreground">First 3 months</p>
                                <p className="text-xs text-muted-foreground">Introductory rate</p>
                            </div>
                            <span className="text-lg font-bold text-foreground">0%</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                            <div>
                                <p className="text-sm font-medium text-foreground">Months 4–12</p>
                                <p className="text-xs text-muted-foreground">Growth rate</p>
                            </div>
                            <span className="text-lg font-bold text-foreground">20%</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-foreground">After 12 months</p>
                                <p className="text-xs text-muted-foreground">Standard rate</p>
                            </div>
                            <span className="text-lg font-bold text-foreground">30%</span>
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 px-5 py-4 bg-muted/50 rounded-xl border border-border/50">
                    <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-foreground">Secure payments</p>
                        <p className="text-xs text-muted-foreground">
                            All payments are processed through Stripe, the same payment processor used by Shopify, Amazon, and Google.
                            We never store your bank details.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
