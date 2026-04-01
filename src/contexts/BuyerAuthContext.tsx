import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface BuyerStatus {
  isBuyer: boolean;
  isBundle: boolean;
  tags: string[];
  accessCount: number;
}

interface BuyerAuthContextValue {
  buyerStatus: BuyerStatus | null;
  loading: boolean;
  checkBuyerStatus: () => Promise<void>;
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
      setBuyerStatus({ isBuyer: false, isBundle: false, tags: [], accessCount: 0 });
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from("crm_contacts")
        .select("id, email, tags")
        .eq("email", emailKey)
        .limit(1);

      if (!data || data.length === 0) {
        // Email not in CRM - no access
        setBuyerStatus({ isBuyer: false, isBundle: false, tags: [], accessCount: 0 });
        setLoading(false);
        return;
      }

      const contact = data[0];
      const tags = (contact.tags as string[]) || [];
      const isBuyer = tags.includes("stripe_customer");
      const isBundle = tags.includes("bundle");

      setBuyerStatus({ isBuyer, isBundle, tags, accessCount: 0 });

      if (isBuyer) {
        logAccess(user.email);

        const portalTag = "portal_access";
        const newTags = [...new Set([...tags, portalTag])];
        await supabase
          .from("crm_contacts")
          .update({
            tags: newTags,
            last_activity_at: new Date().toISOString(),
            metadata: {
              last_portal_access: new Date().toISOString(),
              portal_device: navigator.userAgent.substring(0, 100),
            },
          })
          .eq("id", contact.id);
      }
    } catch {
      setBuyerStatus(null);
    }

    setLoading(false);
  }, [user?.email]);

  useEffect(() => {
    if (user) {
      checkBuyerStatus();
    } else {
      setBuyerStatus(null);
      setLoading(false);
    }
  }, [user, checkBuyerStatus]);

  return (
    <BuyerAuthContext.Provider value={{ buyerStatus, loading, checkBuyerStatus }}>
      {children}
    </BuyerAuthContext.Provider>
  );
}
