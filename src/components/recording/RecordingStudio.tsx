"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/lib/hooks/use-language";
import { translations } from "@/lib/i18n/translations";
import type { RecordingScript, ScriptSegment } from "@/lib/types";
import { Mic, Square, Play, Pause, ChevronLeft, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { RecordingReview } from "./RecordingReview";

interface RecordingStudioProps {
  script: RecordingScript;
  onBack: () => void;
}

export function RecordingStudio({ script, onBack }: RecordingStudioProps) {
  const { language } = useLanguage();
  const t = translations[language || 'ja'].recording;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [segments, setSegments] = useState<ScriptSegment[]>(script.segments);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSegment = segments[currentIndex];
  const lines = currentSegment.text.split('\n');
  const charsPerSecond = 2.5;
  const currentCharIndex = Math.floor(timer * charsPerSecond);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
        alert('録音機能はこのブラウザではサポートされていません');
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('録音機能はこのブラウザではサポートされていません');
        return;
      }

      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Edge-specific MIME type handling
      let options: MediaRecorderOptions = {};
      const mimeTypes = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/mp4',
      ];
      
      for (const mimeType of mimeTypes) {
        try {
          if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(mimeType)) {
            options.mimeType = mimeType;
            break;
          }
        } catch (e) {
          // Continue to next mime type
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        setSegments(prev => prev.map((seg, idx) => 
          idx === currentIndex ? { ...seg, audioBlob: blob, audioUrl: url } : seg
        ));
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
      
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 0.1);
      }, 100);
    } catch (err) {
      console.error("Recording error:", err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          alert('マイクへのアクセスが拒否されました。ブラウザの設定でマイクの使用を許可してください。');
        } else if (err.name === 'NotFoundError') {
          alert('マイクが見つかりません。マイクが接続されているか確認してください。');
        } else {
          alert(`録音エラー: ${err.message}`);
        }
      } else {
        alert('録音中にエラーが発生しました');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimer(0);
    } else {
      setShowReview(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setTimer(0);
    }
  };

  const handlePlayRecording = () => {
    if (!currentSegment.audioUrl) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(currentSegment.audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  const goToSegment = (index: number) => {
    setCurrentIndex(index);
    setTimer(0);
  };

  const progress = ((currentIndex + 1) / segments.length) * 100;

  if (showReview) {
    return <RecordingReview segments={segments} script={script} onBack={() => setShowReview(false)} />;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t.selectScript}
      </Button>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {t.segment} {currentIndex + 1} / {segments.length}
              </span>
              <span className="text-sm font-mono">
                {timer.toFixed(1)}s / {currentSegment.duration}s
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="bg-secondary/30 p-6 rounded-lg min-h-[120px] flex flex-col items-center justify-center gap-4">
            <div className="text-lg text-center leading-relaxed whitespace-pre-line">
              {lines.map((line, lineIndex) => {
                let charCount = 0;
                for (let i = 0; i < lineIndex; i++) {
                  charCount += lines[i].length + 1;
                }
                const lineStart = charCount;
                const lineEnd = lineStart + line.length;
                
                return (
                  <div key={lineIndex}>
                    {line.split('').map((char, charIndex) => {
                      const globalCharIndex = lineStart + charIndex;
                      const isHighlighted = isRecording && globalCharIndex <= currentCharIndex;
                      return (
                        <span
                          key={charIndex}
                          className={`transition-colors duration-100 ${
                            isHighlighted ? 'text-primary font-bold' : 'text-foreground'
                          }`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {currentSegment.images && currentSegment.images.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-center">
                {currentSegment.images.map((img, idx) => (
                  <img key={idx} src={img} alt="Reference" className="h-32 rounded-lg object-cover" />
                ))}
              </div>
            )}
            {currentSegment.videoUrl && (
              <video src={currentSegment.videoUrl} className="max-h-48 rounded-lg" controls />
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            {!currentSegment.audioUrl ? (
              <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-32 h-32 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
              >
                {isRecording ? (
                  <Square className="h-12 w-12" />
                ) : (
                  <Mic className="h-12 w-12" />
                )}
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">{t.recorded}</span>
                </div>
                <Button variant="outline" onClick={handlePlayRecording}>
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      {t.pause}
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t.play}
                    </>
                  )}
                </Button>
              </div>
            )}

            <div className="w-full space-y-2">
              <div className="text-sm text-muted-foreground text-center mb-2">
                {language === 'ja' ? 'セグメント選択' : 'Select Segment'}
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {segments.map((seg, idx) => (
                  <Button
                    key={seg.id}
                    size="sm"
                    variant={idx === currentIndex ? 'default' : 'outline'}
                    onClick={() => goToSegment(idx)}
                    className="relative"
                  >
                    {idx + 1}
                    {seg.audioUrl && (
                      <Check className="h-3 w-3 absolute -top-1 -right-1 text-green-500" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t.prevSegment}
              </Button>
              
              {currentSegment.audioUrl && (
                <Button variant="outline" onClick={() => {
                  setSegments(prev => prev.map((seg, idx) => 
                    idx === currentIndex ? { ...seg, audioUrl: undefined, audioBlob: undefined } : seg
                  ));
                }}>
                  {t.reRecord}
                </Button>
              )}

              <Button
                onClick={handleNext}
              >
                {currentIndex === segments.length - 1 ? t.finish : t.nextSegment}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
