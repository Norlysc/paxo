"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function PageViewTracker() {
  useEffect(() => {
    void trackEvent("page_view");
  }, []);
  return null;
}
