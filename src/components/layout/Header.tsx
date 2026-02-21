"use client";

import Link from "next/link";
import Image from "next/image";
import { Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

export function Header() {
  const { user } = useAuth();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-1 px-3 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto relative flex items-center justify-between">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </Link>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-lg font-light tracking-wider text-primary">
              ZenGauge
            </h1>
          </Link>
        </div>
        
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="h-7 w-7 relative">
            <User className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
