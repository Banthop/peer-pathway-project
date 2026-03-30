                {activeTab === "automations" && (
                    <div className="space-y-8">

                        {/* Email Campaigns Sent */}
                        <div>
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> Email Campaigns Sent
                            </h3>
                            <div className="grid gap-3">
                                {[
                                    { name: "Bundle Confirmation", subject: "you're in - here's everything you need", stage: "Post-Purchase", trigger: "Instant after Stripe payment (bundle)", tag: "confirmation_sent", extra: "bundle", excludeTag: "", color: "border-emerald-200 bg-emerald-50", iconColor: "text-emerald-600", icon: Check },
                                    { name: "Webinar-Only Confirmation", subject: "you're in - here's your zoom link", stage: "Post-Purchase", trigger: "Instant after Stripe payment (webinar only)", tag: "confirmation_sent", extra: "webinar_only", excludeTag: "bundle", color: "border-purple-200 bg-purple-50", iconColor: "text-purple-600", icon: Check },
                                    { name: "Guide 2.0 Upsell", subject: "this might be what you're missing", stage: "Upsell", trigger: "Webinar-only buyers - upsell to full bundle", tag: "guide_upsell_sent", extra: "", excludeTag: "", color: "border-indigo-200 bg-indigo-50", iconColor: "text-indigo-600", icon: ArrowRight },
                                    { name: "50% Discount (WEBINAR50)", subject: "50% off, just for you", stage: "Conversion", trigger: "Form leads who didn't buy - 30 min delay", tag: "discount_sent", extra: "", excludeTag: "", color: "border-pink-200 bg-pink-50", iconColor: "text-pink-600", icon: Gift },
                                    { name: "First-Touch Outreach", subject: "saw your comment on...", stage: "Awareness", trigger: "LinkedIn scraped contacts - first email", tag: "linkedin_emailed", extra: "", excludeTag: "", color: "border-sky-200 bg-sky-50", iconColor: "text-sky-600", icon: Send },
                                    { name: "Funnel Stage 2", subject: "Nurture follow-up #2", stage: "Nurture", trigger: "Emailed contacts, no click", tag: "funnel_email_2", extra: "", excludeTag: "", color: "border-blue-200 bg-blue-50", iconColor: "text-blue-600", icon: Target },
                                    { name: "Funnel Stage 3", subject: "Nurture follow-up #3", stage: "Nurture", trigger: "Clicked contacts - deepen engagement", tag: "funnel_email_3", extra: "", excludeTag: "", color: "border-violet-200 bg-violet-50", iconColor: "text-violet-600", icon: Target },
                                    { name: "Funnel Stage 4", subject: "Nurture follow-up #4", stage: "Nurture", trigger: "High-engagement contacts - final push", tag: "funnel_email_4", extra: "", excludeTag: "", color: "border-amber-200 bg-amber-50", iconColor: "text-amber-600", icon: Target },
                                ].map((camp) => {
                                    const sent = contacts.filter((c: any) => {
                                        const t = c.tags || [];
                                        if (!t.includes(camp.tag)) return false;
                                        if (camp.extra && !t.includes(camp.extra)) return false;
                                        if (camp.excludeTag && t.includes(camp.excludeTag)) return false;
                                        return true;
                                    });
                                    const last = sent.length > 0 ? sent.reduce((l: string, c: any) => { const d = c.last_activity_at || c.created_at; return (!l || d > l) ? d : l; }, "") : "";
                                    return (
                                        <div key={camp.name} className={`border rounded-xl p-4 ${camp.color} flex flex-col sm:flex-row sm:items-center gap-3`}>
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${camp.color}`}>
                                                <camp.icon className={`w-5 h-5 ${camp.iconColor}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="text-sm font-bold text-foreground">{camp.name}</h4>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/70 font-medium">{camp.stage}</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">Subject: <span className="italic">{camp.subject}</span></p>
                                                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{camp.trigger}</p>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-foreground">{sent.length}</p>
                                                    <p className="text-[10px] text-muted-foreground">sent</p>
                                                </div>
                                                {last && (
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-[10px] font-medium text-foreground">{new Date(last).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                                                        <p className="text-[10px] text-muted-foreground">{new Date(last).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Automation Rules */}
                        <div>
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5" /> Automation Rules
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    { trigger: "New Stripe payment (bundle)", action: "Send bundle confirmation + Zoom + guide", delay: "Instant", active: true },
                                    { trigger: "New Stripe payment (webinar)", action: "Send webinar confirmation + Zoom + upsell", delay: "Instant", active: true },
                                    { trigger: "Form lead (no purchase)", action: "Send 50% discount email", delay: "30 min", active: true },
                                    { trigger: "Webinar-only buyer", action: "Send Guide 2.0 upsell", delay: "Next cycle", active: true },
                                    { trigger: "New LinkedIn scrape", action: "Queue for first-touch outreach", delay: "Manual", active: false },
                                    { trigger: "Stripe data", action: "Re-sync charges since Mar 16", delay: "Every 2 min", active: true },
                                ].map((rule, i) => (
                                    <div key={i} className={`border rounded-xl p-4 ${rule.active ? "border-emerald-200 bg-emerald-50/50" : "border-border bg-muted/30"}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-2 h-2 rounded-full ${rule.active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${rule.active ? "text-emerald-700" : "text-muted-foreground"}`}>{rule.active ? "Active" : "Manual"}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/60 font-medium ml-auto">{rule.delay}</span>
                                        </div>
                                        <p className="text-xs font-bold text-foreground mb-1">When: {rule.trigger}</p>
                                        <p className="text-[11px] text-muted-foreground">{rule.action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pipeline Gaps */}
                        <div>
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5" /> Pipeline Gaps
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="bg-background border border-border rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-foreground">{contacts.filter((c: any) => (c.tags || []).includes("stripe_customer") && !(c.tags || []).includes("confirmation_sent")).length}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Buyers No Confirmation</p>
                                </div>
                                <div className="bg-background border border-border rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-foreground">{contacts.filter((c: any) => (c.tags || []).includes("form_lead") && !(c.tags || []).includes("stripe_customer") && !(c.tags || []).includes("discount_sent")).length}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Form Leads No Discount</p>
                                </div>
                                <div className="bg-background border border-border rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-emerald-600">{contacts.filter((c: any) => (c.tags || []).includes("stripe_customer")).length}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Total Customers</p>
                                </div>
                                <div className="bg-background border border-border rounded-xl p-4 text-center">
                                    <p className="text-2xl font-black text-pink-600">{contacts.filter((c: any) => (c.tags || []).includes("discount_sent")).length}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Discounts Sent</p>
                                </div>
                            </div>
                        </div>

                        {/* Manual Scripts */}
                        <div>
                            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" /> Manual Scripts
                            </h3>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    { name: "Auto-Emailer", cmd: "node scripts/auto-emailer.mjs", desc: "Runs all automations continuously" },
                                    { name: "CRM Sync", cmd: "node scripts/build-crm.mjs", desc: "Rebuild CRM from all sources" },
                                    { name: "Confirmations", cmd: "node scripts/send-confirmation-emails.mjs --send", desc: "Broadcast confirmations" },
                                    { name: "Discount Blast", cmd: "node scripts/send-discount-blast.mjs --segment=form_not_bought --send", desc: "50% off to form leads" },
                                    { name: "Guide Upsell", cmd: "node scripts/send-guide-upsell.mjs --send", desc: "Upsell to webinar-only" },
                                    { name: "Funnel Nurture", cmd: "node scripts/send-funnel-emails.mjs --send", desc: "4-stage nurture" },
                                ].map(s => (
                                    <button key={s.name} onClick={() => { navigator.clipboard.writeText(s.cmd); }} className="text-left border border-border rounded-lg p-3 hover:border-foreground/20 transition-colors group">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Copy className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            <span className="text-xs font-bold text-foreground">{s.name}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
