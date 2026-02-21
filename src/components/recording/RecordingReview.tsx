"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/hooks/use-language";
import { translations } from "@/lib/i18n/translations";
import type { RecordingScript, ScriptSegment } from "@/lib/types";
import { Play, Pause, RotateCcw, Wand2, Save, ArrowLeft } from "lucide-react";

interface RecordingReviewProps {
  segments: ScriptSegment[];
  script: RecordingScript;
  onBack: () => void;
}

export function RecordingReview({ segments, script, onBack }: RecordingReviewProps) {
  const { language } = useLanguage();
  const t = translations[language || 'ja'].recording;
  const [localSegments, setLocalSegments] = useState<ScriptSegment[]>(segments);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [processingIndex, setProcessingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (index: number) => {
    const segment = localSegments[index];
    if (!segment.audioUrl) return;

    if (playingIndex === index) {
      audioRef.current?.pause();
      setPlayingIndex(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(segment.audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => setPlayingIndex(null);
      audio.play();
      setPlayingIndex(index);
    }
  };

  const handleRemoveNoise = async (index: number) => {
    setProcessingIndex(index);
    
    const segment = localSegments[index];
    if (!segment.audioBlob) {
      setProcessingIndex(null);
      return;
    }

    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await segment.audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Apply noise reduction filter
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
      
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // High-pass filter to remove low-frequency noise
      const highPassFilter = offlineContext.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.value = 80;
      
      // Low-pass filter to remove high-frequency noise
      const lowPassFilter = offlineContext.createBiquadFilter();
      lowPassFilter.type = 'lowpass';
      lowPassFilter.frequency.value = 8000;
      
      source.connect(highPassFilter);
      highPassFilter.connect(lowPassFilter);
      lowPassFilter.connect(offlineContext.destination);
      
      source.start();
      const renderedBuffer = await offlineContext.startRendering();
      
      // Convert back to blob
      const wavBlob = await audioBufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);
      
      setLocalSegments(prev => prev.map((seg, idx) => 
        idx === index ? { ...seg, audioBlob: wavBlob, audioUrl: url } : seg
      ));
    } catch (error) {
      console.error('Noise removal error:', error);
    }
    
    setProcessingIndex(null);
  };

  const audioBufferToWav = async (buffer: AudioBuffer): Promise<Blob> => {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length, true);
    
    // Write audio data
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving session
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert("セッションを保存しました！");
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t.recording}
      </Button>

      <div>
        <h2 className="text-2xl font-bold mb-2">{t.reviewTitle}</h2>
        <p className="text-muted-foreground">{script.title}</p>
      </div>

      <div className="space-y-3">
        {localSegments.map((segment, index) => (
          <Card key={segment.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm mb-2">{segment.text}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePlay(index)}
                      disabled={!segment.audioUrl}
                    >
                      {playingIndex === index ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          {t.pause}
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          {t.play}
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!segment.audioUrl || processingIndex === index}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      {t.reRecord}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveNoise(index)}
                      disabled={!segment.audioUrl || processingIndex === index}
                    >
                      <Wand2 className="h-3 w-3 mr-1" />
                      {processingIndex === index ? t.processing : t.removeNoise}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onBack}>
          {t.back}
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? t.saving : t.saveSession}
        </Button>
      </div>
    </div>
  );
}
