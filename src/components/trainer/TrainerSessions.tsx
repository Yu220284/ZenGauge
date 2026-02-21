"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Play } from "lucide-react";
import type { Session, SessionCategory } from "@/lib/types";
import { useLanguage } from "@/lib/hooks/use-language";
import { translateSessionTitle } from "@/lib/session-translations";

interface TrainerSessionsProps {
  sessions: Session[];
}

export function TrainerSessions({ sessions }: TrainerSessionsProps) {
  const { language } = useLanguage();
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getSessionsByCategory = (category: SessionCategory) => {
    return sessions.filter(session => session.category === category);
  };

  return (
    <Tabs defaultValue="workout" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="workout">ワークアウト</TabsTrigger>
        <TabsTrigger value="yoga">ヨガ</TabsTrigger>
        <TabsTrigger value="stretch">ストレッチ</TabsTrigger>
      </TabsList>
      
      {(['workout', 'yoga', 'stretch'] as SessionCategory[]).map((category) => {
        const categorySessions = getSessionsByCategory(category);
        return (
          <TabsContent key={category} value={category} className="mt-6">
            {categorySessions.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {categorySessions.map((session, index) => (
                  <Link key={session.id} href={`/session/${session.id}`} className="group">
                    <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1" data-tutorial={index === 0 ? "session-card" : undefined}>
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={session.imageUrl}
                          alt={session.title}
                          data-ai-hint={session.imageHint}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-12 w-12 text-white fill-white" />
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <CardTitle className="font-headline text-sm mb-1 line-clamp-2">{translateSessionTitle(session.title, language || 'ja')}</CardTitle>
                          <div className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDuration(session.duration)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">このカテゴリのセッションはまだありません。</p>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}