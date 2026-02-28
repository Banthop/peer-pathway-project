import { useState } from "react";
import { FileText, BookOpen, CheckSquare, Wrench, PenTool, Plus, Download, Trash2 } from "lucide-react";
import { useResources, useCreateResource, type ResourceData } from "@/hooks/useResources";
import { useAuth } from "@/contexts/AuthContext";
import { useCoachProfile } from "@/hooks/useCoachProfile";

const typeIcons: Record<string, React.ElementType> = {
    guide: BookOpen,
    template: FileText,
    checklist: CheckSquare,
    toolkit: Wrench,
    article: PenTool,
};

const typeLabels: Record<string, string> = {
    guide: "Guide",
    template: "Template",
    checklist: "Checklist",
    toolkit: "Toolkit",
    article: "Article",
};

export default function CoachResources() {
    const { user } = useAuth();
    const { data: profile } = useCoachProfile();
    const { data: allResources = [] } = useResources();
    const createResource = useCreateResource();

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        resource_type: "guide" as "guide" | "template" | "checklist" | "toolkit" | "article",
        category: "Investment Banking",
        price: 0,
        preview_text: "",
    });

    // Filter to show only this coach's resources
    const myResources = allResources.filter((r: any) => r.coach_id === profile?.id);

    const handleCreate = () => {
        if (!profile?.id || !form.title) return;

        createResource.mutate({
            coach_id: profile.id,
            title: form.title,
            description: form.description || undefined,
            resource_type: form.resource_type,
            category: form.category || undefined,
            price: form.price * 100, // convert to pence
            preview_text: form.preview_text || undefined,
        }, {
            onSuccess: () => {
                setShowForm(false);
                setForm({ title: "", description: "", resource_type: "guide", category: "Investment Banking", price: 0, preview_text: "" });
            },
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">My Resources</h1>
                    <p className="text-sm text-muted-foreground">Create and sell guides, templates, and toolkits</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    New Resource
                </button>
            </div>

            {/* Tips banner */}
            <div className="bg-muted/30 border border-dashed border-border rounded-xl p-5 mb-8">
                <h3 className="text-sm font-semibold text-foreground mb-1">💡 Resource tips</h3>
                <p className="text-xs text-muted-foreground">
                    Free resources work as lead magnets — students need an account to access them. Paid resources (£5-15) sell repeatedly with zero marginal cost. Example: "My exact Goldman Sachs application — annotated" can sell for £10 on repeat.
                </p>
            </div>

            {/* Create form */}
            {showForm && (
                <div className="bg-background border border-border rounded-xl p-6 mb-8 space-y-4">
                    <h2 className="text-base font-semibold text-foreground">Create New Resource</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm" placeholder="My Goldman Sachs Application — Annotated" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</label>
                            <select value={form.resource_type} onChange={(e) => setForm({ ...form, resource_type: e.target.value as any })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm">
                                <option value="guide">Guide</option>
                                <option value="template">Template</option>
                                <option value="checklist">Checklist</option>
                                <option value="toolkit">Toolkit</option>
                                <option value="article">Article</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm">
                                <option>Investment Banking</option>
                                <option>Consulting</option>
                                <option>Law</option>
                                <option>UCAT</option>
                                <option>Oxbridge</option>
                                <option>Software Engineering</option>
                                <option>Cold Emailing</option>
                                <option>Graduate Schemes</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price (£, 0 = free)</label>
                            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm resize-none" placeholder="What does this resource cover?" />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview Text (shown to non-purchasers)</label>
                        <textarea value={form.preview_text} onChange={(e) => setForm({ ...form, preview_text: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm resize-none" placeholder="A teaser to encourage purchases..." />
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleCreate} disabled={createResource.isPending} className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                            {createResource.isPending ? "Creating..." : "Create Resource"}
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Resources list */}
            {myResources.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground bg-background border border-dashed border-border rounded-xl">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-base font-medium mb-2">No resources yet</p>
                    <p className="text-[13px] mb-4">Create your first guide, template, or toolkit to earn passive income</p>
                    <button onClick={() => setShowForm(true)} className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity">
                        Create Resource
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {myResources.map((resource: any) => {
                        const Icon = typeIcons[resource.resource_type] || FileText;
                        return (
                            <div key={resource.id} className="bg-background border border-border rounded-xl p-5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-foreground truncate">{resource.title}</h3>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-xs text-muted-foreground">{typeLabels[resource.resource_type]}</span>
                                        <span className="text-xs text-muted-foreground">·</span>
                                        <span className="text-xs text-muted-foreground">{resource.category}</span>
                                        <span className="text-xs text-muted-foreground">·</span>
                                        <span className="text-xs font-medium text-foreground">{resource.price === 0 ? "Free" : `£${(resource.price / 100).toFixed(0)}`}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                                    <Download className="w-3 h-3" />
                                    {resource.download_count}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
