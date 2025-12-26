import { supabase } from "@/src/utils/supabase"; // Adjust path as needed
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Create the Context
interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// 2. Create the Provider Component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2a. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // 2b. Session change listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // We don't set isLoading to false here, as the initial check handles it.
        // This listener handles subsequent login/logout events.
      }
    );

    // Clean up the listener on component unmount
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

// 3. Custom Hook to use the Context
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
