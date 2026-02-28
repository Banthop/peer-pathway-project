import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Send, CalendarPlus } from "lucide-react";
import {
  conversations as initialConversations,
  allCoaches,
  upcomingSessions,
} from "@/data/dashboardData";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, useMessages, useSendMessage } from "@/hooks/useMessages";

export default function DashboardMessages() {
  const { user } = useAuth();
  const { data: dbConvos = [] } = useConversations();

  // Format dbConvos into UI-friendly Convos array
  const mappedConvos = useMemo(() => {
    if (!dbConvos || dbConvos.length === 0) return initialConversations;

    return dbConvos.map((c: any) => {
      const isStudent = (user as any)?.type === "student" || (user as any)?.user_metadata?.type === "student";
      const otherUserName = isStudent ? c.coach?.user?.name : c.student?.name;
      const otherUserAvatarUrl = isStudent ? c.coach?.user?.avatar_url : c.student?.avatar_url;

      const sortedMsgs = (c.messages || []).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      const lastMsg = sortedMsgs[sortedMsgs.length - 1];

      return {
        id: c.id,
        coach: otherUserName || "Unknown Coach",
        avatar: otherUserAvatarUrl || (otherUserName ? otherUserName.substring(0, 2).toUpperCase() : "AA"),
        credential: c.coach?.headline || "Coach",
        lastMessage: lastMsg?.content || "",
        lastTime: lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "New",
        unread: c.messages?.filter((m: any) => !m.is_read && m.sender_id !== user?.id).length || 0,
        online: true,
        messages: [], // Real messages loaded via dbMessages hook below
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

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fallback state for appending messages locally if using mock data
  const [mockMessages, setMockMessages] = useState<Record<number, any[]>>({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvoId, dbMessages, mockMessages]);

  const displayMessages = useMemo(() => {
    if (!activeConvo) return [];
    if (isMockActive) {
      const initialMsgs = (initialConversations.find(c => c.id === activeConvoId)?.messages || []);
      return [...initialMsgs, ...(mockMessages[activeConvoId as number] || [])];
    }
    return dbMessages.map(m => ({
      id: m.id,
      sender: m.sender_id === user?.id ? "student" : "coach",
      text: m.content,
      time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  }, [activeConvo, dbMessages, isMockActive, mockMessages, user, activeConvoId]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConvo) return;

    if (isMockActive) {
      const newMsg = {
        id: Date.now(),
        sender: "student" as const,
        text: messageInput,
        time: "Just now",
      };
      setMockMessages(prev => ({
        ...prev,
        [activeConvo.id as number]: [...(prev[activeConvo.id as number] || []), newMsg]
      }));
      setMessageInput("");
      return;
    }

    if (!user) return;
    const isStudent = (user as any)?.type === "student" || (user as any)?.user_metadata?.type === "student";
    const recipientId = isStudent ? (activeConvo as any).rawContext.coach?.user_id : (activeConvo as any).rawContext.student_id;

    if (recipientId) {
      sendMessageMutation({
        conversationId: activeConvo.id as string,
        recipientId: recipientId,
        content: messageInput
      });
    }
    setMessageInput("");
  };

  // Find session context for active convo coach
  const coachData = allCoaches.find((c) => c.avatar === activeConvo?.avatar);
  const coachSessions = upcomingSessions.filter(
    (s) => s.avatar === activeConvo?.avatar
  );
  const totalPastSessions = coachData ? Math.floor(coachData.sessions / 10) : 0;

  return (
    <div className="flex h-[calc(100vh-0px)] -m-0">
      {/* Conversation List */}
      <div className="w-80 border-r border-border bg-background flex flex-col shrink-0">
        <div className="px-5 pt-6 pb-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mappedConvos.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setActiveConvoId(convo.id)}
              className={`px-5 py-4 cursor-pointer transition-colors duration-150 border-b border-border/50 ${activeConvo?.id === convo.id
                ? "bg-muted"
                : "bg-background hover:bg-muted/50"
                }`}
            >
              <div className="flex gap-3 items-start">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[13px] font-semibold text-muted-foreground overflow-hidden">
                    {convo.avatar?.includes("http") ? <img src={convo.avatar} alt="avatar" className="w-full h-full object-cover" /> : convo.avatar}
                  </div>
                  {convo.online && (
                    <div className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[13px] font-semibold text-foreground">
                      {convo.coach}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {convo.lastTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-1">
                    {convo.credential}
                  </p>
                  <p
                    className={`text-xs truncate ${convo.unread > 0
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                      }`}
                  >
                    {convo.lastMessage}
                  </p>
                </div>
                {convo.unread > 0 && (
                  <div className="w-[18px] h-[18px] rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">
                    {convo.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-muted/30">
        {/* Chat Header with session context */}
        <div className="px-7 py-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground overflow-hidden">
                {activeConvo?.avatar?.includes("http") ? <img src={activeConvo.avatar} alt="avatar" className="w-full h-full object-cover" /> : activeConvo?.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {activeConvo?.coach}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {activeConvo?.credential}
                  {totalPastSessions > 0 && (
                    <span>
                      {" "}
                      · {totalPastSessions} sessions together
                    </span>
                  )}
                  {coachSessions.length > 0 && (
                    <span className="text-accent-blue">
                      {" "}
                      · Next: {coachSessions[0].date} {coachSessions[0].time}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/bookings"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                Schedule session
              </Link>
              <Link
                to={`/coach/${coachData?.id || 1}`}
                className="px-3.5 py-1.5 bg-background border border-border rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                View profile
              </Link>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-4">
          {displayMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"
                }`}
            >
              <div className="max-w-[70%]">
                <div
                  className={`px-4 py-3 rounded-xl text-[13px] leading-relaxed ${msg.sender === "student"
                    ? "bg-[#3B82F6] text-white rounded-br-sm"
                    : "bg-background text-foreground border border-border rounded-bl-sm"
                    }`}
                >
                  {msg.text}
                </div>
                <p
                  className={`text-[10px] text-muted-foreground mt-1 px-1 ${msg.sender === "student" ? "text-right" : "text-left"
                    }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-7 py-4 border-t border-border bg-background">
          <div className="flex gap-2.5 items-end">
            <div className="flex-1 bg-muted rounded-lg px-4 py-3 flex items-center">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="border-none outline-none bg-transparent text-[13px] flex-1 font-sans text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={handleSendMessage}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 shrink-0 ${messageInput.trim()
                ? "bg-foreground cursor-pointer hover:opacity-90"
                : "bg-muted cursor-default"
                }`}
            >
              <Send
                className={`w-4 h-4 ${messageInput.trim()
                  ? "text-background"
                  : "text-muted-foreground"
                  }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
