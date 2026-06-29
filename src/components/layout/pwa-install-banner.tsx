"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export function PwaInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (isStandaloneMode()) return;
    if (sessionStorage.getItem("pwa-install-dismissed") === "1") return;

    const ua = window.navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(ua) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIos(ios);
    setVisible(true);

    const onInstallable = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onInstallable);
    return () => window.removeEventListener("beforeinstallprompt", onInstallable);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("pwa-install-dismissed", "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  if (!visible || isStandaloneMode()) return null;

  return (
    <div className="border-b border-primary/30 bg-secondary px-4 py-3">
      <div className="mx-auto flex max-w-lg items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            ติดตั้ง CatFit ลงเครื่อง
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
            {isIos
              ? "กด Share แล้วเลือก Add to Home Screen จากนั้นเปิดจากไอคอนบนหน้าจอ จะไม่มีแถบ Chrome"
              : deferredPrompt
                ? "ติดตั้งแล้วเปิดจากไอคอนหน้าจอ จะไม่มีแถบ URL ของ Chrome"
                : "เมนู Chrome (⋮) → Install app หรือ Add to Home screen แล้วเปิดจากไอคอน ไม่ใช่แท็บเบราว์เซอร์"}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {deferredPrompt && (
            <Button size="sm" className="gap-1" onClick={install}>
              <Download className="h-4 w-4" />
              ติดตั้ง
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={dismiss}
            aria-label="ปิด"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
