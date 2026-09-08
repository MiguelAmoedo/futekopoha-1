"use client";

import { useCallback, useEffect, useState } from "react";

export const PEBOL_SESSION_NAME_KEY = "pebol-session-name";
export const PEBOL_SESSION_ID_KEY = "pebol-session-id";

type PebolSession = {
  nome: string;
  sessionId: string;
  ready: boolean;
};

function readSession(): Omit<PebolSession, "ready"> {
  if (typeof window === "undefined") {
    return { nome: "", sessionId: "" };
  }

  let sessionId = localStorage.getItem(PEBOL_SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(PEBOL_SESSION_ID_KEY, sessionId);
  }

  return {
    nome: localStorage.getItem(PEBOL_SESSION_NAME_KEY) ?? "",
    sessionId,
  };
}

export function usePebolSession() {
  const [session, setSession] = useState<PebolSession>({
    nome: "",
    sessionId: "",
    ready: false,
  });

  useEffect(() => {
    const stored = readSession();
    setSession({ ...stored, ready: true });
  }, []);

  const setNome = useCallback((nome: string) => {
    const trimmed = nome.trim();
    localStorage.setItem(PEBOL_SESSION_NAME_KEY, trimmed);
    setSession((prev) => ({ ...prev, nome: trimmed }));
  }, []);

  return { ...session, setNome };
}
