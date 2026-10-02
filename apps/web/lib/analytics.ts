"use client";

import type { AnalyticsEventType } from "@paxo/shared";
import { getSupabaseBrowserClient } from "./supabase";

const SESSION_KEY = "paxo_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Registra un evento de analítica propia en Supabase y, si están
 * configurados, en GA4 (gtag) y Meta Pixel (fbq). Falla en silencio si
 * Supabase no está configurado (entorno de desarrollo sin credenciales).
 */
export async function trackEvent(
  eventType: AnalyticsEventType,
  options?: { path?: string; metadata?: Record<string, unknown> }
) {
  const sessionId = getSessionId();
  const path = options?.path ?? (typeof window !== "undefined" ? window.location.pathname : undefined);

  if (typeof window !== "undefined") {
    window.gtag?.("event", eventType, { ...options?.metadata, page_path: path });
    window.fbq?.("trackCustom", eventType, options?.metadata ?? {});
  }

  try {
    const supabase = getSupabaseBrowserClient();
    await supabase.from("web_analytics_events").insert({
      event_type: eventType,
      path,
      session_id: sessionId,
      metadata: options?.metadata ?? {},
    });
  } catch {
    // La analítica nunca debe romper la experiencia del usuario.
  }
}
