import { useState, useRef, useEffect, useMemo } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, useMessages, useSendMessage } from "@/hooks/useMessages";

export default function CoachMessages() {
    const { user } = useAuth();
    const { data: dbConvos = [] } = useConversations();

    const mappedConvos = useMemo(() => {
        if (!dbConvos || dbConvos.length === 0) return [];

        return dbConvos.map((c: any) => {
            const isStudent = (user as any)?.type === "student" || (user as any)?.user_metadata?.type === "student";
            const otherUserName = isStudent ? c.coach?.user?.name : c.student?.name;
            const otherUserAvatarUrl = isStudent ? c.coach?.user?.avatar_url : c.student?.avatar_url;

            const sortedMsgs = (c.messages || []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            const lastMsg = sortedMsgs[sortedMsgs.length - 1];

            return {
                id: c.id,
                student: otherUserName || "Unknown Student",
                avatar: otherUserAvatarUrl || (otherUserName ? otherUserName.substring(0, 2).toUpperCase() : "AA"),
                sessionContext: c.coach?.headline || "",
                lastMessage: lastMsg?.content || "",
                lastTime: lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "New",
                unread: c.messages?.filter((m: any) => !m.is_read && m.sender_id !== user?.id).length || 0,
                online: true,
                messages: [],
                rawContext: c,
                isMock: false
            };
        });
    }, [dbConvos, user]);

    const [activeConvoId, setActiveConvoId] = useState<string | number>(mappedConvos[0]?.id);

    useEffect(() => {
        if (mappedConvos.length > 0 && !mappedConvos.find(c => c.id === activeConvoId)) {
            setActiveConvoId(mappedConvos[0].id);
        }
    }, [mappedConvos, activeConvoId]);

    const activeConvo = mappedConvos.find(c => c.id === activeConvoId) || mappedConvos[0];

    const isMockActive = typeof activeConvoId === 'number';
    const { data: dbMessages = [] } = useMessages(isMockActive ? undefined : activeConvoId as string);
    const { mutate: sendMessageMutation } = useSendMessage();

    const [draft, setDraft] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const [mockMessages, setMockMessages] = useState<Record<number, any[]>>({});

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConvoId, dbMessages, mockMessages]);

    const displayMessages = useMemo(() => {
        if (!activeConvo) return [];
        if (isMockActive) {
            return [...(mockMessages[activeConvoId as number] || [])];
        }
        return dbMessages.map(m => ({
            id: m.id,
            sender: m.sender_id === user?.id ? "coach" : "student",
            text: m.content,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    }, [activeConvo, dbMessages, isMockActive, mockMessages, user, activeConvoId]);

    const sendMessage = () => {
        if (!draft.trim() || !activeConvo) return;

        if (isMockActive) {
            const newMsg = {
                id: Date.now(),
                sender: "coach" as const,
                text: draft.trim(),
                time: "Just now",
            };
            setMockMessages(prev => ({
                ...prev,
                [activeConvo.id as number]: [...(prev[activeConvo.id as number] || []), newMsg]
            }));
            setDraft("");
            return;
        }

        if (!user) return;
        const isStudent = (user as any)?.type === "student" || (user as any)?.user_metadata?.type === "student";
        const recipientId = isStudent ? (activeConvo as any).rawContext.coach?.user_id : (activeConvo as any).rawContext.student_id;

        if (recipientId) {
            sendMessageMutation({
                conversationId: activeConvo.id as string,
                recipientId: recipientId,
                content: draft.trim()
            });
        }
        setDraft("");
    };

    return (
        <div className="w-full h-[calc(100vh-0px)] flex">
            {/* ─── Conversation List ─────────────────────── */}
            <div className="w-[340px] flex-shrink-0 border-r border-border flex flex-col bg-background">
                <div className="px-6 py-5 border-b border-border">
                    <h1 className="text-lg font-semibold tracking-tight text-foreground">Messages</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {mappedConvos.reduce((s: number, c: any) => s + c.unread, 0)} unread
                    </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {mappedConvos.map((convo: any) => (
                        <button
                            key={convo.id}
                            onClick={() => setActiveConvoId(convo.id)}
                            className={`w-full text-left px-6 py-4 flex items-start gap-3.5 transition-colors border-b border-border/40 cursor-pointer ${activeConvo?.id === convo.id
                                ? "bg-muted/60"
                                : "hover:bg-muted/30"
                                }`}
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground overflow-hidden">
                                    {convo.avatar?.includes("http") ? <img src={convo.avatar} alt="avatar" className="w-full h-full object-cover" /> : convo.avatar}
                                </div>
                                {convo.online && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                                )}
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className={`text-sm truncate ${convo.unread > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                                        {convo.student}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                                        {convo.lastTime}
                                    </span>
                                </div>
                                <p className={`text-xs truncate ${convo.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                    {convo.lastMessage}
                                </p>
                                {convo.sessionContext && (
                                    <span className="inline-block mt-1.5 text-[10px] bg-muted text-muted-foreground rounded-md px-2 py-0.5">
                                        {convo.sessionContext}
                                    </span>
                                )}
                            </div>
                            {/* Unread dot */}
                            {convo.unread > 0 && (
                                <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-1">
                                    {convo.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── Chat Thread ───────────────────────────── */}
            <div className="flex-1 flex flex-col bg-background min-w-0">
                {/* Thread header */}
                <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground overflow-hidden">
                            {activeConvo?.avatar?.includes("http") ? <img src={activeConvo.avatar} alt="avatar" className="w-full h-full object-cover" /> : activeConvo?.avatar}
                        </div>
                        {activeConvo?.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">{activeConvo?.student}</h2>
                        {activeConvo?.sessionContext && (
                            <p className="text-[11px] text-muted-foreground">{activeConvo.sessionContext}</p>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                    {displayMessages.map((msg: any) => {
                        const isCoach = msg.sender === "coach";
                        return (
                            <div key={msg.id} className={`flex ${isCoach ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[75%] ${isCoach ? "order-2" : ""}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${isCoach
                                            ? "bg-foreground text-background rounded-br-md"
                                            : "bg-muted text-foreground rounded-bl-md"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <p className={`text-[10px] text-muted-foreground mt-1 ${isCoach ? "text-right" : "text-left"}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-border">
                    <div className="flex items-center gap-3">
                        <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                            placeholder={`Reply to ${activeConvo?.student || ''}...`}
                            className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-foreground/20 transition-shadow"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!draft.trim()}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${draft.trim()
                                ? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                                }`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
