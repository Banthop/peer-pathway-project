import { useState, useEffect } from "react";
import {
  Mail,
  Users,
  Send,
  XCircle,
  Clock,
  Play,
  Copy,
  Check,
  Linkedin,
  AlertCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  Edit3,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EmailTemplate {
  id: string;
  name: string;
  trigger: string;
  subject: string;
  greeting: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  signoff: string;
}

// ── Default templates ─────────────────────────────────────────────────────────

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "webinar-invite",
    name: "LinkedIn Comment → Webinar Invite",
    trigger: "Anyone who drops their email in comments",
    subject: "wait is this you??",
    greeting: "Hey,",
    body: "Did that subject line make you open this? Good.\n\nThat's exactly what cold emailing is — getting a complete stranger to stop what they're doing and pay attention to you.\n\nUthman mastered it. 20+ offers in 3 weeks. And he's about to show you how.\n\nUthman and other successful students used our co-founder Don's Cold Email Guide to land 20+ internship offers in 3 weeks. They figured out how to get people to open their messages, read them, and reply, even when they had absolutely NO reason to respond to some random student in their inbox. No connections. No crazy CV.\n\nThe guide has since been updated with everything they learned from doing it for real, so if you want the full written playbook, you can still grab that too.\n\nUthman is also breaking it all down live on 28 March at 7pm GMT.\n\n(Recording included if you can't make it on the night.)",
    ctaText: "See how Uthman did it",
    ctaUrl: "https://webinar.yourearlyedge.co.uk/webinar",
    signoff: "See you there\nDylan\nEarlyEdge",
  },
];

const STORAGE_KEY = "ee_email_templates_v1";

// ── Static run data ───────────────────────────────────────────────────────────

const SCRAPE_RUNS = [
  {
    id: 1,
    date: "2026-03-16T23:58:00Z",
    postId: "7439383011457953792",
    commentsFound: 62,
    emailsFound: 61,
    emailsSent: 0,
    emailsFailed: 61,
    status: "domain_error" as const,
    note: "Domain yourearlyedge.com not verified in Resend",
  },
];

const SCRAPED_EMAILS = [
  "s.ganna@lse.ac.uk","ymmmd19@gmail.com","ahmedaghani0609@gmail.com","georgebiju265@gmail.com",
  "buharica@shu.edu","chowdhur@tcd.ie","davidyowanemukendi@gmail.com","adithraghava@gmail.com",
  "28adityapai@gmail.com","aaryanvatsa@hotmail.com","marcusejhawkins@gmail.com","anshmahajan930@gmail.com",
  "naman0110j@gmail.com","radpat24@gmail.com","ismaeelfazal@outlook.com","adhya.rishi@gmail.com",
  "tmc8bg@virginia.edu","carlo.giolla@studbocconi.it",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return "just now";
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {label && <span>{copied ? "Copied!" : label}</span>}
    </button>
  );
}

function StatCard({
  icon: Icon, label, value, sub, accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent ?? "bg-muted"}`}>
        <Icon className="w-4 h-4 text-foreground" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Email Preview ─────────────────────────────────────────────────────────────

function EmailPreview({ tpl }: { tpl: EmailTemplate }) {
  return (
    <div className="bg-[#f5f5f5] rounded-lg p-4">
      <div className="max-w-[480px] mx-auto bg-white rounded-xl overflow-hidden shadow-sm border border-black/5">
        {/* Header */}
        <div className="bg-[#111111] px-7 py-5">
          <span className="text-[17px] tracking-tight text-white">
            <span className="font-light">Early</span><span className="font-bold">Edge</span>
          </span>
        </div>
        {/* Body */}
        <div className="px-7 py-6 space-y-3">
          <p className="text-[15px] text-[#111]">{tpl.greeting}</p>
          {tpl.body.split("\n").filter(Boolean).map((line, i) => (
            <p key={i} className="text-[13px] leading-relaxed text-[#444]">{line}</p>
          ))}
          <div className="pt-1">
            <a
              href={tpl.ctaUrl}
              className="inline-block bg-[#111111] text-white text-[12px] font-semibold px-6 py-2.5 rounded-lg no-underline"
            >
              {tpl.ctaText}
            </a>
          </div>
          <p className="text-[12px] text-[#888] pt-1">{tpl.signoff}</p>
        </div>
        {/* Footer */}
        <div className="bg-[#fafafa] border-t border-[#eee] px-7 py-3">
          <p className="text-[10px] text-[#aaa] text-center">
            EarlyEdge · Learn from people who just did it · earlyedge.co.uk
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Template Editor Card ──────────────────────────────────────────────────────

function TemplateCard({
  tpl, onSave, onReset, isModified,
}: {
  tpl: EmailTemplate;
  onSave: (t: EmailTemplate) => void;
  onReset: () => void;
  isModified: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draft, setDraft] = useState<EmailTemplate>(tpl);

  // Keep draft in sync when tpl changes from outside
  useEffect(() => { setDraft(tpl); }, [tpl]);

  const field = (
    key: keyof EmailTemplate,
    label: string,
    multiline = false,
    placeholder = ""
  ) => (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea
          disabled={!editing}
          value={draft[key] as string}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          rows={4}
          placeholder={placeholder}
          className="w-full text-sm text-foreground bg-background border border-border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20 disabled:opacity-60 disabled:cursor-default font-[inherit]"
        />
      ) : (
        <input
          disabled={!editing}
          value={draft[key] as string}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full text-sm text-foreground bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-foreground/20 disabled:opacity-60 disabled:cursor-default"
        />
      )}
    </div>
  );

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(tpl);
    setEditing(false);
  };

  return (
    <div className={`border rounded-xl overflow-hidden bg-white transition-all ${isModified ? "border-amber-300" : "border-border"}`}>
      {/* Card header */}
      <div className="px-5 py-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{tpl.name}</span>
            {isModified && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                edited
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Trigger: {tpl.trigger}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPreview ? "Hide" : "Preview"}
          </button>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-muted hover:bg-foreground hover:text-background px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1 text-xs font-medium bg-foreground text-background px-2.5 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          )}
          {isModified && (
            <button
              onClick={() => { onReset(); setEditing(false); }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
              title="Reset to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="border-t border-border px-5 py-4 space-y-4 bg-muted/20">
        {field("subject", "Subject line")}
        {field("greeting", "Greeting")}
        {field("body", "Body text", true)}
        <div className="grid grid-cols-2 gap-3">
          {field("ctaText", "Button text")}
          {field("ctaUrl", "Button URL")}
        </div>
        {field("signoff", "Sign-off")}
      </div>

      {/* Live preview */}
      {showPreview && (
        <div className="border-t border-border px-5 py-5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Live Preview {editing && <span className="text-amber-600">(updates as you type)</span>}
          </p>
          <EmailPreview tpl={editing ? draft : tpl} />
          <div className="mt-3 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
            <span className="font-medium">Subject:</span> {editing ? draft.subject : tpl.subject}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminLinkedIn() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return DEFAULT_TEMPLATES;
  });

  const [showAllEmails, setShowAllEmails] = useState(false);

  const isModified = (id: string) => {
    const def = DEFAULT_TEMPLATES.find((t) => t.id === id);
    const cur = templates.find((t) => t.id === id);
    return JSON.stringify(def) !== JSON.stringify(cur);
  };

  const saveTemplate = (updated: EmailTemplate) => {
    const next = templates.map((t) => (t.id === updated.id ? updated : t));
    setTemplates(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const resetTemplate = (id: string) => {
    const def = DEFAULT_TEMPLATES.find((t) => t.id === id)!;
    const next = templates.map((t) => (t.id === id ? def : t));
    setTemplates(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const totalSent = SCRAPE_RUNS.reduce((a, r) => a + r.emailsSent, 0);
  const totalFailed = SCRAPE_RUNS.reduce((a, r) => a + r.emailsFailed, 0);
  const displayedEmails = showAllEmails ? SCRAPED_EMAILS : SCRAPED_EMAILS.slice(0, 6);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">LinkedIn Automation</h1>
          </div>
          <p className="text-sm text-muted-foreground">Scrapes emails from LinkedIn post comments and sends webinar invites via Resend.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          Domain verification needed
        </div>
      </div>

      {/* Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-800">
            Verify <span className="font-mono">yourearlyedge.com</span> in Resend to send emails
          </p>
          <p className="text-xs text-amber-700 mt-0.5">61 emails are queued and ready. Once verified, re-run the script to send them all.</p>
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer"
              className="text-xs font-semibold text-amber-800 underline underline-offset-2">
              resend.com/domains →
            </a>
            <code className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
              node scripts/linkedin-email-automation.mjs
            </code>
            <CopyButton text="node scripts/linkedin-email-automation.mjs" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Emails Scraped" value={61} sub="From LinkedIn comments" accent="bg-blue-50" />
        <StatCard icon={Send} label="Emails Sent" value={totalSent} sub="All-time" accent="bg-emerald-50" />
        <StatCard icon={XCircle} label="Failed Sends" value={totalFailed} sub="Awaiting domain fix" accent="bg-red-50" />
        <StatCard icon={Clock} label="Script Runs" value={SCRAPE_RUNS.length} sub="Total runs" accent="bg-violet-50" />
      </div>

      {/* Run history */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Play className="w-4 h-4" /> Run History
        </h2>
        <div className="border border-border rounded-xl overflow-hidden bg-white divide-y divide-border">
          {SCRAPE_RUNS.map((run) => (
            <div key={run.id} className="p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium bg-red-50 text-red-700 border-red-200">
                    <XCircle className="w-3 h-3" /> Domain Error
                  </span>
                  <span className="text-xs text-muted-foreground">{timeAgo(run.date)}</span>
                </div>
                {run.note && <p className="text-xs text-muted-foreground mt-1">{run.note}</p>}
              </div>
              <div className="flex gap-4 text-center shrink-0">
                {[
                  { v: run.commentsFound, l: "comments" },
                  { v: run.emailsFound, l: "emails" },
                  { v: run.emailsSent, l: "sent" },
                  { v: run.emailsFailed, l: "failed" },
                ].map(({ v, l }) => (
                  <div key={l}>
                    <p className={`text-base font-bold ${l === "sent" && v > 0 ? "text-emerald-600" : l === "failed" && v > 0 ? "text-red-500" : "text-foreground"}`}>{v}</p>
                    <p className="text-[10px] text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scraped emails */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4" /> Scraped Emails
            <span className="text-xs font-normal text-muted-foreground">({SCRAPED_EMAILS.length} total)</span>
          </h2>
          <CopyButton text={SCRAPED_EMAILS.join("\n")} label="Copy all" />
        </div>
        <div className="border border-border rounded-xl overflow-hidden bg-white">
          {displayedEmails.map((email, i) => (
            <div key={email} className={`flex items-center justify-between px-4 py-2.5 ${i !== displayedEmails.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-sm font-mono text-foreground">{email}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-600 font-medium bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">pending</span>
                <CopyButton text={email} />
              </div>
            </div>
          ))}
          {SCRAPED_EMAILS.length > 6 && (
            <button onClick={() => setShowAllEmails((v) => !v)}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-3 border-t border-border flex items-center justify-center gap-1 hover:bg-muted/30 transition-colors">
              {showAllEmails
                ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                : <><ChevronDown className="w-3.5 h-3.5" /> Show all {SCRAPED_EMAILS.length} emails</>}
            </button>
          )}
        </div>
      </div>

      {/* Email templates (editable) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4" /> Email Templates
          </h2>
          <p className="text-xs text-muted-foreground">Changes are saved automatically and persist across sessions.</p>
        </div>
        <div className="space-y-4">
          {templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              tpl={tpl}
              onSave={saveTemplate}
              onReset={() => resetTemplate(tpl.id)}
              isModified={isModified(tpl.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
