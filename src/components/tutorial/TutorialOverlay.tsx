"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/lib/hooks/use-tutorial';
import { useRouter } from 'next/navigation';
import { useLocalAuth } from '@/lib/hooks/use-local-auth';
import { useEffect, useState } from 'react';

const TUTORIAL_STEPS = [
  { message: 'フォローしたトレーナーを見てみましょう', subtitle: '[トレーナー]ボタンをタップして次へ', target: '[data-tutorial="trainer-list"]', requireClick: true },
  { message: '先ほどフォローしたトレーナーがいますね！プロフィールを見てみましょう', subtitle: 'トレーナーカードをタップしてプロフィールへ', target: '[data-tutorial="trainer-card"]', requireClick: true },
  { message: 'このトレーナーのセッションを見てみましょう', subtitle: 'セッションカードをタップして詳細へ', fallbackSubtitle: 'ワークアウト、ヨガ、ストレッチをタップすると、カテゴリごとにセッションを見ることができます', target: '[data-tutorial="session-card"]', fallbackTarget: '[role="tablist"]', requireClick: true },
  { message: '早速セッションを聴いてみましょう！', subtitle: '[セッションを開始]ボタンをタップして次へ', target: '[data-tutorial="session-start"]', requireClick: true },
  { message: '開始ボタンを押してください', subtitle: '安全に運動できる環境を確認してください', target: '[data-tutorial="safety-start"]', requireClick: true },
  { message: '再生・一時停止ボタンで操作できます', subtitle: '画面をタップして次へ', target: '[data-tutorial="play-button"]', tapAnywhere: true },
  { message: '音量ボタンで音量を調整できます', subtitle: '画面をタップして次へ', target: '[data-tutorial="volume"]', tapAnywhere: true },
  { message: '左のボタンで10秒戻せます', subtitle: '画面をタップして次へ', target: '[data-tutorial="rewind"]', tapAnywhere: true },
  { message: '右のボタンで10秒送れます', subtitle: '画面をタップして次へ', target: '[data-tutorial="forward"]', tapAnywhere: true },
  { message: 'ハートボタンでお気に入りに追加できます', subtitle: '画面をタップして次へ', target: '[data-tutorial="favorite"]', tapAnywhere: true },
  { message: 'バーを最後まで動かしてセッションを終了してみましょう', subtitle: 'プログレスバーをドラッグして終端へ', target: '[data-tutorial="progress"]', requireClick: true },
  { message: 'コミュニティに感想を投稿できます', subtitle: '画面をタップして次へ', target: '[data-tutorial="post"]', tapAnywhere: true },
  { message: 'SNSでシェアできます', subtitle: '画面をタップして次へ', target: '[data-tutorial="share"]', tapAnywhere: true },
  { message: 'お疲れさまでした！これでチュートリアルは終了です。', subtitle: 'タップして終了' },
];

export function TutorialOverlay() {
  const { isActive, currentStep, nextStep, endTutorial } = useTutorial();
  const { updateProfile } = useLocalAuth();
  const router = useRouter();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // Block browser back button
    const blockBack = (e: PopStateEvent) => {
      e.preventDefault();
    };
    
    window.addEventListener('popstate', blockBack);
    
    const step = TUTORIAL_STEPS[currentStep];
    if (!step?.target) {
      setTargetRect(null);
      window.removeEventListener('popstate', blockBack);
      return;
    }

    const checkElement = () => {
      let element = document.querySelector(step.target!);
      let isFallback = false;
      
      // If primary target not found and fallback exists, try fallback
      if (!element && (step as any).fallbackTarget) {
        element = document.querySelector((step as any).fallbackTarget);
        isFallback = true;
      }
      
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        setUsingFallback(isFallback);
      } else {
        setTargetRect(null);
        setUsingFallback(false);
      }
    };

    checkElement();
    const interval = setInterval(checkElement, 100);
    window.addEventListener('scroll', checkElement, true);

    // Block all clicks except on target element
    const blockClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Allow skip button clicks
      if (target.closest('[data-tutorial-skip]')) {
        return;
      }
      
      const tutorialTarget = document.querySelector(step.target!);
      const fallbackTarget = (step as any).fallbackTarget ? document.querySelector((step as any).fallbackTarget) : null;
      
      // If no target is found (not highlighted), block all clicks
      if (!tutorialTarget && !fallbackTarget) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      
      // For requireClick steps, only allow clicking the target
      if (step.requireClick) {
        // Check if clicking inside the tutorial target
        const isClickingTarget = tutorialTarget && tutorialTarget.contains(target);
        
        // Check if clicking fallback target (tab)
        const isClickingFallback = fallbackTarget && fallbackTarget.contains(target);
        
        if (isClickingTarget) {
          // For progress bar (step 10), allow all interactions
          if (currentStep === 10) {
            return;
          }
          const clickedLink = target.closest('a');
          const clickedButton = target.closest('button');
          if (clickedLink || clickedButton) {
            setTimeout(() => nextStep(), 100);
          }
          return;
        } else if (isClickingFallback) {
          // Allow tab click but don't advance - wait for session card to appear
          return;
        } else {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('click', blockClicks, true);
    
    // Also block mousedown for non-target elements to prevent slider interaction
    const blockMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-tutorial-skip]')) return;
      
      const tutorialTarget = document.querySelector(step.target!);
      if (!tutorialTarget) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      
      if (step.requireClick) {
        const isClickingTarget = tutorialTarget && tutorialTarget.contains(target);
        if (!isClickingTarget) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('mousedown', blockMouseDown, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', checkElement, true);
      document.removeEventListener('click', blockClicks, true);
      document.removeEventListener('mousedown', blockMouseDown, true);
      window.removeEventListener('popstate', blockBack);
    };
  }, [isActive, currentStep, nextStep]);

  if (!isActive) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  console.log('TutorialOverlay render', { currentStep, step: step?.message, canTapAnywhere: step?.tapAnywhere || isLastStep });

  const handleNext = () => {
    console.log('handleNext called', { currentStep, isLastStep });
    if (isLastStep) {
      endTutorial();
      updateProfile({ onboardingCompleted: true });
      router.push('/');
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    endTutorial();
    updateProfile({ onboardingCompleted: true });
    router.push('/');
  };

  const canTapAnywhere = step?.tapAnywhere || isLastStep;

  return (
    <>
      {!isLastStep && (
        <>
          {targetRect ? (
            <svg className="fixed inset-0 z-[9998] pointer-events-none" style={{ width: '100vw', height: '100vh' }}>
              <defs>
                <mask id="tutorial-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  <rect
                    x={targetRect.left - 8}
                    y={targetRect.top - 8}
                    width={targetRect.width + 16}
                    height={targetRect.height + 16}
                    rx="12"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.1)"
                mask="url(#tutorial-mask)"
                className={canTapAnywhere ? 'cursor-pointer' : ''}
                style={{ pointerEvents: canTapAnywhere ? 'auto' : 'none' }}
                onClick={canTapAnywhere ? handleNext : undefined}
              />
            </svg>
          ) : (
            <div 
              className={`fixed inset-0 bg-black/10 z-[9998] ${canTapAnywhere ? 'cursor-pointer' : ''}`}
              style={{ pointerEvents: canTapAnywhere ? 'auto' : 'none' }}
              onClick={canTapAnywhere ? handleNext : undefined}
            />
          )}
        </>
      )}
      

      
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[10000] max-w-md w-full px-4">
        <Card className="bg-primary text-primary-foreground shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">
                {currentStep + 1}/{TUTORIAL_STEPS.length}
              </div>
              <div className="flex-1 text-center">
                <p className="text-sm font-medium break-words">{step?.message}</p>
                <p className="text-xs mt-2 opacity-80 break-words">
                  {usingFallback && (step as any).fallbackSubtitle ? (step as any).fallbackSubtitle : step?.subtitle}
                </p>
              </div>
              {!isLastStep && (
                <button 
                  onClick={handleSkip} 
                  className="flex-shrink-0 px-3 py-1 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-xs font-medium transition-colors pointer-events-auto"
                  data-tutorial-skip
                >
                  skip
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isLastStep && (
        <div 
          className="fixed inset-0 z-[9998] cursor-pointer"
          onClick={handleNext}
        />
      )}
    </>
  );
}
