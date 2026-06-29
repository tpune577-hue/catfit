"use client";

import Link from "next/link";
import Image from "next/image";
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
import { PwaBrowserModeWarning } from "@/components/layout/pwa-browser-mode-warning";

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
        <header className="sticky top-0 z-40 shadow-md" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <div className="relative h-24 overflow-hidden">
            <Image
              src="/header-bg.png"
              alt=""
              fill
              className="object-cover object-top"
              priority
              unoptimized
            />
            {/* gradient overlay so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
            <div className="relative mx-auto flex h-full max-w-lg items-end justify-between px-4 pb-3 sm:px-5">
              <Link
                href="/"
                className="flex items-center gap-2 drop-shadow-md"
              >
                <Image
                  src="/catfit-logo.png"
                  alt="CatFit"
                  width={34}
                  height={34}
                  className="rounded-lg"
                  priority
                />
                <span className="text-xl font-bold tracking-tight text-white">
                  CatFit
                </span>
              </Link>
              <Link
                href="/settings"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors duration-200 hover:bg-white/20 hover:text-white"
                aria-label="ตั้งค่า"
              >
                <Settings className="h-5 w-5 drop-shadow-md" />
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5 pb-32 sm:px-5">
          {children}
        </main>

        {!hideNav && (
          <nav
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-sidebar-border bg-sidebar pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_oklch(0.22_0.055_52/0.4)]"
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
                        : "text-sidebar-foreground/55 hover:bg-white/8 hover:text-sidebar-foreground"
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
        {!hideNav && <PwaBrowserModeWarning />}
      </div>
    </StoreHydrationGate>
  );
}
