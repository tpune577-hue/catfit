"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  Apple,
  Activity,
  FileHeart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StoreHydrationGate } from "@/components/providers/store-hydration-gate";
import { PwaInstallBanner } from "@/components/layout/pwa-install-banner";

const navItems = [
  { href: "/", label: "หน้าหลัก", shortLabel: "หลัก", icon: Home },
  { href: "/workout", label: "ออกกำลังกาย", shortLabel: "ออกกำลัง", icon: Dumbbell },
  { href: "/nutrition", label: "โภชนาการ", shortLabel: "อาหาร", icon: Apple },
  { href: "/body", label: "ร่างกาย", shortLabel: "ร่างกาย", icon: Activity },
  { href: "/health", label: "สุขภาพ", shortLabel: "สุขภาพ", icon: FileHeart },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/onboarding");

  return (
    <StoreHydrationGate>
      <div className="flex min-h-screen flex-col bg-background">
        <PwaInstallBanner />
        <header className="sticky top-0 z-40 border-b border-primary/30 bg-foreground pt-[env(safe-area-inset-top)] text-background shadow-md">
          <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4 sm:px-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-base font-black text-primary-foreground"
                aria-hidden
              >
                C
              </span>
              <span className="text-primary">CatFit</span>
            </Link>
            <Link
              href="/settings"
              className="flex h-11 w-11 items-center justify-center rounded-full text-background/70 transition-colors duration-200 hover:bg-primary/20 hover:text-primary"
              aria-label="ตั้งค่า"
            >
              <Settings className="h-6 w-6" />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5 pb-32 sm:px-5">
          {children}
        </main>

        {!hideNav && (
          <nav
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-primary/25 bg-foreground pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_oklch(0.13_0.012_25/0.35)]"
            aria-label="เมนูหลัก"
          >
            <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 pt-2.5 pb-2">
              {navItems.map(({ href, label, shortLabel, icon: Icon }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-medium transition-all duration-200 ease-out sm:text-sm",
                      active
                        ? "bg-primary font-bold text-primary-foreground shadow-sm"
                        : "text-background/55 hover:bg-white/8 hover:text-background"
                    )}
                  >
                    <Icon
                      className="h-6 w-6 shrink-0"
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span className="max-w-full truncate leading-tight">
                      <span className="hidden min-[380px]:inline">{label}</span>
                      <span className="min-[380px]:hidden">{shortLabel}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </StoreHydrationGate>
  );
}
