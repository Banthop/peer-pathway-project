import { useState, useMemo, useCallback } from "react";
import {
    Users, Search, Download, Plus, X, ChevronDown,
    Loader2, Mail, Phone, GraduationCap, Tag, MessageSquare,
    ExternalLink, Pencil, Check, Trash2, RefreshCw,
    MousePointerClick, Send, Eye, AlertTriangle, ShoppingCart,
    UserCheck, UserX, Zap, Target, Gift, Clock, ArrowRight,
    FileText, Copy, Play
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CrmSource, CrmStatus } from "@/integrations/supabase/types";

/* ═══════════════════════════════════════════════════════════════ */
/* Constants                                                       */
/* ═══════════════════════════════════════════════════════════════ */

const SOURCES: { value: CrmSource; label: string; color: string }[] = [
    { value: "webinar", label: "Webinar", color: "bg-purple-100 text-purple-700" },
    { value: "coach_signup", label: "Coach Signup", color: "bg-blue-100 text-blue-700" },
    { value: "student_signup", label: "Student Signup", color: "bg-emerald-100 text-emerald-700" },
    { value: "linkedin", label: "LinkedIn", color: "bg-sky-100 text-sky-700" },
    { value: "manual", label: "Manual", color: "bg-gray-100 text-gray-700" },
    { value: "other", label: "Other", color: "bg-amber-100 text-amber-700" },
];

const STATUSES: { value: CrmStatus; label: string; color: string }[] = [
    { value: "new", label: "New", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { value: "contacted", label: "Contacted", color: "bg-amber-50 text-amber-600 border-amber-200" },
    { value: "engaged", label: "Engaged", color: "bg-violet-50 text-violet-600 border-violet-200" },
    { value: "converted", label: "Converted", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { value: "unsubscribed", label: "Unsubscribed", color: "bg-red-50 text-red-500 border-red-200" },
];

/* ─── Smart Segments ─────────────────────────────────── */
type SegmentKey = "all" | "scraped_not_emailed" | "emailed_no_click" | "clicked_not_bought"
    | "form_no_discount" | "form_not_bought" | "bought" | "resend_only" | "bounced" | "unsubscribed" | "hot_leads";

interface Segment {
    key: SegmentKey;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    filter: (c: any) => boolean;
}

const hasTags = (c: any, ...tags: string[]) => tags.every(t => (c.tags || []).includes(t));
const hasAnyTag = (c: any, ...tags: string[]) => tags.some(t => (c.tags || []).includes(t));
const noTag = (c: any, t: string) => !(c.tags || []).includes(t);

const SEGMENTS: Segment[] = [
    {
        key: "all", label: "All Contacts", description: "Everyone in the CRM",
        icon: Users, color: "bg-gray-100 text-gray-600 border-gray-200",
        filter: () => true,
    },
    {
        key: "scraped_not_emailed", label: "Scraped → No Email", description: "Left email on LinkedIn but never sent anything",
        icon: AlertTriangle, color: "bg-orange-50 text-orange-600 border-orange-200",
        filter: (c) => hasTags(c, "linkedin_scraped") && noTag(c, "linkedin_emailed") && noTag(c, "email_sent"),
    },
    {
        key: "emailed_no_click", label: "Emailed → No Click", description: "Received email but never clicked",
        icon: Send, color: "bg-amber-50 text-amber-600 border-amber-200",
        filter: (c) => hasAnyTag(c, "linkedin_emailed", "email_sent", "email_delivered") && noTag(c, "email_clicked"),
    },
    {
        key: "clicked_not_bought", label: "Clicked → Didn't Buy", description: "Clicked the email link but didn't purchase",
        icon: MousePointerClick, color: "bg-violet-50 text-violet-600 border-violet-200",
        filter: (c) => hasTags(c, "email_clicked") && noTag(c, "stripe_customer"),
    },
    {
        key: "form_no_discount", label: "Form Lead → No Discount", description: "Filled form, didn't buy, hasn't received discount email",
        icon: Gift, color: "bg-pink-50 text-pink-600 border-pink-200",
        filter: (c) => hasTags(c, "form_lead") && noTag(c, "stripe_customer") && noTag(c, "email_sent"),
    },
    {
        key: "form_not_bought", label: "Form Lead → Didn't Buy", description: "Filled form but never purchased",
        icon: ShoppingCart, color: "bg-red-50 text-red-500 border-red-200",
        filter: (c) => hasTags(c, "form_lead") && noTag(c, "stripe_customer"),
    },
    {
        key: "hot_leads", label: "🔥 Hot Leads", description: "Clicked email + filled form but didn't buy yet",
        icon: Zap, color: "bg-yellow-50 text-yellow-600 border-yellow-300",
        filter: (c) => (hasTags(c, "email_clicked") || hasTags(c, "form_lead")) && noTag(c, "stripe_customer") && noTag(c, "bounced"),
    },
    {
        key: "bought", label: "Customers", description: "Paid via Stripe",
        icon: UserCheck, color: "bg-emerald-50 text-emerald-600 border-emerald-200",
        filter: (c) => hasTags(c, "stripe_customer"),
    },
    {
        key: "resend_only", label: "Resend Only", description: "In Resend audience but not in LinkedIn or forms",
        icon: Mail, color: "bg-sky-50 text-sky-600 border-sky-200",
        filter: (c) => hasTags(c, "resend_audience") && noTag(c, "linkedin_scraped") && noTag(c, "form_lead") && noTag(c, "stripe_customer"),
    },
    {
        key: "bounced", label: "Bounced", description: "Email bounced — bad address",
        icon: AlertTriangle, color: "bg-red-50 text-red-400 border-red-200",
        filter: (c) => hasTags(c, "bounced"),
    },
    {
        key: "unsubscribed", label: "Unsubscribed", description: "Opted out of emails",
        icon: UserX, color: "bg-gray-100 text-gray-400 border-gray-200",
        filter: (c) => c.status === "unsubscribed" || hasTags(c, "resend_unsubscribed"),
    },
];

/* ═══════════════════════════════════════════════════════════════ */
/* Hooks                                                           */
/* ═══════════════════════════════════════════════════════════════ */

function useCrmContacts() {
    return useQuery({
        queryKey: ["crm-contacts"],
        queryFn: async () => {
            const { data, error } = await supabase!
                .from("crm_contacts")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data as any[];
        },
    });
}

function useUpdateContact() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
            const { error } = await supabase!
                .from("crm_contacts")
                .update({ ...updates, last_activity_at: new Date().toISOString() })
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-contacts"] }),
    });
}

function useDeleteContact() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase!.from("crm_contacts").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-contacts"] }),
    });
}

function useEmailTemplates() {
    return useQuery({
        queryKey: ["crm-email-templates"],
        queryFn: async () => {
            const { data, error } = await supabase!.from("crm_email_templates").select("*").order("created_at", { ascending: false });
            if (error) throw error;
            return data as any[];
        },
    });
}

function useSaveTemplate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (template: { id?: string; name: string; subject: string; body_html: string; segment: string }) => {
            if (template.id) {
                const { error } = await supabase!.from("crm_email_templates").update({ name: template.name, subject: template.subject, body_html: template.body_html, segment: template.segment, updated_at: new Date().toISOString() }).eq("id", template.id);
                if (error) throw error;
            } else {
                const { error } = await supabase!.from("crm_email_templates").insert({ name: template.name, subject: template.subject, body_html: template.body_html, segment: template.segment });
                if (error) throw error;
            }
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-email-templates"] }),
    });
}

function useDeleteTemplate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase!.from("crm_email_templates").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-email-templates"] }),
    });
}

function useEmailSends() {
    return useQuery({
        queryKey: ["crm-email-sends"],
        queryFn: async () => {
            const { data, error } = await supabase!.from("crm_email_sends").select("*").order("sent_at", { ascending: false }).limit(200);
            if (error) throw error;
            return data as any[];
        },
    });
}

function useAddContact() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (contact: {
            email: string; first_name: string; last_name: string;
            source: CrmSource; phone?: string; university?: string; notes?: string;
        }) => {
            const { error } = await supabase!.from("crm_contacts").insert({
                ...contact,
                status: "new" as CrmStatus,
                tags: [],
                metadata: {},
                last_activity_at: new Date().toISOString(),
            });
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-contacts"] }),
    });
}

/* ═══════════════════════════════════════════════════════════════ */
/* Helper: derive engagement info from tags/metadata               */
/* ═══════════════════════════════════════════════════════════════ */

function getEngagement(c: any) {
    const tags: string[] = c.tags || [];
    const meta = c.metadata || {};
    return {
        scraped: tags.includes("linkedin_scraped"),
        emailed: tags.includes("linkedin_emailed") || tags.includes("email_sent"),
        delivered: tags.includes("email_delivered"),
        opened: tags.includes("email_opened"),
        clicked: tags.includes("email_clicked"),
        bounced: tags.includes("bounced"),
        formLead: tags.includes("form_lead"),
        customer: tags.includes("stripe_customer"),
        resend: tags.includes("resend_audience"),
        unsubscribed: tags.includes("resend_unsubscribed"),
        emailCount: meta.emails_sent || 0,
        lastEmailStatus: meta.last_email_status || null,
        lastEmailSubject: meta.last_email_subject || null,
        lastEmailDate: meta.last_email_date || null,
        stripeSpend: meta.stripe_spend || 0,
    };
}

/* ═══════════════════════════════════════════════════════════════ */
/* Sub Components                                                  */
/* ═══════════════════════════════════════════════════════════════ */

function StatCard({ label, value, sub, icon: Icon, accent }: {
    label: string; value: string | number; sub?: string;
    icon: React.ElementType; accent?: string;
}) {
    return (
        <div className="bg-background border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent || "bg-muted"}`}>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
    );
}

function SourceBadge({ source }: { source: CrmSource }) {
    const s = SOURCES.find(s => s.value === source) || SOURCES[5];
    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.color}`}>
            {s.label}
        </span>
    );
}

/* ─── Engagement Pills (show email journey inline) ─── */
function EngagementPills({ contact }: { contact: any }) {
    const e = getEngagement(contact);
    const pills: { label: string; color: string; icon: React.ElementType }[] = [];

    if (e.customer) pills.push({ label: "Paid", color: "bg-emerald-100 text-emerald-700", icon: ShoppingCart });
    if (e.clicked) pills.push({ label: "Clicked", color: "bg-violet-100 text-violet-700", icon: MousePointerClick });
    else if (e.delivered) pills.push({ label: "Delivered", color: "bg-blue-100 text-blue-700", icon: Check });
    else if (e.emailed) pills.push({ label: "Sent", color: "bg-amber-100 text-amber-700", icon: Send });
    if (e.formLead && !e.customer) pills.push({ label: "Form Lead", color: "bg-pink-100 text-pink-700", icon: Target });
    if (e.bounced) pills.push({ label: "Bounced", color: "bg-red-100 text-red-600", icon: AlertTriangle });
    if (e.scraped && !e.emailed) pills.push({ label: "Not Emailed", color: "bg-orange-100 text-orange-600", icon: Clock });

    if (pills.length === 0) return <span className="text-[10px] text-muted-foreground/40">—</span>;

    return (
        <div className="flex flex-wrap gap-1">
            {pills.map((p, i) => (
                <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 ${p.color}`}>
                    <p.icon className="w-2.5 h-2.5" />{p.label}
                </span>
            ))}
        </div>
    );
}

function StatusDropdown({ status, contactId, onUpdate }: {
    status: CrmStatus; contactId: string;
    onUpdate: (id: string, updates: Record<string, unknown>) => void;
}) {
    const [open, setOpen] = useState(false);
    const current = STATUSES.find(s => s.value === status) || STATUSES[0];
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-medium border flex items-center gap-1 transition-colors ${current.color}`}
            >
                {current.label}
                <ChevronDown className="w-3 h-3" />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-50 py-1 min-w-[130px]">
                        {STATUSES.map(s => (
                            <button
                                key={s.value}
                                onClick={() => { onUpdate(contactId, { status: s.value }); setOpen(false); }}
                                className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-muted ${status === s.value ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

/* ─── Contact Detail Slide-over ──────────────────────── */
function ContactDetail({ contact, onClose, onUpdate, onDelete }: {
    contact: any; onClose: () => void;
    onUpdate: (id: string, updates: Record<string, unknown>) => void;
    onDelete: (id: string) => void;
}) {
    const [notes, setNotes] = useState(contact.notes || "");
    const [editingNotes, setEditingNotes] = useState(false);
    const [newTag, setNewTag] = useState("");
    const e = getEngagement(contact);

    const handleSaveNotes = () => { onUpdate(contact.id, { notes }); setEditingNotes(false); };
    const handleAddTag = () => {
        const tag = newTag.trim().toLowerCase();
        if (!tag || (contact.tags || []).includes(tag)) return;
        onUpdate(contact.id, { tags: [...(contact.tags || []), tag] });
        setNewTag("");
    };
    const handleRemoveTag = (tag: string) => {
        onUpdate(contact.id, { tags: (contact.tags || []).filter((t: string) => t !== tag) });
    };

    // Journey timeline
    const journey: { label: string; done: boolean; icon: React.ElementType; detail?: string }[] = [
        { label: "Email scraped", done: e.scraped, icon: Eye, detail: "From LinkedIn comments" },
        { label: "Email sent", done: e.emailed, icon: Send, detail: e.lastEmailSubject ? `"${e.lastEmailSubject}"` : undefined },
        { label: "Email delivered", done: e.delivered, icon: Check },
        { label: "Email clicked", done: e.clicked, icon: MousePointerClick },
        { label: "Filled form", done: e.formLead, icon: Target },
        { label: "Purchased", done: e.customer, icon: ShoppingCart, detail: e.stripeSpend ? `£${e.stripeSpend}` : undefined },
    ];

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-background border-l border-border z-50 overflow-y-auto shadow-2xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground">
                                {contact.first_name || ""} {contact.last_name || ""}
                                {!contact.first_name && !contact.last_name && <span className="text-muted-foreground">Unknown</span>}
                            </h2>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                <Mail className="w-3.5 h-3.5" /> {contact.email}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Journey Timeline */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Journey</h3>
                        <div className="space-y-0">
                            {journey.map((step, i) => (
                                <div key={i} className="flex items-start gap-3 relative">
                                    {i < journey.length - 1 && (
                                        <div className={`absolute left-[11px] top-6 w-0.5 h-full ${step.done ? "bg-emerald-300" : "bg-border"}`} />
                                    )}
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${step.done ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground/40"}`}>
                                        <step.icon className="w-3 h-3" />
                                    </div>
                                    <div className="pb-4">
                                        <p className={`text-xs font-medium ${step.done ? "text-foreground" : "text-muted-foreground/50"}`}>{step.label}</p>
                                        {step.detail && step.done && (
                                            <p className="text-[10px] text-muted-foreground">{step.detail}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="space-y-3 mb-6">
                        {contact.phone && (
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-foreground">{contact.phone}</span>
                            </div>
                        )}
                        {contact.university && (
                            <div className="flex items-center gap-3 text-sm">
                                <GraduationCap className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-foreground">{contact.university}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-sm">
                            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <SourceBadge source={contact.source} />
                            {contact.source_detail && <span className="text-xs text-muted-foreground">{contact.source_detail}</span>}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <RefreshCw className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <StatusDropdown status={contact.status} contactId={contact.id} onUpdate={onUpdate} />
                        </div>
                    </div>

                    {/* Email History */}
                    {(e.emailed || e.lastEmailDate) && (
                        <div className="mb-6 bg-muted/30 rounded-xl p-4 border border-border">
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> Email Activity
                            </h3>
                            <div className="space-y-1.5 text-xs">
                                {e.emailCount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Emails sent</span><span className="font-medium">{e.emailCount}</span></div>}
                                {e.lastEmailStatus && <div className="flex justify-between"><span className="text-muted-foreground">Last status</span><span className={`font-medium ${e.lastEmailStatus === "clicked" ? "text-violet-600" : e.lastEmailStatus === "bounced" ? "text-red-500" : ""}`}>{e.lastEmailStatus}</span></div>}
                                {e.lastEmailSubject && <div className="flex justify-between"><span className="text-muted-foreground">Subject</span><span className="font-medium truncate ml-4">{e.lastEmailSubject}</span></div>}
                                {e.lastEmailDate && <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{new Date(e.lastEmailDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span></div>}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Tags
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {(contact.tags || []).map((tag: string) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                                    {tag}
                                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 transition-colors">
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-1.5">
                            <input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddTag()} placeholder="Add tag..." className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                            <button onClick={handleAddTag} className="px-2.5 py-1.5 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Notes</h3>
                            {!editingNotes && <button onClick={() => setEditingNotes(true)} className="text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>}
                        </div>
                        {editingNotes ? (
                            <div className="space-y-2">
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none" placeholder="Add notes..." />
                                <div className="flex gap-2">
                                    <button onClick={handleSaveNotes} className="px-3 py-1.5 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-1"><Check className="w-3 h-3" /> Save</button>
                                    <button onClick={() => { setEditingNotes(false); setNotes(contact.notes || ""); }} className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.notes || "No notes yet."}</p>
                        )}
                    </div>

                    {/* Metadata */}
                    {contact.metadata && Object.keys(contact.metadata).length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Raw Data</h3>
                            <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                                {Object.entries(contact.metadata).map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-xs">
                                        <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                                        <span className="text-foreground font-medium">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="border-t border-border pt-4 mb-6 space-y-1.5">
                        <p className="text-[10px] text-muted-foreground">Added: {new Date(contact.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                        <p className="text-[10px] text-muted-foreground">Last activity: {new Date(contact.last_activity_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>

                    {/* Delete */}
                    <button onClick={() => { onDelete(contact.id); onClose(); }} className="w-full px-4 py-2.5 border border-red-200 text-red-500 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" /> Delete Contact
                    </button>
                </div>
            </div>
        </>
    );
}

/* ─── Add Contact Modal ──────────────────────────────── */
function AddContactModal({ onClose, onAdd }: {
    onClose: () => void;
    onAdd: (c: { email: string; first_name: string; last_name: string; source: CrmSource; phone?: string; university?: string; notes?: string }) => void;
}) {
    const [form, setForm] = useState({ email: "", first_name: "", last_name: "", source: "manual" as CrmSource, phone: "", university: "", notes: "" });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email.trim()) return;
        onAdd({ ...form, email: form.email.toLowerCase().trim(), phone: form.phone || undefined, university: form.university || undefined, notes: form.notes || undefined });
        onClose();
    };
    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <form onSubmit={handleSubmit} className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-bold text-foreground">Add Contact</h2>
                        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="First name" className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                        <input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Last name" className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                    </div>
                    <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email *" required type="email" className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                    <div className="grid grid-cols-2 gap-3">
                        <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                        <input value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))} placeholder="University" className="px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                    </div>
                    <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value as CrmSource }))} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20">
                        {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Notes..." rows={2} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none" />
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-1.5"><Plus className="w-4 h-4" /> Add Contact</button>
                        <button type="button" onClick={onClose} className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════ */
/* Main Page                                                       */
/* ═══════════════════════════════════════════════════════════════ */

export default function AdminCRM() {
    const { data: contacts = [], isLoading, error } = useCrmContacts();
    const updateContact = useUpdateContact();
    const deleteContact = useDeleteContact();
    const addContact = useAddContact();

    const { data: templates = [] } = useEmailTemplates();
    const { data: emailSends = [] } = useEmailSends();
    const saveTemplate = useSaveTemplate();
    const deleteTemplate = useDeleteTemplate();

    const [search, setSearch] = useState("");
    const [filterSource, setFilterSource] = useState<CrmSource | "all">("all");
    const [filterStatus, setFilterStatus] = useState<CrmStatus | "all">("all");
    const [activeSegment, setActiveSegment] = useState<SegmentKey>("all");
    const [selectedContact, setSelectedContact] = useState<any | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [activeTab, setActiveTab] = useState<"contacts" | "emails">("contacts");
    const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

    const handleUpdate = useCallback((id: string, updates: Record<string, unknown>) => {
        updateContact.mutate({ id, updates });
        if (selectedContact?.id === id) setSelectedContact((prev: any) => prev ? { ...prev, ...updates } : null);
    }, [updateContact, selectedContact]);

    const handleDelete = useCallback((id: string) => { deleteContact.mutate(id); }, [deleteContact]);

    const segment = SEGMENTS.find(s => s.key === activeSegment) || SEGMENTS[0];

    const filtered = useMemo(() => {
        return contacts.filter((c: any) => {
            const q = search.toLowerCase();
            const matchSearch = !q ||
                c.email?.toLowerCase().includes(q) ||
                c.first_name?.toLowerCase().includes(q) ||
                c.last_name?.toLowerCase().includes(q) ||
                c.university?.toLowerCase().includes(q) ||
                (c.tags || []).some((t: string) => t.toLowerCase().includes(q));
            const matchSource = filterSource === "all" || c.source === filterSource;
            const matchStatus = filterStatus === "all" || c.status === filterStatus;
            const matchSegment = segment.filter(c);
            return matchSearch && matchSource && matchStatus && matchSegment;
        });
    }, [contacts, search, filterSource, filterStatus, segment]);

    const segmentCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const s of SEGMENTS) counts[s.key] = contacts.filter(s.filter).length;
        return counts;
    }, [contacts]);

    const stats = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return {
            total: contacts.length,
            newThisWeek: contacts.filter((c: any) => new Date(c.created_at) > weekAgo).length,
            converted: contacts.filter((c: any) => c.status === "converted").length,
            emailsSent: contacts.filter((c: any) => (c.tags || []).includes("email_sent") || (c.tags || []).includes("linkedin_emailed")).length,
            clicked: contacts.filter((c: any) => (c.tags || []).includes("email_clicked")).length,
        };
    }, [contacts]);

    const exportCSV = () => {
        const headers = ["Email", "First Name", "Last Name", "Phone", "University", "Source", "Status", "Tags", "Notes", "Created"];
        const rows = filtered.map((c: any) => [
            c.email, c.first_name, c.last_name, c.phone || "",
            c.university || "", c.source, c.status,
            (c.tags || []).join("; "), (c.notes || "").replace(/"/g, '""'),
            new Date(c.created_at).toLocaleDateString("en-GB"),
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `crm-${activeSegment}-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div>
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Users className="w-6 h-6" /> CRM
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage contacts from forms, signups, and outreach
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {activeTab === "contacts" && (
                            <>
                                <button onClick={exportCSV} className="px-3 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                                    <Download className="w-3.5 h-3.5" /> Export CSV
                                </button>
                                <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-1.5">
                                    <Plus className="w-3.5 h-3.5" /> Add Contact
                                </button>
                            </>
                        )}
                        {activeTab === "emails" && (
                            <button onClick={() => setEditingTemplate({ name: "", subject: "", body_html: "", segment: "all" })} className="px-4 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-1.5">
                                <Plus className="w-3.5 h-3.5" /> New Template
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-muted/50 rounded-lg p-1 w-fit">
                    <button onClick={() => setActiveTab("contacts")} className={`px-4 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === "contacts" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                        <Users className="w-3.5 h-3.5" /> Contacts <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded-full bg-muted">{contacts.length}</span>
                    </button>
                    <button onClick={() => setActiveTab("emails")} className={`px-4 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === "emails" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                        <Mail className="w-3.5 h-3.5" /> Emails <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded-full bg-muted">{templates.length}</span>
                    </button>
                </div>

                {activeTab === "contacts" && (<>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                    <StatCard label="Total" value={stats.total} icon={Users} sub={`${stats.newThisWeek} this week`} />
                    <StatCard label="Emailed" value={stats.emailsSent} icon={Send} sub={`${stats.total ? Math.round((stats.emailsSent / stats.total) * 100) : 0}% of all`} accent="bg-amber-100" />
                    <StatCard label="Clicked" value={stats.clicked} icon={MousePointerClick} sub={`${stats.emailsSent ? Math.round((stats.clicked / stats.emailsSent) * 100) : 0}% CTR`} accent="bg-violet-100" />
                    <StatCard label="Converted" value={stats.converted} icon={ShoppingCart} sub={`${stats.total ? Math.round((stats.converted / stats.total) * 100) : 0}% rate`} accent="bg-emerald-100" />
                    <StatCard label="Not Emailed" value={segmentCounts.scraped_not_emailed || 0} icon={AlertTriangle} sub="Need outreach" accent="bg-orange-100" />
                </div>

                {/* Smart Segments */}
                <div className="mb-6">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Segments</p>
                    <div className="flex flex-wrap gap-2">
                        {SEGMENTS.map(s => (
                            <button
                                key={s.key}
                                onClick={() => setActiveSegment(s.key)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${activeSegment === s.key
                                    ? `${s.color} ring-1 ring-current/20 shadow-sm`
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                                    }`}
                                title={s.description}
                            >
                                <s.icon className="w-3.5 h-3.5" />
                                {s.label}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeSegment === s.key ? "bg-current/10" : "bg-muted"}`}>
                                    {segmentCounts[s.key] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                    {activeSegment !== "all" && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                            <ArrowRight className="w-3 h-3" /> {segment.description}
                        </p>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search name, email, university, or tag..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                        />
                        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>}
                    </div>
                    <div className="flex gap-2">
                        <select value={filterSource} onChange={e => setFilterSource(e.target.value as CrmSource | "all")} className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20">
                            <option value="all">All Sources</option>
                            {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as CrmStatus | "all")} className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20">
                            <option value="all">All Statuses</option>
                            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <p className="text-xs text-muted-foreground mb-3">
                    {filtered.length} contact{filtered.length !== 1 ? "s" : ""}
                    {(filterSource !== "all" || filterStatus !== "all" || search || activeSegment !== "all") && " (filtered)"}
                </p>

                {/* Table */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Loading contacts...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-sm text-red-500 mb-2">Failed to load contacts</p>
                        <p className="text-xs text-muted-foreground">
                            Have you run the <code className="bg-muted px-1.5 py-0.5 rounded text-[11px]">003_crm_contacts.sql</code> migration?
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">
                            {contacts.length === 0 ? "No contacts yet." : `No contacts in "${segment.label}" segment.`}
                        </p>
                    </div>
                ) : (
                    <div className="bg-background border border-border rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Engagement</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Source</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Added</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filtered.map((contact: any) => (
                                        <tr key={contact.id} onClick={() => setSelectedContact(contact)} className="hover:bg-muted/30 transition-colors cursor-pointer">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground border border-border flex-shrink-0">
                                                        {(contact.first_name?.[0] || "").toUpperCase()}{(contact.last_name?.[0] || "").toUpperCase() || "?"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-foreground truncate">
                                                            {contact.first_name || ""} {contact.last_name || ""}
                                                            {!contact.first_name && !contact.last_name && <span className="text-muted-foreground font-normal">Unknown</span>}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <EngagementPills contact={contact} />
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <SourceBadge source={contact.source} />
                                            </td>
                                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                <StatusDropdown status={contact.status} contactId={contact.id} onUpdate={handleUpdate} />
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(contact.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </>)}

                {activeTab === "emails" && (
                    <div className="space-y-6">
                        {/* Template list */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {templates.length === 0 && (
                                <div className="col-span-2 text-center py-16">
                                    <Mail className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                                    <p className="text-sm text-muted-foreground">No email templates yet.</p>
                                    <button onClick={() => setEditingTemplate({ name: "", subject: "", body_html: "", segment: "all" })} className="mt-3 px-4 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors inline-flex items-center gap-1.5">
                                        <Plus className="w-3.5 h-3.5" /> Create Template
                                    </button>
                                </div>
                            )}
                            {templates.map((t: any) => {
                                const sendsForTemplate = emailSends.filter((s: any) => s.template_id === t.id);
                                return (
                                    <div key={t.id} className="bg-background border border-border rounded-xl p-5 hover:border-foreground/20 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-foreground truncate">{t.name}</h3>
                                                <p className="text-xs text-muted-foreground mt-0.5 truncate">Subject: {t.subject}</p>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground ml-2 flex-shrink-0">{t.segment}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1"><Send className="w-3 h-3" /> {sendsForTemplate.length} sent</span>
                                            <span>Created {new Date(t.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setPreviewTemplate(t)} className="flex-1 px-3 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1">
                                                <Eye className="w-3 h-3" /> Preview
                                            </button>
                                            <button onClick={() => setEditingTemplate(t)} className="flex-1 px-3 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1">
                                                <Pencil className="w-3 h-3" /> Edit
                                            </button>
                                            <button onClick={() => { const cmd = `node scripts/send-crm-email.mjs --template="${t.name}" --dry-run`; navigator.clipboard.writeText(cmd); alert(`Copied to clipboard!\n\n${cmd}\n\nRun this in terminal. Add --send to send for real.`); }} className="flex-1 px-3 py-2 bg-foreground text-background rounded-lg text-xs font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-1">
                                                <Play className="w-3 h-3" /> Send
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Recent sends log */}
                        {emailSends.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Recent Sends</h3>
                                <div className="bg-background border border-border rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead><tr className="border-b border-border bg-muted/30">
                                            <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase">Email</th>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase">Status</th>
                                            <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase">Sent</th>
                                        </tr></thead>
                                        <tbody className="divide-y divide-border">
                                            {emailSends.slice(0, 20).map((s: any) => (
                                                <tr key={s.id}>
                                                    <td className="px-4 py-2 text-xs text-foreground">{s.email}</td>
                                                    <td className="px-4 py-2"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.status === "sent" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{s.status}</span></td>
                                                    <td className="px-4 py-2 text-[10px] text-muted-foreground">{new Date(s.sent_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {selectedContact && (
                <ContactDetail contact={selectedContact} onClose={() => setSelectedContact(null)} onUpdate={handleUpdate} onDelete={handleDelete} />
            )}
            {showAdd && <AddContactModal onClose={() => setShowAdd(false)} onAdd={c => addContact.mutate(c)} />}

            {/* Email Template Editor Modal */}
            {editingTemplate && (
                <>
                    <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={() => setEditingTemplate(null)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-foreground">{editingTemplate.id ? "Edit Template" : "New Template"}</h2>
                                <button onClick={() => setEditingTemplate(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="space-y-3">
                                <input value={editingTemplate.name} onChange={e => setEditingTemplate((p: any) => ({ ...p, name: e.target.value }))} placeholder="Template name" className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                                <input value={editingTemplate.subject} onChange={e => setEditingTemplate((p: any) => ({ ...p, subject: e.target.value }))} placeholder="Email subject — use {name} or {first_name} for merge" className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20" />
                                <select value={editingTemplate.segment} onChange={e => setEditingTemplate((p: any) => ({ ...p, segment: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20">
                                    <option value="all">All Contacts</option>
                                    <option value="bought">Customers (Stripe)</option>
                                    <option value="hot_leads">Hot Leads</option>
                                    <option value="scraped_not_emailed">Scraped → Not Emailed</option>
                                    <option value="emailed_no_click">Emailed → No Click</option>
                                    <option value="clicked_not_bought">Clicked → Didn't Buy</option>
                                    <option value="form_not_bought">Form → Didn't Buy</option>
                                    <option value="resend_only">Resend Audience Only</option>
                                </select>
                                <div>
                                    <p className="text-[10px] text-muted-foreground mb-1">HTML Body — merge: {'{name}'}, {'{first_name}'}, {'{email}'}</p>
                                    <textarea value={editingTemplate.body_html} onChange={e => setEditingTemplate((p: any) => ({ ...p, body_html: e.target.value }))} rows={12} className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-y" placeholder="Paste your HTML email here..." />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button onClick={() => { saveTemplate.mutate(editingTemplate); setEditingTemplate(null); }} className="flex-1 px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-1.5">
                                        <Check className="w-4 h-4" /> {editingTemplate.id ? "Update" : "Create"} Template
                                    </button>
                                    {editingTemplate.id && (
                                        <button onClick={() => { deleteTemplate.mutate(editingTemplate.id); setEditingTemplate(null); }} className="px-4 py-2.5 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-1.5">
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Email Preview Modal */}
            {previewTemplate && (
                <>
                    <div className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm" onClick={() => setPreviewTemplate(null)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <div>
                                    <h2 className="text-sm font-bold text-foreground">{previewTemplate.name}</h2>
                                    <p className="text-xs text-muted-foreground">Subject: {previewTemplate.subject}</p>
                                </div>
                                <button onClick={() => setPreviewTemplate(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="p-4">
                                <iframe srcDoc={previewTemplate.body_html.replace(/\{name\}/gi, "Alex").replace(/\{first_name\}/gi, "Alex").replace(/\{last_name\}/gi, "Smith").replace(/\{email\}/gi, "alex@example.com")} className="w-full min-h-[400px] border border-border rounded-lg" title="Email Preview" />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
