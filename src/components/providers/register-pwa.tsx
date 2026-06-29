"use client";

import { useEffect } from "react";

export function RegisterPwa() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    void navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error) => {
        console.error("CatFit service worker registration failed:", error);
      });
  }, []);

  return null;
}
