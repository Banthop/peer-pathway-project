import { Link } from "react-router-dom";
import { Shield, CheckCircle, UserCheck, Video, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Guarantee() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-[680px] mx-auto px-6 pt-12 pb-24">
                {/* Back link */}
                <Link
                    to="/dashboard/browse"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to coaches
                </Link>

                {/* Hero */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            EarlyEdge Guarantee
                        </span>
                    </div>
                </div>
                <h1 className="text-[32px] font-bold tracking-tight text-foreground mb-3 leading-tight">
                    Your sessions are protected
                </h1>
                <p className="text-base text-foreground/60 font-light leading-relaxed mb-12">
                    Every session booked through EarlyEdge comes with built‑in safeguards so you can focus on what matters — getting ahead.
                </p>

                {/* Guarantees */}
                <div className="flex flex-col gap-8">
                    {/* 1 — Satisfaction */}
                    <div className="border border-border rounded-2xl p-7">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center">
                                <CheckCircle className="w-4.5 h-4.5" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">100% Satisfaction Guarantee</h2>
                        </div>
                        <p className="text-[14px] text-foreground/60 font-light leading-relaxed">
                            Not satisfied with your first session? Email us at{" "}
                            <span className="font-medium text-foreground">support@earlyedge.co</span>{" "}
                            within 24 hours for a full refund — no questions asked.
                        </p>
                    </div>

                    {/* 2 — Verified Coaches */}
                    <div className="border border-border rounded-2xl p-7">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center">
                                <UserCheck className="w-4.5 h-4.5" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">Manually Verified Coaches</h2>
                        </div>
                        <p className="text-[14px] text-foreground/60 font-light leading-relaxed">
                            All coaches are hand‑reviewed before they go live. We verify credentials, experience, and coaching quality so you only see coaches who can genuinely help.
                        </p>
                    </div>

                    {/* 3 — Seamless Sessions */}
                    <div className="border border-border rounded-2xl p-7">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center">
                                <Video className="w-4.5 h-4.5" />
                            </div>
                            <h2 className="text-lg font-semibold text-foreground">Seamless Video Sessions</h2>
                        </div>
                        <p className="text-[14px] text-foreground/60 font-light leading-relaxed">
                            Sessions happen via video call with a direct link — no downloads, no plugins, no hassle. Just click and connect with your coach.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link
                        to="/dashboard/browse"
                        className="inline-flex items-center gap-2 bg-foreground text-background rounded-xl px-7 py-3.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
                    >
                        Browse coaches
                    </Link>
                    <p className="text-xs text-muted-foreground mt-3">
                        Every session is backed by the EarlyEdge Guarantee.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
