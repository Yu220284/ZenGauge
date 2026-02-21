"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import messages from '@/../messages/ja.json';

const FIRST_VISIT_KEY = "wellv_first_visit";

export function FirstLaunchModal() {
  const t = messages.FirstLaunch;
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);
      if (!firstVisit) {
        setIsOpen(true);
      }
    }
  }, [isMounted]);

  const handleAcknowledge = () => {
    localStorage.setItem(FIRST_VISIT_KEY, "false");
    setIsOpen(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-6 pt-4 text-foreground/80">
            <p>
              {t.description_1}
            </p>
            <p className="font-semibold">
              {t.description_2}
            </p>
            <p>
              {t.description_3}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAcknowledge}>
            {t.acknowledge_button}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
