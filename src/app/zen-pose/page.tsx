'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const POSES = [
  { id: 'tree', name: 'Tree Pose', description: 'Balance on one leg', demoUrl: 'https://video-product.cdn.minimax.io/inference_output/video/2026-02-22/0dd5d9b9-92a7-4d55-a8e4-643ae84fc471/output.mp4' },
  { id: 'warrior', name: 'Warrior Pose', description: 'Strong standing pose', demoUrl: 'https://video-product.cdn.minimax.io/inference_output/video/2026-02-22/2cdb4a17-3a73-4c22-9918-4696269a8a58/output.mp4' },
  { id: 'downward-dog', name: 'Downward Dog', description: 'Inverted V-shape' },
  { id: 'child', name: 'Child Pose', description: 'Resting position' },
]

export default function ZenPosePage() {
  const [selectedPose, setSelectedPose] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [silhouetteUrl, setSilhouetteUrl] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')
  const [opacity, setOpacity] = useState(30)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (cameraActive && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      console.log('Requesting camera access...')
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          console.log('Camera access granted')
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play().catch(e => console.error('Video play error:', e))
          }
        })
        .catch(err => {
          console.error('Camera error:', err)
          alert('カメラへのアクセスが必要です。ブラウザの設定でカメラを許可してください。')
          setCameraActive(false)
        })
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => {
          console.log('Stopping camera track')
          track.stop()
        })
      }
    }
  }, [cameraActive])

  const generatePose = async (pose: any) => {
    // Check localStorage cache first
    const cacheKey = `pose_${pose.id}`
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null
    
    if (cached) {
      console.log('Using cached URL for:', pose.name)
      setSilhouetteUrl(cached)
      setCameraActive(true)
      return
    }

    // Use demo URL if available
    if (pose.demoUrl) {
      console.log('Using demo URL:', pose.demoUrl)
      localStorage.setItem(cacheKey, pose.demoUrl)
      setSilhouetteUrl(pose.demoUrl)
      setCameraActive(true)
      return
    }

    setLoading(true)
    setSelectedPose(pose.name)
    setLoadingMessage('AI動画を生成中... (1-3分かかります)')

    try {
      console.log('Requesting pose generation for:', pose.name)
      const response = await fetch('/api/generate-pose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pose: pose.name }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate pose')
      }

      setLoadingMessage('動画を読み込み中...')
      console.log('Setting silhouetteUrl:', data.videoUrl)
      localStorage.setItem(cacheKey, data.videoUrl)
      setSilhouetteUrl(data.videoUrl)
      console.log('Setting cameraActive to true')
      setCameraActive(true)
      console.log('State updated - should show camera view')
    } catch (error) {
      console.error('Failed to generate pose:', error)
      alert('ポーズの生成に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'))
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }

  if (cameraActive && silhouetteUrl) {
    console.log('Rendering camera view with:', { cameraActive, silhouetteUrl })
    return (
      <div className="fixed inset-0 bg-black">
        <div className="relative w-full h-full" style={{ border: '4px solid #87CEEB' }}>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-center z-10">
            <p className="text-2xl font-bold mb-2">Align your soul with the ZenGauge</p>
            <p className="text-sm opacity-80">Match your body to the silhouette</p>
          </div>

          <div className="flex h-full gap-4 p-4 pt-20">
            <div className="flex-1 relative rounded-lg overflow-hidden">
              <p className="absolute top-2 left-2 text-white text-sm font-bold z-10 bg-black/50 px-2 py-1 rounded">AI Silhouette</p>
              <video
                src={silhouetteUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain bg-white"
              />
            </div>
            
            <div className="flex-1 relative rounded-lg overflow-hidden">
              <p className="absolute top-2 left-2 text-white text-sm font-bold z-10 bg-black/50 px-2 py-1 rounded">Your Camera</p>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <Button
            onClick={() => {
              setCameraActive(false)
              setSilhouetteUrl(null)
              setSelectedPose(null)
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            variant="secondary"
          >
            Exit Zen Mode
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 pb-24">
      <div className="container mx-auto px-4 pt-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ZenGauge Pose Guide</h1>
          <p className="text-muted-foreground">Select a pose to begin your practice</p>
          {loading && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">{loadingMessage}</p>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
          {POSES.map((pose) => (
            <Card
              key={pose.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => !loading && generatePose(pose)}
            >
              <h3 className="font-bold text-lg mb-2">{pose.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{pose.description}</p>
              <Button className="w-full" size="sm" disabled={loading}>Start</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
