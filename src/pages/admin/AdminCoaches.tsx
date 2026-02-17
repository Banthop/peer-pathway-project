import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    Plus, Trash2, ChevronDown, ChevronRight, Star, Clock, Shield,
    MessageSquare, Calendar, Eye, Save, X, Edit2, ExternalLink, Check
} from "lucide-react";
import {
    generateSlug, saveCoach, getCustomCoaches, deleteCoach,
    isSlugTaken, getNextBrowseId,
} from "@/data/coachStore";
import type { StoredCoach } from "@/data/coachStore";
import type { Coach } from "@/types/coach";
import type { Coach as BrowseCoach } from "@/data/dashboardData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ─── Types ────────────────────────────────────────────────── */

interface ServiceForm {
    name: string; duration: string; price: string; description: string;
}
interface ExperienceForm {
    role: string; company: string; dates: string; description: string; logo: string;
}
interface EducationForm {
    institution: string; degree: string; years: string; achievement: string; logo: string;
}
interface ReviewForm {
    name: string; rating: string; text: string; date: string; outcome: string;
}
interface SlotForm { day: string; time: string; }
interface UCATScoreForm { section: string; score: string; max: string; }

interface FormState {
    // Basic
    name: string;
    tagline: string;
    photo: string;
    hourlyRate: string;
    category: string;
    // Credentials
    uniName: string;
    uniLogo: string;
    uniDegree: string;
    uniYears: string;
    companyName: string;
    companyLogo: string;
    companyRole: string;
    // About
    bio: string;
    skills: string;
    // Services
    services: ServiceForm[];
    // Package (optional)
    enablePackage: boolean;
    packageName: string;
    packageSessions: string;
    packagePrice: string;
    packageOriginalPrice: string;
    packageIncludes: string;
    // Experience
    experience: ExperienceForm[];
    // Education
    education: EducationForm[];
    // Reviews (optional)
    enableReviews: boolean;
    reviews: ReviewForm[];
    overallRating: string;
    ratingKnowledge: string;
    ratingValue: string;
    ratingResponsiveness: string;
    ratingSupportiveness: string;
    // UCAT (optional)
    enableUCAT: boolean;
    ucatScores: UCATScoreForm[];
    ucatSJTBand: string;
    // Event (optional)
    enableEvent: boolean;
    eventTitle: string;
    eventDescription: string;
    eventDate: string;
    eventTime: string;
    eventPrice: string;
    eventSpots: string;
    // Slots (optional)
    enableSlots: boolean;
    slots: SlotForm[];
    // Success companies
    successCompanyLabels: string;
    // Availability
    nextSlot: string;
    timezone: string;
}

const emptyForm: FormState = {
    name: "", tagline: "", photo: "", hourlyRate: "", category: "Investment Banking",
    uniName: "", uniLogo: "", uniDegree: "", uniYears: "",
    companyName: "", companyLogo: "", companyRole: "",
    bio: "", skills: "",
    services: [{ name: "", duration: "60 min", price: "", description: "" }],
    enablePackage: false,
    packageName: "", packageSessions: "", packagePrice: "", packageOriginalPrice: "", packageIncludes: "",
    experience: [{ role: "", company: "", dates: "", description: "", logo: "" }],
    education: [{ institution: "", degree: "", years: "", achievement: "", logo: "" }],
    enableReviews: false,
    reviews: [{ name: "", rating: "5", text: "", date: "", outcome: "" }],
    overallRating: "5.0", ratingKnowledge: "5.0", ratingValue: "5.0", ratingResponsiveness: "5.0", ratingSupportiveness: "5.0",
    enableUCAT: false,
    ucatScores: [
        { section: "VR", score: "", max: "900" },
        { section: "DM", score: "", max: "900" },
        { section: "QR", score: "", max: "900" },
        { section: "AR", score: "", max: "900" },
        { section: "Total", score: "", max: "3600" },
    ],
    ucatSJTBand: "",
    enableEvent: false,
    eventTitle: "", eventDescription: "", eventDate: "", eventTime: "", eventPrice: "", eventSpots: "",
    enableSlots: false,
    slots: [{ day: "", time: "" }],
    successCompanyLabels: "",
    nextSlot: "Tomorrow 10:00 AM", timezone: "GMT",
};

const categoryOptions = [
    "Investment Banking", "Consulting", "Law", "UCAT", "Oxbridge", "Software Engineering",
];

/* ─── Main Component ───────────────────────────────────────── */

export default function AdminCoaches() {
    const [form, setForm] = useState<FormState>({ ...emptyForm });
    const [customCoaches, setCustomCoaches] = useState<StoredCoach[]>([]);
    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        basic: true, credentials: true, about: true, services: true,
        package: false, experience: true, education: true,
        reviews: false, ucat: false, event: false, slots: false,
    });

    useEffect(() => {
        setCustomCoaches(getCustomCoaches());
    }, []);

    const toggleSection = (key: string) => {
        setExpandedSections((s) => ({ ...s, [key]: !s[key] }));
    };

    const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
    }, []);

    /* ── Build coach objects from form ─────────────────────── */

    const buildCoach = useCallback((): StoredCoach | null => {
        const slug = editingSlug || generateSlug(form.name);
        if (!form.name.trim()) return null;

        const profile: Coach = {
            id: slug,
            name: form.name.trim(),
            tagline: form.tagline,
            photo: form.photo,
            rating: parseFloat(form.overallRating) || 5.0,
            reviewCount: form.enableReviews ? form.reviews.filter((r) => r.text).length : 0,
            sessionsCompleted: 0,
            followers: 0,
            university: {
                name: form.uniName,
                logo: form.uniLogo,
                degree: form.uniDegree,
                years: form.uniYears,
            },
            company: {
                name: form.companyName,
                logo: form.companyLogo,
                role: form.companyRole,
            },
            successCompanies: [],
            bio: form.bio,
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            services: form.services.filter((s) => s.name).map((s) => ({
                name: s.name,
                duration: s.duration,
                price: parseInt(s.price) || 0,
                description: s.description,
            })),
            hourlyRate: parseInt(form.hourlyRate) || 0,
            experience: form.experience.filter((e) => e.role).map((e) => ({
                logo: e.logo,
                role: e.role,
                company: e.company,
                dates: e.dates,
                description: e.description,
            })),
            education: form.education.filter((e) => e.institution).map((e) => ({
                logo: e.logo,
                institution: e.institution,
                degree: e.degree,
                years: e.years,
                achievement: e.achievement || undefined,
            })),
            reviews: form.enableReviews
                ? form.reviews.filter((r) => r.text).map((r) => ({
                    name: r.name,
                    date: r.date || "Recently",
                    rating: parseInt(r.rating) || 5,
                    text: r.text,
                    outcome: r.outcome || undefined,
                }))
                : [],
            ratings: {
                knowledge: parseFloat(form.ratingKnowledge) || 5.0,
                value: parseFloat(form.ratingValue) || 5.0,
                responsiveness: parseFloat(form.ratingResponsiveness) || 5.0,
                supportiveness: parseFloat(form.ratingSupportiveness) || 5.0,
            },
            availability: {
                nextSlot: form.nextSlot,
                timezone: form.timezone,
            },
        };

        // Optional sections
        if (form.enablePackage && form.packageName) {
            profile.package = {
                name: form.packageName,
                sessions: parseInt(form.packageSessions) || 0,
                price: parseInt(form.packagePrice) || 0,
                originalPrice: parseInt(form.packageOriginalPrice) || 0,
                includes: form.packageIncludes,
            };
        }
        if (form.enableSlots) {
            profile.availableSlots = form.slots.filter((s) => s.day && s.time);
        }
        if (form.enableUCAT) {
            profile.ucatScores = form.ucatScores.filter((s) => s.score).map((s) => ({
                section: s.section,
                score: parseInt(s.score) || 0,
                max: parseInt(s.max) || 900,
            }));
            if (form.ucatSJTBand) profile.ucatSJTBand = parseInt(form.ucatSJTBand);
        }
        if (form.enableEvent && form.eventTitle) {
            profile.upcomingEvent = {
                title: form.eventTitle,
                description: form.eventDescription,
                date: form.eventDate,
                time: form.eventTime,
                price: form.eventPrice || "Free",
                spotsLeft: parseInt(form.eventSpots) || 20,
            };
        }
        if (form.successCompanyLabels.trim()) {
            profile.landedOfferLabels = form.successCompanyLabels.split(",").map((s) => s.trim()).filter(Boolean);
        }

        const browse: BrowseCoach = {
            id: editingSlug ? customCoaches.find((c) => c.profile.id === editingSlug)?.browse.id || getNextBrowseId() : getNextBrowseId(),
            slug,
            name: profile.name,
            credential: form.companyRole ? `${form.companyRole} at ${form.companyName}` : form.companyName,
            uni: form.uniName ? `${form.uniName.replace("University of ", "")}` : "",
            rating: profile.rating,
            reviews: profile.reviewCount,
            tags: profile.skills.slice(0, 4),
            rate: profile.hourlyRate,
            avatar: profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
            category: form.category,
            bio: form.bio.substring(0, 160) + (form.bio.length > 160 ? "..." : ""),
            sessions: profile.sessionsCompleted,
            packageName: form.enablePackage ? form.packageName : `${form.category} Prep`,
            packageSessions: form.enablePackage ? parseInt(form.packageSessions) || 0 : 0,
            packagePrice: form.enablePackage ? parseInt(form.packagePrice) || 0 : 0,
            hasBooked: false,
            fullBio: form.bio,
        };

        return { profile, browse };
    }, [form, editingSlug, customCoaches]);

    /* ── Actions ───────────────────────────────────────────── */

    const handleSave = () => {
        const coach = buildCoach();
        if (!coach) return;

        // Check slug conflicts (only for new coaches)
        if (!editingSlug && isSlugTaken(coach.profile.id)) {
            alert(`A coach with the slug "${coach.profile.id}" already exists. Pick a different name.`);
            return;
        }

        saveCoach(coach);
        setCustomCoaches(getCustomCoaches());
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);

        if (!editingSlug) {
            // Reset form after creating
            setForm({ ...emptyForm });
        }
        setEditingSlug(null);
    };

    const handleEdit = (coach: StoredCoach) => {
        const p = coach.profile;
        setEditingSlug(p.id);
        setForm({
            name: p.name,
            tagline: p.tagline,
            photo: p.photo,
            hourlyRate: String(p.hourlyRate),
            category: coach.browse.category,
            uniName: p.university.name,
            uniLogo: p.university.logo,
            uniDegree: p.university.degree,
            uniYears: p.university.years,
            companyName: p.company.name,
            companyLogo: p.company.logo,
            companyRole: p.company.role,
            bio: p.bio,
            skills: p.skills.join(", "),
            services: p.services.length > 0
                ? p.services.map((s) => ({ name: s.name, duration: s.duration, price: String(s.price), description: s.description }))
                : [{ name: "", duration: "60 min", price: "", description: "" }],
            enablePackage: !!p.package,
            packageName: p.package?.name || "",
            packageSessions: p.package ? String(p.package.sessions) : "",
            packagePrice: p.package ? String(p.package.price) : "",
            packageOriginalPrice: p.package ? String(p.package.originalPrice) : "",
            packageIncludes: p.package?.includes || "",
            experience: p.experience.length > 0
                ? p.experience.map((e) => ({ role: e.role, company: e.company, dates: e.dates, description: e.description || "", logo: e.logo }))
                : [{ role: "", company: "", dates: "", description: "", logo: "" }],
            education: p.education.length > 0
                ? p.education.map((e) => ({ institution: e.institution, degree: e.degree, years: e.years, achievement: e.achievement || "", logo: e.logo }))
                : [{ institution: "", degree: "", years: "", achievement: "", logo: "" }],
            enableReviews: p.reviews.length > 0,
            reviews: p.reviews.length > 0
                ? p.reviews.map((r) => ({ name: r.name, rating: String(r.rating), text: r.text, date: r.date, outcome: r.outcome || "" }))
                : [{ name: "", rating: "5", text: "", date: "", outcome: "" }],
            overallRating: String(p.rating),
            ratingKnowledge: String(p.ratings.knowledge),
            ratingValue: String(p.ratings.value),
            ratingResponsiveness: String(p.ratings.responsiveness),
            ratingSupportiveness: String(p.ratings.supportiveness),
            enableUCAT: !!p.ucatScores,
            ucatScores: p.ucatScores
                ? p.ucatScores.map((s) => ({ section: s.section, score: String(s.score), max: String(s.max) }))
                : [
                    { section: "VR", score: "", max: "900" },
                    { section: "DM", score: "", max: "900" },
                    { section: "QR", score: "", max: "900" },
                    { section: "AR", score: "", max: "900" },
                    { section: "Total", score: "", max: "3600" },
                ],
            ucatSJTBand: p.ucatSJTBand ? String(p.ucatSJTBand) : "",
            enableEvent: !!p.upcomingEvent,
            eventTitle: p.upcomingEvent?.title || "",
            eventDescription: p.upcomingEvent?.description || "",
            eventDate: p.upcomingEvent?.date || "",
            eventTime: p.upcomingEvent?.time || "",
            eventPrice: p.upcomingEvent?.price || "",
            eventSpots: p.upcomingEvent ? String(p.upcomingEvent.spotsLeft) : "",
            enableSlots: !!p.availableSlots,
            slots: p.availableSlots || [{ day: "", time: "" }],
            successCompanyLabels: p.landedOfferLabels?.join(", ") || "",
            nextSlot: p.availability.nextSlot,
            timezone: p.availability.timezone,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (slug: string) => {
        if (!confirm("Delete this coach? This cannot be undone.")) return;
        deleteCoach(slug);
        setCustomCoaches(getCustomCoaches());
        if (editingSlug === slug) {
            setEditingSlug(null);
            setForm({ ...emptyForm });
        }
    };

    const handleCancel = () => {
        setEditingSlug(null);
        setForm({ ...emptyForm });
    };

    const slug = editingSlug || (form.name ? generateSlug(form.name) : "");
    const previewCoach = buildCoach();

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Admin: Coach Profiles
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Create and manage coach profile pages
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {editingSlug && (
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <X className="w-4 h-4" /> Cancel edit
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={!form.name.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {saved ? "Saved!" : editingSlug ? "Update Coach" : "Create Coach"}
                        </button>
                    </div>
                </div>

                {/* Slug preview */}
                {slug && (
                    <div className="mb-6 px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm flex items-center gap-2">
                        <span className="text-muted-foreground">Profile URL:</span>
                        <code className="text-foreground font-mono text-xs bg-muted px-2 py-0.5 rounded">
                            /coach/{slug}
                        </code>
                        {editingSlug && (
                            <Link
                                to={`/coach/${slug}`}
                                target="_blank"
                                className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <ExternalLink className="w-3 h-3" /> View live
                            </Link>
                        )}
                    </div>
                )}

                {/* Two-column: Form + Preview */}
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
                    {/* LEFT: Form */}
                    <div className="space-y-4">
                        {/* ── Basic Info ──────────────────────────────── */}
                        <FormSection title="Basic Info" sectionKey="basic" expanded={expandedSections.basic} onToggle={toggleSection}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Full Name *" value={form.name} onChange={(v) => update("name", v)} placeholder="e.g. Andrew T." />
                                <Field label="Category *" type="select" value={form.category} onChange={(v) => update("category", v)} options={categoryOptions} />
                                <Field label="Tagline" value={form.tagline} onChange={(v) => update("tagline", v)} placeholder="One-line description" className="sm:col-span-2" />
                                <Field label="Photo URL" value={form.photo} onChange={(v) => update("photo", v)} placeholder="https://..." />
                                <Field label="Hourly Rate (£)" value={form.hourlyRate} onChange={(v) => update("hourlyRate", v)} placeholder="50" type="number" />
                            </div>
                        </FormSection>

                        {/* ── Credentials ─────────────────────────────── */}
                        <FormSection title="Credentials" sectionKey="credentials" expanded={expandedSections.credentials} onToggle={toggleSection}>
                            <p className="text-xs text-muted-foreground mb-3">University & company badges displayed on the profile</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="University Name" value={form.uniName} onChange={(v) => update("uniName", v)} placeholder="University of Oxford" />
                                <Field label="University Logo URL" value={form.uniLogo} onChange={(v) => update("uniLogo", v)} placeholder="https://..." />
                                <Field label="Degree" value={form.uniDegree} onChange={(v) => update("uniDegree", v)} placeholder="BA Economics" />
                                <Field label="Years" value={form.uniYears} onChange={(v) => update("uniYears", v)} placeholder="2021 – 2024" />
                            </div>
                            <div className="border-t border-border/50 mt-5 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Company Name" value={form.companyName} onChange={(v) => update("companyName", v)} placeholder="Goldman Sachs" />
                                <Field label="Company Logo URL" value={form.companyLogo} onChange={(v) => update("companyLogo", v)} placeholder="https://..." />
                                <Field label="Role / Title" value={form.companyRole} onChange={(v) => update("companyRole", v)} placeholder="Incoming Analyst" />
                                <Field label="Landed Offer Labels" value={form.successCompanyLabels} onChange={(v) => update("successCompanyLabels", v)} placeholder="Goldman Sachs, McKinsey, JP Morgan" />
                            </div>
                        </FormSection>

                        {/* ── About & Skills ──────────────────────────── */}
                        <FormSection title="About & Skills" sectionKey="about" expanded={expandedSections.about} onToggle={toggleSection}>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Bio *</label>
                                    <textarea
                                        value={form.bio}
                                        onChange={(e) => update("bio", e.target.value)}
                                        rows={5}
                                        placeholder="Tell students about your background, experience, and coaching approach..."
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
                                    />
                                </div>
                                <Field label="Skills / Tags (comma-separated)" value={form.skills} onChange={(v) => update("skills", v)} placeholder="Interview Prep, CV Review, Investment Banking" />
                            </div>
                        </FormSection>

                        {/* ── Services ────────────────────────────────── */}
                        <FormSection title="Coaching Services" sectionKey="services" expanded={expandedSections.services} onToggle={toggleSection}>
                            <RepeaterSection
                                items={form.services}
                                onUpdate={(items) => update("services", items)}
                                addLabel="Add service"
                                emptyItem={{ name: "", duration: "60 min", price: "", description: "" }}
                                renderItem={(item, i, onItemUpdate) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field label="Service Name" value={item.name} onChange={(v) => onItemUpdate(i, "name", v)} placeholder="Mock Interview" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Duration" value={item.duration} onChange={(v) => onItemUpdate(i, "duration", v)} placeholder="60 min" />
                                            <Field label="Price (£)" value={item.price} onChange={(v) => onItemUpdate(i, "price", v)} placeholder="50" type="number" />
                                        </div>
                                        <Field label="Description" value={item.description} onChange={(v) => onItemUpdate(i, "description", v)} placeholder="What's included" className="sm:col-span-2" />
                                    </div>
                                )}
                            />
                        </FormSection>

                        {/* ── Package (optional) ──────────────────────── */}
                        <FormSection
                            title="Package Deal"
                            sectionKey="package"
                            expanded={expandedSections.package}
                            onToggle={toggleSection}
                            optional
                            enabled={form.enablePackage}
                            onToggleEnabled={() => update("enablePackage", !form.enablePackage)}
                        >
                            {form.enablePackage && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Package Name" value={form.packageName} onChange={(v) => update("packageName", v)} placeholder="IB Application Sprint" />
                                    <Field label="Number of Sessions" value={form.packageSessions} onChange={(v) => update("packageSessions", v)} placeholder="4" type="number" />
                                    <Field label="Package Price (£)" value={form.packagePrice} onChange={(v) => update("packagePrice", v)} placeholder="150" type="number" />
                                    <Field label="Original Price (£)" value={form.packageOriginalPrice} onChange={(v) => update("packageOriginalPrice", v)} placeholder="185" type="number" />
                                    <Field label="Includes" value={form.packageIncludes} onChange={(v) => update("packageIncludes", v)} placeholder="CV Review, Mock Interview, Strategy" className="sm:col-span-2" />
                                </div>
                            )}
                        </FormSection>

                        {/* ── Experience ──────────────────────────────── */}
                        <FormSection title="Experience" sectionKey="experience" expanded={expandedSections.experience} onToggle={toggleSection}>
                            <RepeaterSection
                                items={form.experience}
                                onUpdate={(items) => update("experience", items)}
                                addLabel="Add position"
                                emptyItem={{ role: "", company: "", dates: "", description: "", logo: "" }}
                                renderItem={(item, i, onItemUpdate) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field label="Role" value={item.role} onChange={(v) => onItemUpdate(i, "role", v)} placeholder="Incoming Analyst" />
                                        <Field label="Company" value={item.company} onChange={(v) => onItemUpdate(i, "company", v)} placeholder="Goldman Sachs" />
                                        <Field label="Dates" value={item.dates} onChange={(v) => onItemUpdate(i, "dates", v)} placeholder="Starting 2025" />
                                        <Field label="Logo URL" value={item.logo} onChange={(v) => onItemUpdate(i, "logo", v)} placeholder="https://..." />
                                        <Field label="Description" value={item.description} onChange={(v) => onItemUpdate(i, "description", v)} placeholder="Brief description" className="sm:col-span-2" />
                                    </div>
                                )}
                            />
                        </FormSection>

                        {/* ── Education ───────────────────────────────── */}
                        <FormSection title="Education" sectionKey="education" expanded={expandedSections.education} onToggle={toggleSection}>
                            <RepeaterSection
                                items={form.education}
                                onUpdate={(items) => update("education", items)}
                                addLabel="Add education"
                                emptyItem={{ institution: "", degree: "", years: "", achievement: "", logo: "" }}
                                renderItem={(item, i, onItemUpdate) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Field label="Institution" value={item.institution} onChange={(v) => onItemUpdate(i, "institution", v)} placeholder="University of Oxford" />
                                        <Field label="Degree" value={item.degree} onChange={(v) => onItemUpdate(i, "degree", v)} placeholder="BA Economics" />
                                        <Field label="Years" value={item.years} onChange={(v) => onItemUpdate(i, "years", v)} placeholder="2021 – 2024" />
                                        <Field label="Achievement" value={item.achievement} onChange={(v) => onItemUpdate(i, "achievement", v)} placeholder="First Class Honours" />
                                        <Field label="Logo URL" value={item.logo} onChange={(v) => onItemUpdate(i, "logo", v)} placeholder="https://..." className="sm:col-span-2" />
                                    </div>
                                )}
                            />
                        </FormSection>

                        {/* ── Reviews (optional) ──────────────────────── */}
                        <FormSection
                            title="Reviews"
                            sectionKey="reviews"
                            expanded={expandedSections.reviews}
                            onToggle={toggleSection}
                            optional
                            enabled={form.enableReviews}
                            onToggleEnabled={() => update("enableReviews", !form.enableReviews)}
                        >
                            {form.enableReviews && (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 bg-muted/40 rounded-lg">
                                        <Field label="Overall" value={form.overallRating} onChange={(v) => update("overallRating", v)} placeholder="5.0" />
                                        <Field label="Knowledge" value={form.ratingKnowledge} onChange={(v) => update("ratingKnowledge", v)} placeholder="5.0" />
                                        <Field label="Value" value={form.ratingValue} onChange={(v) => update("ratingValue", v)} placeholder="5.0" />
                                        <Field label="Responsive" value={form.ratingResponsiveness} onChange={(v) => update("ratingResponsiveness", v)} placeholder="5.0" />
                                    </div>
                                    <RepeaterSection
                                        items={form.reviews}
                                        onUpdate={(items) => update("reviews", items)}
                                        addLabel="Add review"
                                        emptyItem={{ name: "", rating: "5", text: "", date: "", outcome: "" }}
                                        renderItem={(item, i, onItemUpdate) => (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <Field label="Reviewer Name" value={item.name} onChange={(v) => onItemUpdate(i, "name", v)} placeholder="James T." />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Field label="Rating" value={item.rating} onChange={(v) => onItemUpdate(i, "rating", v)} placeholder="5" type="number" />
                                                    <Field label="Date" value={item.date} onChange={(v) => onItemUpdate(i, "date", v)} placeholder="2 weeks ago" />
                                                </div>
                                                <Field label="Review Text" value={item.text} onChange={(v) => onItemUpdate(i, "text", v)} placeholder="Review text..." className="sm:col-span-2" />
                                                <Field label="Outcome Badge" value={item.outcome} onChange={(v) => onItemUpdate(i, "outcome", v)} placeholder="Goldman Sachs Offer" className="sm:col-span-2" />
                                            </div>
                                        )}
                                    />
                                </>
                            )}
                        </FormSection>

                        {/* ── UCAT Scores (optional) ──────────────────── */}
                        <FormSection
                            title="UCAT Score Breakdown"
                            sectionKey="ucat"
                            expanded={expandedSections.ucat}
                            onToggle={toggleSection}
                            optional
                            enabled={form.enableUCAT}
                            onToggleEnabled={() => update("enableUCAT", !form.enableUCAT)}
                        >
                            {form.enableUCAT && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-5 gap-2">
                                        {form.ucatScores.map((score, i) => (
                                            <div key={i}>
                                                <label className="text-[10px] font-medium text-muted-foreground mb-1 block text-center">{score.section}</label>
                                                <input
                                                    value={score.score}
                                                    onChange={(e) => {
                                                        const updated = [...form.ucatScores];
                                                        updated[i] = { ...updated[i], score: e.target.value };
                                                        update("ucatScores", updated);
                                                    }}
                                                    placeholder={score.max}
                                                    className="w-full px-2 py-2 rounded-lg border border-border bg-background text-sm text-center text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Field label="SJT Band" value={form.ucatSJTBand} onChange={(v) => update("ucatSJTBand", v)} placeholder="1" type="number" />
                                </div>
                            )}
                        </FormSection>

                        {/* ── Upcoming Event (optional) ───────────────── */}
                        <FormSection
                            title="Upcoming Live Event"
                            sectionKey="event"
                            expanded={expandedSections.event}
                            onToggle={toggleSection}
                            optional
                            enabled={form.enableEvent}
                            onToggleEnabled={() => update("enableEvent", !form.enableEvent)}
                        >
                            {form.enableEvent && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Event Title" value={form.eventTitle} onChange={(v) => update("eventTitle", v)} placeholder="FAANG Interview Q&A" className="sm:col-span-2" />
                                    <Field label="Description" value={form.eventDescription} onChange={(v) => update("eventDescription", v)} placeholder="Live group session..." className="sm:col-span-2" />
                                    <Field label="Date" value={form.eventDate} onChange={(v) => update("eventDate", v)} placeholder="Sat, Feb 15" />
                                    <Field label="Time" value={form.eventTime} onChange={(v) => update("eventTime", v)} placeholder="4:00 PM" />
                                    <Field label="Price" value={form.eventPrice} onChange={(v) => update("eventPrice", v)} placeholder="Free" />
                                    <Field label="Spots Left" value={form.eventSpots} onChange={(v) => update("eventSpots", v)} placeholder="20" type="number" />
                                </div>
                            )}
                        </FormSection>

                        {/* ── Available Slots (optional) ──────────────── */}
                        <FormSection
                            title="Available Time Slots"
                            sectionKey="slots"
                            expanded={expandedSections.slots}
                            onToggle={toggleSection}
                            optional
                            enabled={form.enableSlots}
                            onToggleEnabled={() => update("enableSlots", !form.enableSlots)}
                        >
                            {form.enableSlots && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3 mb-2">
                                        <Field label="Default Next Slot" value={form.nextSlot} onChange={(v) => update("nextSlot", v)} placeholder="Tomorrow 10:00 AM" />
                                        <Field label="Timezone" value={form.timezone} onChange={(v) => update("timezone", v)} placeholder="GMT" />
                                    </div>
                                    <RepeaterSection
                                        items={form.slots}
                                        onUpdate={(items) => update("slots", items)}
                                        addLabel="Add slot"
                                        emptyItem={{ day: "", time: "" }}
                                        renderItem={(item, i, onItemUpdate) => (
                                            <div className="grid grid-cols-2 gap-3">
                                                <Field label="Day" value={item.day} onChange={(v) => onItemUpdate(i, "day", v)} placeholder="Tomorrow" />
                                                <Field label="Time" value={item.time} onChange={(v) => onItemUpdate(i, "time", v)} placeholder="10:00 AM" />
                                            </div>
                                        )}
                                    />
                                </div>
                            )}
                        </FormSection>
                    </div>

                    {/* RIGHT: Live Preview */}
                    <div className="hidden xl:block">
                        <div className="sticky top-24">
                            <div className="flex items-center gap-2 mb-3">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Preview</span>
                            </div>
                            <LivePreview coach={previewCoach} form={form} />
                        </div>
                    </div>
                </div>

                {/* ── Existing Custom Coaches ───────────────────── */}
                {customCoaches.length > 0 && (
                    <div className="mt-12 border-t border-border pt-8">
                        <h2 className="text-lg font-bold text-foreground mb-4">Custom Coaches ({customCoaches.length})</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {customCoaches.map((c) => (
                                <div key={c.profile.id} className="border border-border rounded-xl p-5 bg-background">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                                            {c.browse.avatar}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-semibold text-foreground truncate">{c.profile.name}</div>
                                            <div className="text-xs text-muted-foreground truncate">{c.browse.credential}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                                        <span>£{c.profile.hourlyRate}/hr</span>
                                        <span>·</span>
                                        <span>{c.browse.category}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(c)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <Link
                                            to={`/coach/${c.profile.id}`}
                                            target="_blank"
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
                                        >
                                            <ExternalLink className="w-3 h-3" /> View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(c.profile.id)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════ */
/* REUSABLE COMPONENTS                                        */
/* ═══════════════════════════════════════════════════════════ */

/* ── Form Section ──────────────────────────────────────────── */

function FormSection({
    title, sectionKey, expanded, onToggle, children,
    optional, enabled, onToggleEnabled,
}: {
    title: string; sectionKey: string; expanded: boolean;
    onToggle: (key: string) => void; children: React.ReactNode;
    optional?: boolean; enabled?: boolean; onToggleEnabled?: () => void;
}) {
    return (
        <div className="border border-border rounded-xl overflow-hidden bg-background">
            <button
                onClick={() => onToggle(sectionKey)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-sm font-semibold text-foreground">{title}</span>
                    {optional && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">OPTIONAL</span>
                    )}
                </div>
                {optional && onToggleEnabled && (
                    <div
                        onClick={(e) => { e.stopPropagation(); onToggleEnabled(); }}
                        className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-colors ${enabled ? "bg-foreground" : "bg-border"}`}
                        style={{ width: 40, height: 22 }}
                    >
                        <div
                            className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-background shadow transition-transform"
                            style={{
                                width: 18, height: 18, top: 2,
                                transform: enabled ? "translateX(20px)" : "translateX(2px)",
                            }}
                        />
                    </div>
                )}
            </button>
            {expanded && <div className="px-5 pb-5">{children}</div>}
        </div>
    );
}

/* ── Field ─────────────────────────────────────────────────── */

function Field({
    label, value, onChange, placeholder, type = "text", className = "", options,
}: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; className?: string; options?: string[];
}) {
    return (
        <div className={className}>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
            {type === "select" && options ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 appearance-none cursor-pointer"
                >
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
            ) : (
                <input
                    type={type === "number" ? "text" : type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
            )}
        </div>
    );
}

/* ── Repeater ──────────────────────────────────────────────── */

function RepeaterSection<T extends Record<string, string>>({
    items, onUpdate, addLabel, emptyItem, renderItem,
}: {
    items: T[]; onUpdate: (items: T[]) => void;
    addLabel: string; emptyItem: T;
    renderItem: (item: T, index: number, onItemUpdate: (i: number, key: string, value: string) => void) => React.ReactNode;
}) {
    const onItemUpdate = (i: number, key: string, value: string) => {
        const updated = [...items];
        updated[i] = { ...updated[i], [key]: value };
        onUpdate(updated);
    };

    const addItem = () => onUpdate([...items, { ...emptyItem }]);

    const removeItem = (i: number) => {
        if (items.length <= 1) return;
        onUpdate(items.filter((_, idx) => idx !== i));
    };

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="relative border border-border/50 rounded-lg p-4 bg-muted/10">
                    {items.length > 1 && (
                        <button
                            onClick={() => removeItem(i)}
                            className="absolute top-3 right-3 p-1 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                    {renderItem(item, i, onItemUpdate)}
                </div>
            ))}
            <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
                <Plus className="w-3.5 h-3.5" /> {addLabel}
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════ */
/* LIVE PREVIEW                                                */
/* ═══════════════════════════════════════════════════════════ */

function LivePreview({ coach, form }: { coach: StoredCoach | null; form: FormState }) {
    if (!form.name.trim()) {
        return (
            <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Start typing to see a preview</p>
            </div>
        );
    }

    const p = coach?.profile;
    if (!p) return null;

    const initials = p.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="border border-border rounded-2xl overflow-hidden bg-background">
            {/* Mini profile preview */}
            <div className="p-5 border-b border-border/50">
                <div className="flex gap-3 items-start mb-3">
                    {p.photo ? (
                        <img src={p.photo} alt="" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[15px] font-bold text-foreground">{p.name}</span>
                            <span className="bg-foreground text-background text-[8px] font-semibold px-1.5 py-0.5 rounded-full">VERIFIED</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug truncate">{p.tagline}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className={`w-3 h-3 ${i <= Math.round(p.rating) ? "fill-foreground text-foreground" : "fill-none text-border"}`} />
                                ))}
                            </div>
                            <span className="text-[11px] font-semibold text-foreground">{p.rating}</span>
                        </div>
                    </div>
                </div>

                {/* Credential badges */}
                {(p.university.name || p.company.name) && (
                    <div className="flex flex-col gap-1.5 mb-3">
                        {p.university.name && (
                            <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-1.5">
                                {p.university.logo && <img src={p.university.logo} alt="" className="w-5 h-5 object-contain rounded flex-shrink-0" />}
                                <span className="text-[11px] text-muted-foreground">
                                    Studied at <strong className="text-foreground">{p.university.name.replace("University of ", "")}</strong>
                                </span>
                            </div>
                        )}
                        {p.company.name && (
                            <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-1.5">
                                {p.company.logo && <img src={p.company.logo} alt="" className="w-5 h-5 object-contain rounded flex-shrink-0" />}
                                <span className="text-[11px]">
                                    <strong className="text-foreground">{p.company.role}</strong>
                                    <span className="text-muted-foreground"> at {p.company.name}</span>
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Skills */}
                {p.skills.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                        {p.skills.map((s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Services preview */}
            {p.services.length > 0 && (
                <div className="p-5 border-b border-border/50">
                    <div className="text-xs font-semibold text-foreground mb-2.5">Services</div>
                    {p.services.map((s, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                            <div>
                                <div className="text-xs font-medium text-foreground">{s.name}</div>
                                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" /> {s.duration}
                                </div>
                            </div>
                            <span className="text-xs font-bold text-foreground">£{s.price}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Package preview */}
            {p.package && (
                <div className="mx-5 my-3 bg-foreground rounded-xl px-4 py-3 text-background">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-xs font-semibold">{p.package.name}</div>
                            <div className="text-[10px] text-background/70">{p.package.sessions} sessions</div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-bold">£{p.package.price}</span>
                            <span className="text-[10px] text-background/40 line-through ml-1">£{p.package.originalPrice}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* UCAT preview */}
            {p.ucatScores && p.ucatScores.length > 0 && (
                <div className="p-5 border-b border-border/50">
                    <div className="text-xs font-semibold text-foreground mb-2.5">UCAT Scores</div>
                    <div className="grid grid-cols-5 gap-1.5">
                        {p.ucatScores.map((s, i) => {
                            const isTotal = i === p.ucatScores!.length - 1;
                            return (
                                <div key={i} className={`rounded-lg px-1.5 py-2 text-center ${isTotal ? "bg-foreground text-background" : "bg-muted/50 border border-border"}`}>
                                    <div className={`text-[8px] font-semibold mb-0.5 ${isTotal ? "text-background/70" : "text-muted-foreground"}`}>{s.section}</div>
                                    <div className={`text-sm font-bold ${isTotal ? "text-background" : "text-foreground"}`}>{s.score}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Event preview */}
            {p.upcomingEvent && (
                <div className="mx-5 my-3 bg-foreground rounded-xl px-4 py-3 text-background">
                    <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-[8px] bg-white/15 px-1.5 py-0.5 rounded-full font-semibold">🔴 LIVE EVENT</span>
                    </div>
                    <div className="text-xs font-bold mb-0.5">{p.upcomingEvent.title}</div>
                    <div className="flex gap-2 text-[10px] text-background/70">
                        <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {p.upcomingEvent.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {p.upcomingEvent.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-bold">{p.upcomingEvent.price}</span>
                        <span className="bg-background text-foreground rounded-md px-3 py-1 text-[10px] font-bold">Register →</span>
                    </div>
                </div>
            )}

            {/* Sidebar preview */}
            <div className="p-5">
                <button className="w-full py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold mb-2">
                    Schedule a free intro
                </button>
                <button className="w-full py-2.5 rounded-xl border border-border text-foreground text-xs font-medium">
                    Book a session. £{p.hourlyRate}/hr
                </button>
                <div className="mt-3 p-2.5 rounded-xl bg-muted/40 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <div>
                        <div className="text-[10px] font-semibold text-foreground">Protected by EarlyEdge</div>
                        <div className="text-[9px] text-muted-foreground">100% Guarantee</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
