
"use client";

import { Flame, Target, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionStore } from "@/lib/hooks/use-session-store";
import { Skeleton } from "@/components/ui/skeleton";
import messages from '@/../messages/ja.json';
import { Button } from "../ui/button";

function StatCard({ icon, title, value, unit, children }: { icon: React.ReactNode; title: string; value: number; unit: string; children?: React.ReactNode; }) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function ProgressTracker() {
  const t = messages.ProgressTracker;
  const { getTodayCount, getCurrentStreak, isStreakBroken, isLoaded } = useSessionStore();

  const sessionsToday = getTodayCount();
  const currentStreak = getCurrentStreak();
  const streakBroken = isStreakBroken();

  if (!isLoaded) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[125px] w-full" />
        <Skeleton className="h-[125px] w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard
        icon={<Target className="h-5 w-5 text-accent" />}
        title={t.sessions_today}
        value={sessionsToday}
        unit={t.done}
      />
      <StatCard
        icon={<Flame className="h-5 w-5 text-primary" />}
        title={t.current_streak}
        value={currentStreak}
        unit={currentStreak === 1 ? t.day : t.days}
      >
        {streakBroken && currentStreak === 0 && (
            <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">記録が途絶えちゃったけど、またここから始めよう！</p>
                <Button variant="outline" size="sm" className="mt-2 text-xs">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    再スタート
                </Button>
            </div>
        )}
      </StatCard>
    </div>
  );
}
