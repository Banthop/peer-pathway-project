import { useState } from "react";
import { Calendar, Clock, Users, Plus, ExternalLink, Trash2 } from "lucide-react";
import { useEvents, useCreateEvent, type EventData } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { useCoachProfile } from "@/hooks/useCoachProfile";

const eventTypeLabels: Record<string, string> = {
    workshop: "Workshop",
    bootcamp: "Bootcamp",
    ama: "AMA",
    panel: "Panel",
};

const gradients: Record<string, string> = {
    workshop: "from-blue-600 to-indigo-800",
    bootcamp: "from-violet-600 to-purple-800",
    ama: "from-emerald-600 to-teal-800",
    panel: "from-amber-500 to-orange-700",
};

export default function CoachEvents() {
    const { user } = useAuth();
    const { data: profile } = useCoachProfile();
    const { data: allEvents = [] } = useEvents();
    const createEvent = useCreateEvent();

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        event_type: "workshop" as "workshop" | "bootcamp" | "ama" | "panel",
        category: "Investment Banking",
        date: "",
        time: "",
        duration: 60,
        max_attendees: 20,
        price: 0,
        meeting_link: "",
    });

    // Filter to show only this coach's events
    const myEvents = allEvents.filter((e: any) => e.coach_id === profile?.id);

    const handleCreate = () => {
        if (!profile?.id || !form.title || !form.date || !form.time) return;

        const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString();

        createEvent.mutate({
            coach_id: profile.id,
            title: form.title,
            description: form.description || undefined,
            event_type: form.event_type,
            category: form.category || undefined,
            scheduled_at: scheduledAt,
            duration: form.duration,
            max_attendees: form.max_attendees,
            price: form.price * 100, // convert to pence
            meeting_link: form.meeting_link || undefined,
        }, {
            onSuccess: () => {
                setShowForm(false);
                setForm({ title: "", description: "", event_type: "workshop", category: "Investment Banking", date: "", time: "", duration: 60, max_attendees: 20, price: 0, meeting_link: "" });
            },
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">My Events</h1>
                    <p className="text-sm text-muted-foreground">Create and manage workshops, AMAs, and group sessions</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    New Event
                </button>
            </div>

            {/* Create form */}
            {showForm && (
                <div className="bg-background border border-border rounded-xl p-6 mb-8 space-y-4">
                    <h2 className="text-base font-semibold text-foreground">Create New Event</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm" placeholder="Spring Week Conversion Workshop" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</label>
                            <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value as any })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm">
                                <option value="workshop">Workshop</option>
                                <option value="bootcamp">Bootcamp</option>
                                <option value="ama">AMA</option>
                                <option value="panel">Panel</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</label>
                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</label>
                            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration (min)</label>
                            <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 60 })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Max Attendees</label>
                            <input type="number" value={form.max_attendees} onChange={(e) => setForm({ ...form, max_attendees: parseInt(e.target.value) || 20 })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price (£, 0 = free)</label>
                            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Meeting Link</label>
                            <input value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm" placeholder="https://meet.google.com/..." />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full mt-1 px-3 py-2.5 bg-background border border-border rounded-lg text-sm resize-none" placeholder="What will attendees learn?" />
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={handleCreate} disabled={createEvent.isPending} className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                            {createEvent.isPending ? "Creating..." : "Create Event"}
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Events list */}
            {myEvents.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground bg-background border border-dashed border-border rounded-xl">
                    <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-base font-medium mb-2">No events yet</p>
                    <p className="text-[13px] mb-4">Create your first workshop, AMA, or bootcamp to reach more students</p>
                    <button onClick={() => setShowForm(true)} className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity">
                        Create Event
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {myEvents.map((event: any) => (
                        <div key={event.id} className="bg-background border border-border rounded-xl overflow-hidden">
                            <div className={`h-24 bg-gradient-to-br ${gradients[event.event_type] || "from-gray-600 to-gray-800"} px-5 py-4 flex flex-col justify-between`}>
                                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full self-start">
                                    {eventTypeLabels[event.event_type]}
                                </span>
                                <h3 className="text-white text-sm font-semibold line-clamp-1">{event.title}</h3>
                            </div>
                            <div className="px-5 py-4 space-y-2">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(event.scheduled_at).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" })}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.duration} min</span>
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.current_attendees}/{event.max_attendees}</span>
                                </div>
                                <p className="text-xs text-foreground font-medium">
                                    {event.price === 0 ? "Free" : `£${(event.price / 100).toFixed(0)} per attendee`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
