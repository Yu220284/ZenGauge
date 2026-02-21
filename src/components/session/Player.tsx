"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Play,
  Pause,
  RotateCcw,
  X,
  Heart,
  Volume2,
  VolumeX,
  Loader2,
  Rewind,
  FastForward,
  UserPlus,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSessionStore } from "@/lib/hooks/use-session-store";
import { useFollowStore } from "@/lib/hooks/use-follow-store";
import { usePremium } from "@/lib/hooks/use-premium";
import type { Session } from "@/lib/types";
import { SafetyPromptDialog } from "./SafetyPromptDialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { TRAINERS } from "@/lib/data";
import { useLanguage } from "@/lib/hooks/use-language";
import { translateSessionTitle, translateSegmentAction } from "@/lib/session-translations";

import { useDiamonds } from "@/lib/hooks/use-diamonds";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function Player({ session, trainerId = 1 }: { session: Session; trainerId?: number }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [t, setT] = useState<any>(null);
  const [tUI, setTUI] = useState<any>(null);
  
  useEffect(() => {
    const loadTranslations = async () => {
      const messages = await import(`@/../messages/${language || 'ja'}.json`);
      setT(messages.default.SessionPlayer);
      setTUI(messages.default.SessionPlayer_UI);
    };
    loadTranslations();
  }, [language]);
  const { addSession, toggleFavorite, isFavorite, isLoaded } = useSessionStore();
  const { toggleFollow, isFollowing } = useFollowStore();
  const { checkPremiumStatus } = usePremium();
  const { toast } = useToast();
  const { checkDailyReward } = useDiamonds();
  const selectedTrainer = TRAINERS.find(trainer => trainer.id === trainerId) || TRAINERS[0];
  const isPremium = checkPremiumStatus();
  
  const getAudioUrl = () => {
    return session.audioUrl || '';
  };
  
  const audioUrl = getAudioUrl();
  const videoUrl = session.videoUrl || '';
  const hasVideo = isPremium && session.hasVideo && videoUrl;

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSafetyPromptOpen, setIsSafetyPromptOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [actualDuration, setActualDuration] = useState(session.duration);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [segmentTime, setSegmentTime] = useState(0);
  const [isInPause, setIsInPause] = useState(false);

  const isFav = isLoaded ? isFavorite(session.id) : false;
  const hasSegments = session.segments && session.segments.length > 0;
  const currentSegment = hasSegments ? session.segments[currentSegmentIndex] : null;



  const handleStartSession = () => {
    setIsSafetyPromptOpen(false);
    if (hasVideo && videoRef.current) {
      videoRef.current.play().catch((e) => console.error("Video play failed:", e));
    } else if (audioUrl && audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
    } else {
      setIsPlaying(true);
      setIsReady(true);
    }
  };

  const handleCanPlay = () => {
    setIsReady(true);
    const media = hasVideo ? videoRef.current : audioRef.current;
    if (media) {
      if (media.duration && !isNaN(media.duration) && isFinite(media.duration)) {
        setActualDuration(media.duration);
      }
      media.playbackRate = playbackRate;
    }
  };

  const togglePlayPause = useCallback(() => {
    if (hasVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((e) => console.error("Video play failed:", e));
      }
    } else if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [hasVideo, audioUrl, isPlaying]);

  const restart = useCallback(() => {
    setCurrentTime(0);
    setCurrentSegmentIndex(0);
    setSegmentTime(0);
    setIsInPause(false);
    if (hasVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      if (!isPlaying) {
        videoRef.current.play().catch((e) => console.error("Video play failed:", e));
      }
    } else if (audioUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e));
      }
    } else if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [hasVideo, audioUrl, isPlaying]);

  const handleStop = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentSegmentIndex(0);
    setSegmentTime(0);
    setIsInPause(false);
    router.push("/");
  }, [router]);

  const toggleMute = () => {
    if (hasVideo && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const vol = value[0];
    setVolume(vol);
    if (hasVideo && videoRef.current) {
      videoRef.current.volume = vol;
    } else if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handlePlaybackRateChange = (value: number[]) => {
    const rate = value[0];
    setPlaybackRate(rate);
    if (hasVideo && videoRef.current) {
      videoRef.current.playbackRate = rate;
    } else if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleFavoriteToggle = () => {
    if (!t) return;
    const wasIsFav = isFav;
    toggleFavorite(session.id);
    
    setTimeout(() => {
      toast({
        title: wasIsFav ? t.removed_from_favorites : t.added_to_favorites,
        description: session.title,
      });
    }, 0);
  };

  const seek = useCallback((delta: number) => {
    const mediaRef = hasVideo ? videoRef.current : audioRef.current;
    if (!mediaRef) return;
    const newTime = Math.max(0, Math.min(actualDuration, mediaRef.currentTime + delta));
    mediaRef.currentTime = newTime;
    setCurrentTime(newTime);
  }, [hasVideo, actualDuration]);

  const handleSliderChange = (value: number[]) => {
    const newTime = value[0];
    const mediaRef = hasVideo ? videoRef.current : audioRef.current;
    if (mediaRef) {
      mediaRef.currentTime = newTime;
    }
    setCurrentTime(newTime);
    
    const tutorialActive = localStorage.getItem('wellv_tutorial_active') === 'true';
    const currentStep = parseInt(localStorage.getItem('wellv_tutorial_step') || '0');
    if (tutorialActive && currentStep === 10 && newTime >= session.duration - 1) {
      localStorage.setItem('wellv_tutorial_step', '11');
    }
  };

  useEffect(() => {
    if (isPlaying && !audioUrl && !hasVideo && hasSegments) {
      const timer = setInterval(() => {
        setSegmentTime((prevTime) => prevTime + 1);
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (isPlaying && !audioUrl && !hasVideo) {
      const timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= actualDuration) {
            clearInterval(timer);
            addSession(session.id);
            setIsPlaying(false);
            const tutorialActive = localStorage.getItem('wellv_tutorial_active') === 'true';

            setTimeout(() => router.push(`/session/${session.id}/result`), tutorialActive ? 0 : 2000);
            return actualDuration;
          }
          return prevTime + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, actualDuration, session.id, audioUrl, hasVideo, addSession, router, toast, t, session.title, hasSegments]);

  useEffect(() => {
    if (!hasSegments || !currentSegment || !isPlaying) return;

    const totalSegmentTime = currentSegment.duration + (currentSegment.pauseAfter || 0);
    
    if (segmentTime >= totalSegmentTime) {
      if (currentSegmentIndex < session.segments!.length - 1) {
        setCurrentSegmentIndex(prev => prev + 1);
        setSegmentTime(0);
        setIsInPause(false);
      } else {
        setIsPlaying(false);
        addSession(session.id);
        
        const gotReward = checkDailyReward();
        if (gotReward && toast && language) {
          toast({
            title: language === 'ja' ? 'デイリー報酬獲得！' : 'Daily Reward!',
            description: language === 'ja' ? '+5ダイヤモンド' : '+5 Diamonds',
          });
        }
        
        const tutorialActive = localStorage.getItem('wellv_tutorial_active') === 'true';
        setTimeout(() => router.push(`/session/${session.id}/result`), tutorialActive ? 0 : 500);
      }
    } else if (segmentTime >= currentSegment.duration && !isInPause) {
      setIsInPause(true);
    }
  }, [segmentTime, currentSegment, currentSegmentIndex, hasSegments, session, addSession, router, isPlaying, isInPause]);

  useEffect(() => {
    const media = hasVideo ? videoRef.current : audioRef.current;
    if (!media || (!hasVideo && !audioUrl)) return;

    media.playbackRate = playbackRate;

    const updateCurrentTime = () => setCurrentTime(media.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      addSession(session.id);
      setIsPlaying(false);
      
      const gotReward = checkDailyReward();
      if (gotReward) {
        toast({
          title: language === 'ja' ? 'デイリー報酬獲得！' : 'Daily Reward!',
          description: language === 'ja' ? '+5ダイヤモンド' : '+5 Diamonds',
        });
      }
      
      const tutorialActive = localStorage.getItem('wellv_tutorial_active') === 'true';
      setTimeout(() => router.push(`/session/${session.id}/result`), tutorialActive ? 0 : 2000);
    };

    media.addEventListener("timeupdate", updateCurrentTime);
    media.addEventListener("play", onPlay);
    media.addEventListener("pause", onPause);
    media.addEventListener("ended", onEnded);
    media.addEventListener("canplay", handleCanPlay);

    return () => {
      media.removeEventListener("timeupdate", updateCurrentTime);
      media.removeEventListener("play", onPlay);
      media.removeEventListener("pause", onPause);
      media.removeEventListener("ended", onEnded);
      media.removeEventListener("canplay", handleCanPlay);
    };
  }, [addSession, session.id, router, toast, t, session.title, audioUrl, hasVideo, playbackRate]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: session.title,
        artist: selectedTrainer.name,
        album: session.category === 'workout' ? 'ワークアウト' : session.category === 'yoga' ? 'ヨガ' : 'ストレッチ',
        artwork: [
          { src: session.imageUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: session.imageUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: session.imageUrl, sizes: '192x192', type: 'image/jpeg' },
          { src: session.imageUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: session.imageUrl, sizes: '384x384', type: 'image/jpeg' },
          { src: session.imageUrl, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', togglePlayPause);
      navigator.mediaSession.setActionHandler('pause', togglePlayPause);
      navigator.mediaSession.setActionHandler('seekbackward', () => seek(-10));
      navigator.mediaSession.setActionHandler('seekforward', () => seek(10));
      navigator.mediaSession.setActionHandler('previoustrack', restart);
      navigator.mediaSession.setActionHandler('stop', handleStop);
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('stop', null);
      }
    };
  }, [session.title, session.category, session.imageUrl, selectedTrainer.name, togglePlayPause, seek, restart, handleStop]);
  
  if (!t || !tUI) return null;

  return (
    <>
      <SafetyPromptDialog
        open={isSafetyPromptOpen}
        onStart={handleStartSession}
      />

      {!hasVideo && audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          preload="auto"
          onLoadedMetadata={(e) => {
            const audio = e.currentTarget;
            audio.playbackRate = playbackRate;
          }}
        />
      )}
      <div className="relative h-screen w-screen overflow-hidden">
        <Image
          src={session.imageUrl}
          alt={session.title}
          data-ai-hint={session.imageHint}
          fill
          className="object-cover scale-110 blur-xl"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-white/20 shadow-2xl">
          <div className="p-6 space-y-4">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
              {hasVideo ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  preload="auto"
                  playsInline
                />
              ) : (
                <Image
                  src={session.imageUrl}
                  alt={session.title}
                  data-ai-hint={session.imageHint}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            <div className="text-center">
              <p className="text-sm uppercase tracking-wider text-primary font-semibold">{session.category}</p>
              <h1 className="text-2xl font-bold font-headline mt-1">{translateSessionTitle(session.title, language || 'ja')}</h1>
              <p className="text-sm text-muted-foreground mt-2">{tUI.guide.replace('{trainerName}', selectedTrainer.name)}</p>
              {hasSegments && currentSegment && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-lg font-semibold">
                    {isInPause ? (language === 'ja' ? '休憩中...' : 'Rest...') : translateSegmentAction(currentSegment.action, language || 'ja')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentSegmentIndex + 1} / {session.segments!.length}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={actualDuration}
                onValueChange={handleSliderChange}
                aria-label={t.progress_label}
                disabled={!isReady}
                className="cursor-pointer"
                data-tutorial="progress"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(actualDuration - currentTime)}</span>
              </div>
            </div>

            {!isReady && !isSafetyPromptOpen && (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            )}

            {isReady && (
              <>
                <div className="min-h-[100px] flex items-center justify-center">
                  {!showSpeedControl && !showVolumeControl && (
                    <div className="flex justify-center items-center gap-4 animate-in fade-in duration-200">
                    <Button
                      variant="ghost"
                      onClick={() => seek(-10)}
                      className="relative h-16 w-16 flex flex-col items-center justify-center gap-0.5"
                      aria-label={t.seek_backward_aria}
                      data-tutorial="rewind"
                    >
                      <span className="text-sm font-bold ml-1">10</span>
                      <Rewind className="h-7 w-7" />
                    </Button>
                    <Button
                      variant="default"
                      onClick={togglePlayPause}
                      className="h-20 w-20 rounded-full shadow-lg"
                      aria-label={isPlaying ? t.pause_button_aria : t.play_button_aria}
                      data-tutorial="play-button"
                    >
                      {isPlaying ? (
                        <Pause className="h-10 w-10 fill-primary-foreground" />
                      ) : (
                        <Play className="h-10 w-10 fill-primary-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => seek(10)}
                      className="relative h-16 w-16 flex flex-col items-center justify-center gap-0.5"
                      aria-label={t.seek_forward_aria}
                      data-tutorial="forward"
                    >
                      <span className="text-sm font-bold mr-1">10</span>
                      <FastForward className="h-7 w-7" />
                    </Button>
                    </div>
                  )}

                  {showSpeedControl && isPremium && (
                    <div className="w-full p-4 bg-muted/50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{tUI.playback_speed}</span>
                      <span className="text-sm font-mono">{playbackRate.toFixed(1)}x</span>
                    </div>
                    <Slider
                      value={[playbackRate]}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      onValueChange={handlePlaybackRateChange}
                      className="cursor-pointer"
                    />
                    <div className="relative h-4">
                      <div className="absolute left-0 text-xs text-muted-foreground">0.5x</div>
                      <div className="absolute text-xs text-muted-foreground" style={{ left: 'calc(33.33%)' }}>1.0x</div>
                      <div className="absolute right-0 text-xs text-muted-foreground">2.0x</div>
                    </div>
                    </div>
                  )}

                  {showVolumeControl && (audioUrl || hasVideo) && (
                    <div className="w-full p-4 bg-muted/50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{tUI.volume}</span>
                      <span className="text-sm font-mono">{Math.round(volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                    />
                    <div className="relative h-4">
                      <div className="absolute left-0 text-xs text-muted-foreground">0%</div>
                      <div className="absolute left-1/2 -translate-x-1/2 text-xs text-muted-foreground">50%</div>
                      <div className="absolute right-0 text-xs text-muted-foreground">100%</div>
                    </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-5 items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowVolumeControl(!showVolumeControl);
                      if (!showVolumeControl) setShowSpeedControl(false);
                    }}
                    className="h-16 w-16"
                    aria-label={tUI.volume_control}
                    disabled={!audioUrl && !hasVideo}
                    data-tutorial="volume"
                  >
                    {isMuted ? <VolumeX className={cn("h-8 w-8 transition-colors", showVolumeControl && "text-primary")} /> : <Volume2 className={cn("h-8 w-8 transition-colors", showVolumeControl && "text-primary")} />}
                  </Button>

                  <div className="col-span-3 flex justify-center items-center gap-2">
                    {isPremium && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowSpeedControl(!showSpeedControl);
                          if (!showSpeedControl) setShowVolumeControl(false);
                        }}
                        className="h-16 w-16"
                        aria-label={tUI.speed_control}
                      >
                        <Gauge className={cn("h-8 w-8 transition-colors", showSpeedControl && "text-primary")} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={handleFavoriteToggle}
                      className="h-16 w-16"
                      aria-label={isFav ? t.remove_from_favorites_button_aria : t.add_to_favorites_button_aria}
                      data-tutorial="favorite"
                    >
                      <Heart className={cn("h-8 w-8 transition-colors", isFav && "fill-red-500 text-red-500")} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const wasFollowing = isFollowing(selectedTrainer.id);
                        toggleFollow(selectedTrainer.id);
                        setTimeout(() => {
                          toast({
                            title: wasFollowing ? tUI.unfollowed : tUI.followed,
                            description: selectedTrainer.name,
                          });
                        }, 0);
                      }}
                      className="h-16 w-16"
                      aria-label={isFollowing(selectedTrainer.id) ? tUI.unfollow : tUI.follow}
                    >
                      <UserPlus className={cn("h-8 w-8 transition-colors", isFollowing(selectedTrainer.id) && "text-primary")} />
                    </Button>
                  </div>

                  <Button 
                    variant="ghost" 
                    onClick={() => setShowStopDialog(true)} 
                    className="h-16 w-16" 
                    aria-label={t.stop_button_aria}
                    type="button"
                  >
                    <X className="h-8 w-8" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-center">{tUI.stop_dialog_title}</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {tUI.stop_dialog_description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-2 items-center sm:flex-col">
            <AlertDialogAction
              onClick={() => {
                restart();
                setShowStopDialog(false);
              }}
              className="w-full"
            >
              {tUI.restart_from_beginning}
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                handleStop();
                setShowStopDialog(false);
              }}
              className="w-full"
              variant="destructive"
            >
              {tUI.end_session}
            </AlertDialogAction>
            <AlertDialogCancel className="w-full">{tUI.cancel}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
