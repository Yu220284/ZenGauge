"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/hooks/use-language";
import { translations } from "@/lib/i18n/translations";
import type { RecordingScript } from "@/lib/types";
import { Clock } from "lucide-react";

const SAMPLE_SCRIPTS: RecordingScript[] = [
  {
    id: "morning-yoga",
    title: "朝のヨガセッション",
    category: "yoga",
    totalDuration: 600,
    segments: [
      { id: "1", text: "おはようございます。今日も一緒に心と体をリフレッシュしましょう。", duration: 8 },
      { id: "2", text: "まずは楽な姿勢で座り、深呼吸から始めます。", duration: 6 },
      { id: "3", text: "鼻から大きく息を吸って、口からゆっくり吐き出します。", duration: 8 },
      { id: "4", text: "それでは、猫のポーズに移りましょう。四つん這いになります。", duration: 7 },
      { id: "5", text: "息を吸いながら背中を反らせ、吐きながら丸めます。", duration: 8 },
    ],
  },
  {
    id: "quick-workout",
    title: "5分間クイックワークアウト",
    category: "workout",
    totalDuration: 300,
    segments: [
      { id: "1", text: "さあ、5分間で体を目覚めさせましょう！", duration: 5 },
      { id: "2", text: "まずはジャンピングジャック30秒。準備はいいですか？", duration: 6 },
      { id: "3", text: "スタート！リズムよく跳びましょう。", duration: 4 },
      { id: "4", text: "次はスクワット20回。足を肩幅に開いて。", duration: 6 },
      { id: "5", text: "腰を落として、膝がつま先より前に出ないように。", duration: 7 },
    ],
  },
  {
    id: "evening-stretch",
    title: "夜のストレッチ",
    category: "stretch",
    totalDuration: 480,
    segments: [
      { id: "1", text: "一日お疲れ様でした。体をゆっくり伸ばしていきましょう。", duration: 7 },
      { id: "2", text: "床に座って、両足を前に伸ばします。", duration: 6 },
      { id: "3", text: "息を吸って背筋を伸ばし、吐きながら前屈します。", duration: 8 },
      { id: "4", text: "無理せず、気持ちいいところで止めてください。", duration: 6 },
      { id: "5", text: "深い呼吸を続けながら、30秒キープします。", duration: 7 },
    ],
  },
];

interface ScriptSelectorProps {
  onSelect: (script: RecordingScript) => void;
}

export function ScriptSelector({ onSelect }: ScriptSelectorProps) {
  const { language } = useLanguage();
  const t = translations[language || 'ja'].recording;
  const tTags = translations[language || 'ja'].tags;

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">{t.selectScript}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_SCRIPTS.map((script) => (
          <Card key={script.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{script.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">
                  {tTags[script.category]}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.floor(script.totalDuration / 60)}分
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {script.segments.length}セグメント
              </p>
              <Button onClick={() => onSelect(script)} className="w-full">
                {t.startRecording}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
