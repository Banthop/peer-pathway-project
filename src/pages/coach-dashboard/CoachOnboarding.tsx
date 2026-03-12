import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, Plus, Trash2, Sparkles, Copy, ExternalLink } from "lucide-react";
import { useUpdateCoachProfile } from "@/hooks/useCoachProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { syncOnboardingToOutreach } from "@/utils/outreachSync";

/* ─── Types (matching CoachEditProfile) ──────────────────────── */

interface ServiceForm { name: string; duration: string; price: string; description: string; }

interface OnboardingForm {
    tagline: string;
    bio: string;
    category: string;
    hourlyRate: string;
    uniName: string;
    uniDegree: string;
    companyName: string;
    companyRole: string;
    skills: string;
    services: ServiceForm[];
    enablePackage: boolean;
    packageName: string;
    packageSessions: string;
    packagePrice: string;
    packageOriginalPrice: string;
    packageIncludes: string;
}

const CATEGORIES = [
    "Investment Banking", "Consulting", "Law (Vac Schemes)", "Law (Training Contracts)",
    "UCAT", "STEP", "Oxbridge Applications", "University Applications",
    "Software Engineering", "Quant Finance", "Cold Emailing", "Internship Conversion",
    "Assessment Centre Prep", "Graduate Schemes", "Dissertation Coaching",
    "CV & Application Review", "LinkedIn & Professional Branding",
    "Medical School (MMI)", "First-Class Degree Coaching",
    "IELTS / TOEFL", "SQE Prep", "Scholarship Applications",
];

const emptyForm: OnboardingForm = {
    tagline: "", bio: "", category: "", hourlyRate: "",
    uniName: "", uniDegree: "", companyName: "", companyRole: "",
    skills: "",
    services: [{ name: "", duration: "60 min", price: "", description: "" }],
    enablePackage: false,
    packageName: "", packageSessions: "3", packagePrice: "", packageOriginalPrice: "", packageIncludes: "",
};

/* ─── Field Component ───────────────────────────────────────── */

function Field({ label, value, onChange, placeholder, type = "text", className = "", hint }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; className?: string; hint?: string;
}) {
    return (
        <div className={className}>
            <label className="text-xs font-semibold text-foreground/70 mb-1.5 block tracking-wide uppercase">{label}</label>
            <input
                type={type} value={value} onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
            />
            {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
        </div>
    );
}

/* ─── Progress Bar ──────────────────────────────────────────── */

function ProgressBar({ step, total }: { step: number; total: number }) {
    return (
        <div className="flex gap-2 mb-8">
            {Array.from({ length: total }, (_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-border/50">
                    <div
                        className="h-full bg-foreground rounded-full transition-all duration-500 ease-out"
                        style={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                    />
                </div>
            ))}
        </div>
    );
}

/* ─── Main Wizard ───────────────────────────────────────────── */

export default function CoachOnboarding() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<OnboardingForm>({ ...emptyForm });
    const [saving, setSaving] = useState(false);
    const [profileUrl, setProfileUrl] = useState("");

    const { user } = useAuth();
    const { mutateAsync: updateProfile } = useUpdateCoachProfile();
    const { toast } = useToast();
    const navigate = useNavigate();

    const update = useCallback(<K extends keyof OnboardingForm>(key: K, value: OnboardingForm[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
    }, []);

    const updateService = (index: number, field: keyof ServiceForm, value: string) => {
        setForm((f) => {
            const services = [...f.services];
            services[index] = { ...services[index], [field]: value };
            return { ...f, services };
        });
    };

    const addService = () => {
        setForm((f) => ({ ...f, services: [...f.services, { name: "", duration: "60 min", price: "", description: "" }] }));
    };

    const removeService = (index: number) => {
        setForm((f) => ({ ...f, services: f.services.filter((_, i) => i !== index) }));
    };

    /* ─── Validation ────────────────────────────────────────────── */

    const canProceed = () => {
        switch (step) {
            case 0: return true; // Welcome — always proceed
            case 1: return form.tagline.trim().length >= 10 && form.bio.trim().length >= 30;
            case 2: return form.category && form.hourlyRate && form.services.some(s => s.name && s.price);
            case 3: return true; // Package is optional
            case 4: return true; // Share — always proceed
            default: return true;
        }
    };

    /* ─── Save Profile ──────────────────────────────────────────── */

    const saveProfile = async () => {
        setSaving(true);
        try {
            const fullBioJson = JSON.stringify({
                skills: form.skills,
                services: form.services,
                uniName: form.uniName,
                uniDegree: form.uniDegree,
                companyName: form.companyName,
                companyRole: form.companyRole,
                enablePackage: form.enablePackage,
                packageName: form.packageName,
                packageSessions: form.packageSessions,
                packagePrice: form.packagePrice,
                packageOriginalPrice: form.packageOriginalPrice,
                packageIncludes: form.packageIncludes,
            });

            await updateProfile({
                headline: form.tagline,
                categories: [form.category],
                hourly_rate: parseInt(form.hourlyRate) * 100 || 5000,
                bio: form.bio,
                full_bio: fullBioJson,
                university: form.uniName,
            });

            setProfileUrl(`${window.location.origin}/coach/${user?.id || "me"}`);
            toast({ title: "Profile saved!", description: "Your coach profile is now live." });

            // Sync onboarding data to the outreach tracker
            try {
                syncOnboardingToOutreach({
                    email: user?.email || "",
                    name: user?.user_metadata?.name || user?.email?.split("@")[0] || "Unknown",
                    userId: user?.id || "",
                    onboardingForm: form,
                });
            } catch (syncErr) {
                console.warn("Outreach sync failed (non-critical):", syncErr);
            }
        } catch (err: any) {
            toast({ title: "Failed to save", description: err.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleNext = async () => {
        if (step === 3) {
            // Save before showing share step
            await saveProfile();
        }
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleFinish = () => {
        navigate("/coach-dashboard");
    };

    /* ─── Step Content ──────────────────────────────────────────── */

    const steps = [
        /* STEP 0 — Welcome */
        <div key={0} className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-10 h-10 text-background" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4">
                Let's set up your coach profile
            </h1>
            <p className="text-lg font-light text-muted-foreground mb-2 max-w-xl mx-auto">
                This takes about 3 minutes. You can always edit later.
            </p>
            <p className="text-sm text-muted-foreground/60">
                Students will see this on your public profile and when browsing coaches.
            </p>
        </div>,

        /* STEP 1 — Tagline & Bio */
        <div key={1}>
            <h2 className="text-2xl font-light text-foreground mb-2">Tell students about you</h2>
            <p className="text-sm text-muted-foreground mb-8">What did you achieve? Why should someone book you?</p>

            <div className="space-y-6">
                <div>
                    <label className="text-xs font-semibold text-foreground/70 mb-1.5 block tracking-wide uppercase">Tagline</label>
                    <input
                        value={form.tagline} onChange={(e) => update("tagline", e.target.value)}
                        placeholder="e.g. Goldman Sachs Spring Week Alum – Helped 15+ Students Get Offers"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                        This appears on your card in search results. Lead with your biggest credential.
                    </p>
                </div>

                <div>
                    <label className="text-xs font-semibold text-foreground/70 mb-1.5 block tracking-wide uppercase">Bio</label>
                    <textarea
                        value={form.bio} onChange={(e) => update("bio", e.target.value)}
                        placeholder="Tell students what you achieved, what you can help with, and why you're the right person to coach them."
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                    />
                    <div className="flex justify-between mt-1.5">
                        <p className="text-xs text-muted-foreground">
                            {form.bio.length < 30 ? `${30 - form.bio.length} more characters needed` : "✓ Looks good"}
                        </p>
                        <p className="text-xs text-muted-foreground">{form.bio.length} chars</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="University" value={form.uniName} onChange={(v) => update("uniName", v)} placeholder="e.g. University of Oxford" />
                    <Field label="Degree" value={form.uniDegree} onChange={(v) => update("uniDegree", v)} placeholder="e.g. BA Economics" />
                    <Field label="Company / Organisation" value={form.companyName} onChange={(v) => update("companyName", v)} placeholder="e.g. Goldman Sachs" />
                    <Field label="Role" value={form.companyRole} onChange={(v) => update("companyRole", v)} placeholder="e.g. Incoming Analyst" />
                </div>

                <Field
                    label="Skills (comma-separated)"
                    value={form.skills}
                    onChange={(v) => update("skills", v)}
                    placeholder="e.g. Spring Week, CV Review, Interview Prep"
                    hint="These help students find you when searching."
                />
            </div>
        </div>,

        /* STEP 2 — Pricing & Services */
        <div key={2}>
            <h2 className="text-2xl font-light text-foreground mb-2">Set your pricing & services</h2>
            <p className="text-sm text-muted-foreground mb-8">Most coaches charge £30–50/hour. You can change this anytime.</p>

            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-semibold text-foreground/70 mb-1.5 block tracking-wide uppercase">Category</label>
                        <select
                            value={form.category} onChange={(e) => update("category", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all"
                        >
                            <option value="">Select your category</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <Field
                        label="Hourly Rate (£)"
                        value={form.hourlyRate}
                        onChange={(v) => update("hourlyRate", v)}
                        placeholder="40"
                        type="number"
                        hint="Students see this on your card."
                    />
                </div>

                {/* Services */}
                <div>
                    <label className="text-xs font-semibold text-foreground/70 mb-3 block tracking-wide uppercase">
                        Your Services
                    </label>
                    <p className="text-xs text-muted-foreground mb-4">
                        Add at least one service. Think about what a student would actually book.
                    </p>
                    <div className="space-y-3">
                        {form.services.map((s, i) => (
                            <div key={i} className="relative border border-border rounded-xl p-4 bg-background hover:border-foreground/20 transition-colors">
                                {form.services.length > 1 && (
                                    <button onClick={() => removeService(i)}
                                        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field label="Service Name" value={s.name} onChange={(v) => updateService(i, "name", v)} placeholder="e.g. CV Review" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Duration" value={s.duration} onChange={(v) => updateService(i, "duration", v)} placeholder="60 min" />
                                        <Field label="Price (£)" value={s.price} onChange={(v) => updateService(i, "price", v)} placeholder="50" type="number" />
                                    </div>
                                    <Field label="Description" value={s.description} onChange={(v) => updateService(i, "description", v)}
                                        placeholder="What does this session cover?" className="sm:col-span-2" />
                                </div>
                            </div>
                        ))}
                        <button onClick={addService}
                            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mt-2">
                            <Plus className="w-3.5 h-3.5" /> Add another service
                        </button>
                    </div>
                </div>
            </div>
        </div>,

        /* STEP 3 — Package (optional) */
        <div key={3}>
            <h2 className="text-2xl font-light text-foreground mb-2">Create a package</h2>
            <p className="text-sm text-muted-foreground mb-8">
                Packages are your biggest revenue driver — 3.75× higher than single sessions. Completely optional though.
            </p>

            <div className="space-y-6">
                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => update("enablePackage", !form.enablePackage)}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.enablePackage ? "bg-foreground border-foreground" : "border-border group-hover:border-foreground/40"}`}>
                        {form.enablePackage && <Check className="w-3 h-3 text-background" />}
                    </div>
                    <span className="text-sm font-medium text-foreground">Yes, I want to offer a package</span>
                </label>

                {form.enablePackage && (
                    <div className="space-y-4 pl-0 border-l-0">
                        <Field label="Package Name" value={form.packageName} onChange={(v) => update("packageName", v)}
                            placeholder="e.g. Spring Week Sprint" hint="Give it a memorable name." />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="Number of Sessions" value={form.packageSessions} onChange={(v) => update("packageSessions", v)}
                                placeholder="3" type="number" />
                            <Field label="Package Price (£)" value={form.packagePrice} onChange={(v) => update("packagePrice", v)}
                                placeholder="150" type="number" hint="Discounted bundle price." />
                            <Field label="Original Price (£)" value={form.packageOriginalPrice} onChange={(v) => update("packageOriginalPrice", v)}
                                placeholder="250" type="number" hint="Shows the savings." />
                        </div>
                        <Field label="What's Included" value={form.packageIncludes} onChange={(v) => update("packageIncludes", v)}
                            placeholder="e.g. CV Review, Mock Interview, Strategy Session, Cover Letter Review, Final Prep Call"
                            hint="Comma-separated list of what's in the package." />
                    </div>
                )}

                {!form.enablePackage && (
                    <div className="border border-dashed border-border rounded-xl p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-2">No worries — you can add one later from your dashboard.</p>
                        <button onClick={() => update("enablePackage", true)}
                            className="text-sm font-medium text-foreground hover:underline">
                            Actually, let me add one →
                        </button>
                    </div>
                )}
            </div>
        </div>,

        /* STEP 4 — Share */
        <div key={4} className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mx-auto mb-8">
                <Check className="w-10 h-10 text-background" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
                You're live! 🎉
            </h2>
            <p className="text-lg font-light text-muted-foreground mb-8 max-w-xl mx-auto">
                Your profile is now visible to students. Share it to get your first booking.
            </p>

            {profileUrl && (
                <div className="max-w-md mx-auto mb-8">
                    <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-3 border border-border">
                        <input
                            readOnly
                            value={profileUrl}
                            className="flex-1 bg-transparent text-sm text-foreground outline-none"
                        />
                        <button
                            onClick={() => { navigator.clipboard.writeText(profileUrl); toast({ title: "Copied!" }); }}
                            className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                        >
                            <Copy className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <a href={profileUrl} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-foreground/5 transition-colors">
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                    </div>
                </div>
            )}

            <div className="space-y-4 max-w-sm mx-auto">
                <div className="border border-dashed border-border rounded-xl p-5">
                    <p className="text-sm font-medium text-foreground mb-1">Next steps</p>
                    <ul className="text-sm text-muted-foreground text-left space-y-2 mt-3">
                        <li className="flex items-start gap-2"><span className="text-foreground mt-0.5">1.</span> Share your profile link on LinkedIn or in group chats</li>
                        <li className="flex items-start gap-2"><span className="text-foreground mt-0.5">2.</span> Upload a resource (guide, template) to attract students</li>
                        <li className="flex items-start gap-2"><span className="text-foreground mt-0.5">3.</span> Set your availability slots in your dashboard</li>
                    </ul>
                </div>
            </div>
        </div>,
    ];

    /* ─── Render ────────────────────────────────────────────────── */

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Logo */}
                <div className="mb-10 text-center">
                    <span className="text-xl tracking-tight">
                        <span className="font-light">Early</span>
                        <span className="font-bold">Edge</span>
                    </span>
                </div>

                <ProgressBar step={step} total={5} />

                {/* Step content */}
                <div className="min-h-[400px]">
                    {steps[step]}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
                    {step > 0 && step < 4 ? (
                        <button onClick={handleBack}
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    ) : <div />}

                    {step < 4 ? (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed() || saving}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving…" : step === 0 ? "Let's go" : step === 3 ? "Save & finish" : "Continue"}
                            {!saving && <ArrowRight className="w-4 h-4" />}
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Go to Dashboard <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
