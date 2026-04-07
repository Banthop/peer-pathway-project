import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type AccessTier = "free" | "recording" | "bundle";

interface BuyerStatus {
  tier: AccessTier;
  isBuyer: boolean;
  isBundle: boolean;
  hasRecording: boolean;
  hasGuide: boolean;
  tags: string[];
  accessCount: number;
  welcomePopupShown: boolean;
  crmId?: string;
  metadata?: Record<string, any>;
}

interface BuyerAuthContextValue {
  buyerStatus: BuyerStatus | null;
  loading: boolean;
  checkBuyerStatus: () => Promise<void>;
  markWelcomeShown: () => Promise<void>;
}

const BuyerAuthContext = createContext<BuyerAuthContextValue | undefined>(undefined);

export function useBuyerAuth() {
  const ctx = useContext(BuyerAuthContext);
  if (!ctx) throw new Error("useBuyerAuth must be used inside <BuyerAuthProvider>");
  return ctx;
}

// Watch progress uses localStorage (persists across sessions)
export const PROGRESS_KEY = "earlyedge_watch_progress";

// Track access for anti-sharing monitoring
const ACCESS_LOG_KEY = "earlyedge_access_log";

function logAccess(email: string) {
  try {
    const log = JSON.parse(localStorage.getItem(ACCESS_LOG_KEY) || "[]");
    log.push({
      email,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenRes: `${screen.width}x${screen.height}`,
    });
    if (log.length > 50) log.splice(0, log.length - 50);
    localStorage.setItem(ACCESS_LOG_KEY, JSON.stringify(log));
  } catch {}
}

export function BuyerAuthProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [buyerStatus, setBuyerStatus] = useState<BuyerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkBuyerStatus = useCallback(async () => {
    if (!user?.email) {
      setBuyerStatus(null);
      setLoading(false);
      return;
    }

    const emailKey = user.email.toLowerCase().trim();

    // --- Supabase CRM lookup (single source of truth) ---
    if (!supabase) {
      setBuyerStatus({ tier: "free", isBuyer: false, isBundle: false, hasRecording: false, hasGuide: false, tags: [], accessCount: 0, welcomePopupShown: false });
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from("crm_contacts")
        .select("id, email, tags, metadata")
        .eq("email", emailKey)
        .limit(1);

      if (!data || data.length === 0) {
        // No CRM row yet - auto-create one for free-tier tracking
        try {
          await supabase.from("crm_contacts").insert({
            email: emailKey,
            source: "other",
            tags: ["portal_signup"],
            status: "new",
            first_name: user.user_metadata?.name?.split(" ")[0] || "",
            last_name: user.user_metadata?.name?.split(" ").slice(1).join(" ") || "",
            last_activity_at: new Date().toISOString(),
          });
        } catch {}
        setBuyerStatus({ tier: "free", isBuyer: false, isBundle: false, hasRecording: false, hasGuide: false, tags: ["portal_signup"], accessCount: 0, welcomePopupShown: false });
        setLoading(false);
        return;
      }

      const contact = data[0];
      const tags = (contact.tags as string[]) || [];
      const isBuyer = tags.includes("stripe_customer");
      const isBundle = tags.includes("bundle");
      const hasRecording = tags.includes("recording_access") || isBundle;
      const hasGuide = isBundle;

      let tier: AccessTier = "free";
      if (isBundle) tier = "bundle";
      else if (hasRecording) tier = "recording";

      const metadata = (contact as any).metadata;
      const welcomePopupShown = !!(metadata?.welcome_popup_shown);

      setBuyerStatus({ tier, isBuyer, isBundle, hasRecording, hasGuide, tags, accessCount: 0, welcomePopupShown, crmId: contact.id, metadata: metadata || {} });

      // Track portal access for any logged-in user
      logAccess(user.email);
      const portalTag = "portal_access";
      const newTags = [...new Set([...tags, portalTag])];
      await supabase
        .from("crm_contacts")
        .update({
          tags: newTags,
          last_activity_at: new Date().toISOString(),
          metadata: {
            ...(metadata || {}),
            last_portal_access: new Date().toISOString(),
            portal_device: navigator.userAgent.substring(0, 100),
          },
        })
        .eq("id", contact.id);
    } catch {
      setBuyerStatus(null);
    }

    setLoading(false);
  }, [user?.email]);

  const markWelcomeShown = useCallback(async () => {
    // Update local state immediately
    setBuyerStatus((prev) => prev ? { ...prev, welcomePopupShown: true, metadata: { ...(prev.metadata || {}), welcome_popup_shown: true } } : prev);

    // Persist to Supabase
    if (!supabase || !buyerStatus?.crmId) return;
    try {
      await supabase
        .from("crm_contacts")
        .update({
          metadata: {
            ...(buyerStatus.metadata || {}),
            welcome_popup_shown: true,
            welcome_popup_shown_at: new Date().toISOString(),
          },
        })
        .eq("id", buyerStatus.crmId);
    } catch {}
  }, [buyerStatus?.crmId, buyerStatus?.metadata]);

  useEffect(() => {
    if (user) {
      checkBuyerStatus();
    } else {
      setBuyerStatus(null);
      setLoading(false);
    }
  }, [user, checkBuyerStatus]);

  return (
    <BuyerAuthContext.Provider value={{ buyerStatus, loading, checkBuyerStatus, markWelcomeShown }}>
      {children}
    </BuyerAuthContext.Provider>
  );
}
