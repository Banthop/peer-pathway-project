import { useState, useCallback } from "react";
import { Save, Check, ExternalLink, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { coachProfile } from "@/data/coachDashboardData";

/* ─── Types ─────────────────────────────────────────────────── */

interface ServiceForm { name: string; duration: string; price: string; description: string; }
interface ExperienceForm { role: string; company: string; dates: string; description: string; logo: string; }
interface EducationForm { institution: string; degree: string; years: string; achievement: string; logo: string; }
interface SlotForm { day: string; time: string; }

interface ProfileForm {
    name: string; tagline: string; photo: string; hourlyRate: string; category: string;
    uniName: string; uniLogo: string; uniDegree: string; uniYears: string;
    companyName: string; companyLogo: string; companyRole: string;
    bio: string; skills: string;
    services: ServiceForm[];
    enablePackage: boolean;
    packageName: string; packageSessions: string; packagePrice: string;
    packageOriginalPrice: string; packageIncludes: string;
    experience: ExperienceForm[];
    education: EducationForm[];
    enableSlots: boolean;
    slots: SlotForm[];
    nextSlot: string; timezone: string;
}

const defaultForm: ProfileForm = {
    name: "Sarah K.", tagline: "Goldman Sachs Incoming Analyst – Spring Week Expert",
    photo: "", hourlyRate: "50", category: "Investment Banking",
    uniName: "University of Oxford", uniLogo: "", uniDegree: "BA Philosophy, Politics & Economics",
    uniYears: "2021 – 2024",
    companyName: "Goldman Sachs", companyLogo: "", companyRole: "Incoming Analyst",
    bio: "I'm a final-year PPE student at Oxford, joining Goldman Sachs as an Analyst in 2025. I secured Spring Weeks at Goldman, Citi, and Barclays in 2024 — and I've since helped 15+ friends successfully land their own Spring Week offers.",
    skills: "Investment Banking, Spring Week, CV Review, Cover Letters, Interview Prep",
    services: [
        { name: "CV Review", duration: "45 min", price: "50", description: "Full CV review with recruiter-level feedback" },
        { name: "Mock Interview", duration: "60 min", price: "60", description: "Behavioural and competency interview practice" },
        { name: "Application Strategy", duration: "45 min", price: "50", description: "Full application timeline and strategy session" },
    ],
    enablePackage: true,
    packageName: "Spring Week Sprint", packageSessions: "5", packagePrice: "150",
    packageOriginalPrice: "250", packageIncludes: "CV Review, Mock Interview, Strategy, Cover Letter, Final Prep",
    experience: [
        { role: "Incoming Analyst", company: "Goldman Sachs", dates: "Starting 2025", description: "Investment Banking Division", logo: "" },
        { role: "Spring Week Intern", company: "Citi", dates: "Mar 2024", description: "Markets division rotational programme", logo: "" },
    ],
    education: [
        { institution: "University of Oxford", degree: "BA Philosophy, Politics & Economics", years: "2021 – 2024", achievement: "First Class Honours", logo: "" },
    ],
    enableSlots: true,
    slots: [
        { day: "Tomorrow", time: "10:00 AM" },
        { day: "Tomorrow", time: "2:00 PM" },
        { day: "Sun", time: "10:00 AM" },
    ],
    nextSlot: "Tomorrow 10:00 AM", timezone: "GMT",
};

const categoryOptions = [
    "Investment Banking", "Consulting", "Law", "UCAT", "Oxbridge", "Software Engineering",
];

/* ─── Reusable field ────────────────────────────────────────── */

function Field({ label, value, onChange, placeholder, type = "text", className = "" }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; className?: string;
}) {
    return (
        <div className={className}>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
            <input
                type={type} value={value} onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
        </div>
    );
}

/* ─── Section ───────────────────────────────────────────────── */

function Section({ title, children, defaultOpen = true }: {
    title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-border rounded-xl overflow-hidden bg-background">
            <button onClick={() => setOpen(!open)}
                className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors">
                {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <span className="text-sm font-semibold text-foreground">{title}</span>
            </button>
            {open && <div className="px-5 pb-5">{children}</div>}
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function CoachEditProfile() {
    const [form, setForm] = useState<ProfileForm>({ ...defaultForm });
    const [saved, setSaved] = useState(false);

    const update = useCallback(<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
    }, []);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // In production this would call coachStore.saveCoach()
    };

    const addItem = <T,>(key: keyof ProfileForm, empty: T) => {
        setForm((f) => ({ ...f, [key]: [...(f[key] as T[]), empty] }));
    };

    const removeItem = (key: keyof ProfileForm, index: number) => {
        setForm((f) => ({ ...f, [key]: (f[key] as unknown[]).filter((_, i) => i !== index) }));
    };

    const updateItem = <T,>(key: keyof ProfileForm, index: number, field: keyof T, value: string) => {
        setForm((f) => {
            const items = [...(f[key] as unknown as Record<string, string>[])];
            items[index] = { ...items[index], [field as string]: value };
            return { ...f, [key]: items };
        });
    };

    return (
        <div className="w-full px-6 py-8 md:px-10 lg:px-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Edit Profile</h1>
                    <p className="text-sm text-muted-foreground">Update your public-facing coach profile</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to={`/coach/${coachProfile.slug}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" /> Preview
                    </Link>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                        {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="max-w-[720px] space-y-4">
                {/* Basic Info */}
                <Section title="Basic Info">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} placeholder="Sarah K." />
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                            <select value={form.category} onChange={(e) => update("category", e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20">
                                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <Field label="Tagline" value={form.tagline} onChange={(v) => update("tagline", v)} placeholder="Short description" className="sm:col-span-2" />
                        <Field label="Photo URL" value={form.photo} onChange={(v) => update("photo", v)} placeholder="https://..." />
                        <Field label="Hourly Rate (£)" value={form.hourlyRate} onChange={(v) => update("hourlyRate", v)} placeholder="50" type="number" />
                    </div>
                </Section>

                {/* Credentials */}
                <Section title="Credentials">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="University" value={form.uniName} onChange={(v) => update("uniName", v)} />
                        <Field label="Degree" value={form.uniDegree} onChange={(v) => update("uniDegree", v)} />
                        <Field label="Years" value={form.uniYears} onChange={(v) => update("uniYears", v)} />
                        <Field label="Uni Logo URL" value={form.uniLogo} onChange={(v) => update("uniLogo", v)} />
                    </div>
                    <div className="border-t border-border/50 mt-5 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Company" value={form.companyName} onChange={(v) => update("companyName", v)} />
                        <Field label="Role" value={form.companyRole} onChange={(v) => update("companyRole", v)} />
                        <Field label="Company Logo URL" value={form.companyLogo} onChange={(v) => update("companyLogo", v)} className="sm:col-span-2" />
                    </div>
                </Section>

                {/* About */}
                <Section title="About & Skills">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bio</label>
                            <textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={5}
                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                        </div>
                        <Field label="Skills (comma-separated)" value={form.skills} onChange={(v) => update("skills", v)} />
                    </div>
                </Section>

                {/* Services */}
                <Section title="Services">
                    <div className="space-y-4">
                        {form.services.map((s, i) => (
                            <div key={i} className="relative border border-border/50 rounded-lg p-4">
                                {form.services.length > 1 && (
                                    <button onClick={() => removeItem("services", i)}
                                        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field label="Service Name" value={s.name} onChange={(v) => updateItem("services", i, "name", v)} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Duration" value={s.duration} onChange={(v) => updateItem("services", i, "duration", v)} />
                                        <Field label="Price (£)" value={s.price} onChange={(v) => updateItem("services", i, "price", v)} type="number" />
                                    </div>
                                    <Field label="Description" value={s.description} onChange={(v) => updateItem("services", i, "description", v)} className="sm:col-span-2" />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem("services", { name: "", duration: "60 min", price: "", description: "" })}
                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Add service
                        </button>
                    </div>
                </Section>

                {/* Experience */}
                <Section title="Experience">
                    <div className="space-y-4">
                        {form.experience.map((e, i) => (
                            <div key={i} className="relative border border-border/50 rounded-lg p-4">
                                {form.experience.length > 1 && (
                                    <button onClick={() => removeItem("experience", i)}
                                        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field label="Role" value={e.role} onChange={(v) => updateItem("experience", i, "role", v)} />
                                    <Field label="Company" value={e.company} onChange={(v) => updateItem("experience", i, "company", v)} />
                                    <Field label="Dates" value={e.dates} onChange={(v) => updateItem("experience", i, "dates", v)} />
                                    <Field label="Logo URL" value={e.logo} onChange={(v) => updateItem("experience", i, "logo", v)} />
                                    <Field label="Description" value={e.description} onChange={(v) => updateItem("experience", i, "description", v)} className="sm:col-span-2" />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem("experience", { role: "", company: "", dates: "", description: "", logo: "" })}
                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Add position
                        </button>
                    </div>
                </Section>

                {/* Education */}
                <Section title="Education">
                    <div className="space-y-4">
                        {form.education.map((e, i) => (
                            <div key={i} className="relative border border-border/50 rounded-lg p-4">
                                {form.education.length > 1 && (
                                    <button onClick={() => removeItem("education", i)}
                                        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Field label="Institution" value={e.institution} onChange={(v) => updateItem("education", i, "institution", v)} />
                                    <Field label="Degree" value={e.degree} onChange={(v) => updateItem("education", i, "degree", v)} />
                                    <Field label="Years" value={e.years} onChange={(v) => updateItem("education", i, "years", v)} />
                                    <Field label="Achievement" value={e.achievement} onChange={(v) => updateItem("education", i, "achievement", v)} />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem("education", { institution: "", degree: "", years: "", achievement: "", logo: "" })}
                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Add education
                        </button>
                    </div>
                </Section>

                {/* Availability */}
                <Section title="Availability" defaultOpen={false}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Next Available Slot" value={form.nextSlot} onChange={(v) => update("nextSlot", v)} />
                            <Field label="Timezone" value={form.timezone} onChange={(v) => update("timezone", v)} />
                        </div>
                        {form.slots.map((s, i) => (
                            <div key={i} className="flex items-end gap-3">
                                <Field label={i === 0 ? "Day" : ""} value={s.day} onChange={(v) => updateItem("slots", i, "day", v)} placeholder="Tomorrow" className="flex-1" />
                                <Field label={i === 0 ? "Time" : ""} value={s.time} onChange={(v) => updateItem("slots", i, "time", v)} placeholder="10:00 AM" className="flex-1" />
                                <button onClick={() => removeItem("slots", i)} className="pb-2.5 text-muted-foreground hover:text-red-500 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addItem("slots", { day: "", time: "" })}
                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Add slot
                        </button>
                    </div>
                </Section>
            </div>
        </div>
    );
}
