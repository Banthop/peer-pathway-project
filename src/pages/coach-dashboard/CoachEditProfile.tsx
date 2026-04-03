import { useState, useCallback, useEffect } from "react";
import { Save, Check, ExternalLink, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCoachProfile, useUpdateCoachProfile } from "@/hooks/useCoachProfile";
import { useMyAvailability, useSaveAvailability, DAY_NAMES, type AvailabilityInput } from "@/hooks/useAvailability";

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
    bio: "I'm a final-year PPE student at Oxford, joining Goldman Sachs as an Analyst in 2025. I secured Spring Weeks at Goldman, Citi, and Barclays in 2024. and I've since helped 15+ friends successfully land their own Spring Week offers.",
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
    "Spring Week", "Summer Internships", "Degree Apprenticeships", "IELTS/TOEFL",
    "Personal Statements", "Interview Prep", "Assessment Centres", "Networking",
    "CV/Resume", "Cover Letters", "Career Planning",
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

/* ─── Availability Section ──────────────────────────────────── */

function AvailabilitySection() {
    const { data: savedSlots = [] } = useMyAvailability();
    const { mutate: saveAvailability, isPending: isSaving } = useSaveAvailability();
    const [saved, setSaved] = useState(false);

    // day_of_week 1-5 = Mon-Fri, 6 = Sat, 0 = Sun
    const DAYS = [1, 2, 3, 4, 5, 6, 0]; // Mon first

    const [slots, setSlots] = useState<Record<number, { enabled: boolean; start: string; end: string }>>(() => {
        const init: Record<number, { enabled: boolean; start: string; end: string }> = {};
        DAYS.forEach(d => { init[d] = { enabled: false, start: "09:00", end: "17:00" }; });
        return init;
    });

    // Populate from saved data
    useEffect(() => {
        if (savedSlots.length === 0) return;
        setSlots(prev => {
            const next = { ...prev };
            DAYS.forEach(d => { next[d] = { enabled: false, start: "09:00", end: "17:00" }; });
            savedSlots.forEach(s => {
                next[s.day_of_week] = {
                    enabled: s.is_active,
                    start: s.start_time.slice(0, 5),
                    end: s.end_time.slice(0, 5),
                };
            });
            return next;
        });
    }, [savedSlots]); // eslint-disable-line react-hooks/exhaustive-deps

    const toggle = (day: number) => setSlots(p => ({ ...p, [day]: { ...p[day], enabled: !p[day].enabled } }));
    const setTime = (day: number, field: "start" | "end", val: string) =>
        setSlots(p => ({ ...p, [day]: { ...p[day], [field]: val } }));

    const handleSave = () => {
        const inputs: AvailabilityInput[] = DAYS.filter(d => slots[d].enabled).map(d => ({
            day_of_week: d,
            start_time: slots[d].start + ":00",
            end_time: slots[d].end + ":00",
            is_active: true,
        }));
        saveAvailability(inputs, {
            onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2500); }
        });
    };

    return (
        <Section title="Weekly Availability" defaultOpen={false}>
            <p className="text-xs text-muted-foreground mb-4">
                Set the days and hours students can book sessions with you.
            </p>
            <div className="space-y-2.5 mb-5">
                {DAYS.map(d => {
                    const s = slots[d];
                    return (
                        <div key={d} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${s.enabled ? "border-foreground/20 bg-muted/30" : "border-border"}`}>
                            {/* Toggle */}
                            <button
                                onClick={() => toggle(d)}
                                className={`w-8 h-4.5 rounded-full relative transition-colors shrink-0 ${s.enabled ? "bg-foreground" : "bg-muted border border-border"}`}
                                style={{ width: 32, height: 18 }}
                            >
                                <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all shadow-sm ${s.enabled ? "left-[14px]" : "left-0.5"}`} />
                            </button>
                            {/* Day name */}
                            <span className={`text-xs font-semibold w-10 shrink-0 ${s.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                                {DAY_NAMES[d].slice(0, 3)}
                            </span>
                            {/* Time pickers */}
                            {s.enabled ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="time" value={s.start}
                                        onChange={e => setTime(d, "start", e.target.value)}
                                        className="px-2.5 py-1.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                                    />
                                    <span className="text-xs text-muted-foreground">to</span>
                                    <input
                                        type="time" value={s.end}
                                        onChange={e => setTime(d, "end", e.target.value)}
                                        className="px-2.5 py-1.5 rounded-md border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                                    />
                                </div>
                            ) : (
                                <span className="text-xs text-muted-foreground">Unavailable</span>
                            )}
                        </div>
                    );
                })}
            </div>
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {saved ? "Saved!" : isSaving ? "Saving..." : "Save Availability"}
            </button>
        </Section>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function CoachEditProfile() {
    const [form, setForm] = useState<ProfileForm>({ ...defaultForm });
    const [saved, setSaved] = useState(false);

    const { data: profileData, isLoading } = useCoachProfile();
    const { mutate: updateProfile, isPending } = useUpdateCoachProfile();

    useEffect(() => {
        if (profileData) {
            setForm(f => ({
                ...f,
                name: profileData.user?.name || "",
                photo: profileData.user?.avatar_url || "",
                tagline: profileData.headline || "",
                hourlyRate: profileData.hourly_rate ? (profileData.hourly_rate / 100).toString() : "50",
                category: profileData.categories?.[0] || "Investment Banking",
                bio: profileData.bio || "",
                uniName: profileData.university || "",
            }));

            if (profileData.full_bio) {
                try {
                    const parsed = JSON.parse(profileData.full_bio);
                    setForm(p => ({ ...p, ...parsed }));
                } catch (e) {
                    console.error("Failed to parse full_bio", e);
                }
            }
        }
    }, [profileData]);

    const update = useCallback(<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
    }, []);

    const handleSave = () => {
        const fullBioJson = JSON.stringify({
            skills: form.skills,
            experience: form.experience,
            education: form.education,
            services: form.services,
            uniName: form.uniName,
            uniDegree: form.uniDegree,
            uniYears: form.uniYears,
            uniLogo: form.uniLogo,
            companyName: form.companyName,
            companyRole: form.companyRole,
            companyLogo: form.companyLogo,
            slots: form.slots,
            nextSlot: form.nextSlot,
            timezone: form.timezone,
            enablePackage: form.enablePackage,
            packageName: form.packageName,
            packageSessions: form.packageSessions,
            packagePrice: form.packagePrice,
            packageOriginalPrice: form.packageOriginalPrice,
            packageIncludes: form.packageIncludes,
            enableSlots: form.enableSlots,
        });

        updateProfile({
            name: form.name,
            avatar_url: form.photo,
            headline: form.tagline,
            categories: [form.category],
            hourly_rate: parseInt(form.hourlyRate) * 100 || 5000,
            bio: form.bio,
            full_bio: fullBioJson,
            university: form.uniName,
        }, {
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        });
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
                        to={`/coach/${profileData?.id || 'demo'}`}
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
                    <div className="space-y-4">
                        {/* Photo upload area */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Profile Photo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold overflow-hidden flex-shrink-0">
                                    {form.photo ? (
                                        <img src={form.photo} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                    ) : (
                                        (form.name || "C").substring(0, 2).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Field label="" value={form.photo} onChange={(v) => update("photo", v)} placeholder="Paste photo URL (or upload coming soon)" />
                                    <p className="text-[10px] text-muted-foreground mt-1">Paste a URL from Imgur, Cloudinary, or any image host</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} placeholder="Sarah K." />
                            <Field label="Hourly Rate (£)" value={form.hourlyRate} onChange={(v) => update("hourlyRate", v)} placeholder="50" type="number" />
                        </div>
                        <Field label="Tagline" value={form.tagline} onChange={(v) => update("tagline", v)} placeholder='e.g. "Ex-Goldman Sachs | Spring Week Expert"' />

                        {/* Multi-select category pills */}
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                Categories <span className="text-muted-foreground/60">(select all that apply)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categoryOptions.map((cat) => {
                                    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
                                    const active = skills.includes(cat);
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => {
                                                const current = form.skills.split(",").map(s => s.trim()).filter(Boolean);
                                                const next = active
                                                    ? current.filter(s => s !== cat)
                                                    : [...current, cat];
                                                update("skills", next.join(", "));
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-150 ${
                                                active
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
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
                <Section title="About">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Bio</label>
                                <span className={`text-[10px] font-medium ${form.bio.length > 480 ? "text-red-500" : "text-muted-foreground"}`}>
                                    {form.bio.length}/500
                                </span>
                            </div>
                            <textarea
                                value={form.bio}
                                onChange={(e) => update("bio", e.target.value.slice(0, 500))}
                                rows={5}
                                placeholder="What makes you the right coach? Share your background, what you achieved, and how you help students..."
                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
                            />
                        </div>
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
                <AvailabilitySection />
            </div>
        </div>
    );
}
