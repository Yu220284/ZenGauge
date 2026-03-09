"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-1 px-3 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto relative flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-lg font-light tracking-wider text-primary">
            ZenGauge
          </h1>
        </Link>
      </div>
    </header>
  );
}
