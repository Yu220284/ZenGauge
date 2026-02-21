'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, Loader2 } from 'lucide-react'
import { generateMeditationAudio } from '@/lib/minimax'

const sessions = [
  { 
    id: 1, 
    title: '朝の瞑想', 
    duration: 10, 
    description: '一日の始まりに',
    script: '深く息を吸って、ゆっくりと吐き出してください。今、この瞬間に意識を向けましょう。'
  },
  { 
    id: 2, 
    title: '呼吸法', 
    duration: 5, 
    description: '心を落ち着ける',
    script: '鼻から4秒かけて息を吸い、7秒間息を止め、8秒かけて口から吐き出します。'
  },
  { 
    id: 3, 
    title: '夜の瞑想', 
    duration: 15, 
    description: '一日の終わりに',
    script: '今日一日の出来事を手放し、心を静めていきましょう。深い安らぎの中へ。'
  }
]

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const session = sessions.find(s => s.id === Number(params.id))

  useEffect(() => {
    if (!session) return

    const loadAudio = async () => {
      setIsLoading(true)
      try {
        const audioBlob = await generateMeditationAudio(session.script)
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
      } catch (error) {
        console.error('Failed to generate audio:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAudio()

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [session?.id])

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play()
    setIsPlaying(true)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <main className="container mx-auto px-4 pt-24 text-center">
          <p>セッションが見つかりません</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            ホームに戻る
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-2">{session.title}</h1>
            <p className="text-muted-foreground">{session.description}</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="text-6xl font-light text-primary">
                  {session.duration}:00
                </div>

                {isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="flex justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={handlePlayPause}
                      disabled={!audioUrl}
                      className="rounded-full h-16 w-16"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleRestart}
                      disabled={!audioUrl}
                      className="rounded-full h-16 w-16"
                    >
                      <RotateCcw className="h-6 w-6" />
                    </Button>
                  </div>
                )}

                {audioUrl && (
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => router.push('/')}>
              ホームに戻る
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
