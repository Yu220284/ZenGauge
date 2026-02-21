"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/my-videos", label: "Videos", icon: Video },
    { href: "/", label: "Home", icon: Home, isCentral: true },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-card/80 backdrop-blur-md border-t border-border/20">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCentral) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex justify-center"
              >
                <div className={cn(
                  "absolute -top-6 flex h-14 w-14 items-center justify-center rounded-full border-4 border-background shadow-lg transition-all",
                  isActive ? "bg-primary scale-110" : "bg-card hover:scale-105"
                )}>
                  <Icon className={cn(
                    "h-6 w-6",
                    isActive ? "text-primary-foreground" : "text-primary"
                  )} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
