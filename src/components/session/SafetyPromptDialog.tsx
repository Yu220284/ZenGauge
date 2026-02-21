"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Dot } from "lucide-react";
import { AdBanner } from "@/components/layout/AdBanner";
import { useLanguage } from "@/lib/hooks/use-language";
import { useEffect, useState } from "react";

interface SafetyPromptDialogProps {
  open: boolean;
  onStart: () => void;
}

const safetyPromptJa = [
    "足元や周囲に物がないかを確認し、転倒や事故を防ぎましょう。",
    "運動前後には十分な水分を摂取してください。",
    "痛み・強い不快感・めまいなどを感じた場合はすぐに中止し、必要に応じて医療機関へ相談してください。",
];

const safetyPromptEn = [
    "Check your surroundings and ensure there are no obstacles to prevent falls or accidents.",
    "Stay hydrated before and after exercise.",
    "Stop immediately if you experience pain, discomfort, or dizziness, and consult a medical professional if necessary.",
];

export function SafetyPromptDialog({ open, onStart }: SafetyPromptDialogProps) {
  const { language } = useLanguage();
  const [t, setT] = useState<any>(null);
  
  useEffect(() => {
    const loadTranslations = async () => {
      const messages = await import(`@/../messages/${language || 'ja'}.json`);
      setT(messages.default.SafetyPrompt);
    };
    loadTranslations();
  }, [language]);

  const safetyPrompt = language === 'en' ? safetyPromptEn : safetyPromptJa;

  if (!t) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription asChild className="pt-4 text-left">
            <ul className="space-y-3 text-base text-foreground/90">
                {safetyPrompt.map((item, index) => (
                    <li key={index} className="flex items-start">
                        <Dot className="h-6 w-6 text-primary flex-shrink-0 -ml-1" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-6 my-4">
          <AdBanner />
        </div>
        <DialogFooter>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              const tutorialActive = localStorage.getItem('wellv_tutorial_active') === 'true';
              const currentStep = parseInt(localStorage.getItem('wellv_tutorial_step') || '0');
              if (tutorialActive && currentStep === 4) {
                localStorage.setItem('wellv_tutorial_step', '5');
              }
              onStart();
            }} 
            className="w-full" 
            data-tutorial="safety-start"
          >
            {t.start_button}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
