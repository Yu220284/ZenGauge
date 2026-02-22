'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, Volume2, VolumeX, X, Rewind, FastForward, Maximize, Minimize, Share2 } from 'lucide-react'
import Image from 'next/image'

const videos = [
  { 
    id: 1, 
    title: 'Morning Meditation Video', 
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    imageUrl: 'https://picsum.photos/seed/video1/800/450',
    audioUrl: ''
  }
]

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function VideoPage() {
  const params = useParams()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1.0)
  const [video, setVideo] = useState<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  useEffect(() => {
    const videoId = Number(params.id)
    const storedVideo = localStorage.getItem(`video_${videoId}`)
    
    if (storedVideo) {
      const parsedVideo = JSON.parse(storedVideo)
      if (!parsedVideo.videoUrl || parsedVideo.videoUrl === '') {
        parsedVideo.videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
      setVideo(parsedVideo)
    } else {
      const defaultVideo = videos.find(v => v.id === videoId)
      if (defaultVideo) setVideo(defaultVideo)
    }
  }, [params.id])

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay prevented:', e))
      if (audioRef.current) audioRef.current.play().catch(e => console.log('Audio autoplay prevented:', e))
      if (isMobile && screen.orientation) {
        screen.orientation.lock('landscape').catch(() => {})
      }
    }
    return () => {
      if (isMobile && screen.orientation) {
        screen.orientation.unlock()
      }
    }
  }, [video, isMobile])

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      audioRef.current?.pause()
    } else {
      videoRef.current.play()
      audioRef.current?.play()
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    if (audioRef.current) audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const seek = (delta: number) => {
    if (!videoRef.current) return
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta))
    videoRef.current.currentTime = newTime
    if (audioRef.current) audioRef.current.currentTime = newTime
  }

  const handleSliderChange = (value: number[]) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = value[0]
    if (audioRef.current) audioRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return
    const vol = value[0]
    setVolume(vol)
    videoRef.current.volume = vol
    if (audioRef.current) audioRef.current.volume = vol
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/video/${video.id}`
    const shareData = {
      title: video.title,
      text: `Check out this exercise video: ${video.title}`,
      url: shareUrl
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setShowShareToast(true)
      setTimeout(() => setShowShareToast(false), 3000)
    }
  }

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const updateTime = () => setCurrentTime(videoEl.currentTime)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onLoadedMetadata = () => {
      setDuration(videoEl.duration)
      setIsPlaying(!videoEl.paused)
    }

    videoEl.addEventListener('timeupdate', updateTime)
    videoEl.addEventListener('play', onPlay)
    videoEl.addEventListener('pause', onPause)
    videoEl.addEventListener('loadedmetadata', onLoadedMetadata)

    if (videoEl.readyState >= 1) {
      setDuration(videoEl.duration)
      setIsPlaying(!videoEl.paused)
    }

    return () => {
      videoEl.removeEventListener('timeupdate', updateTime)
      videoEl.removeEventListener('play', onPlay)
      videoEl.removeEventListener('pause', onPause)
      videoEl.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [video])

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Video not found</p>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-black">
      {video.audioUrl && (
        <audio ref={audioRef} src={video.audioUrl} preload="auto" />
      )}
      
      {isFullscreen ? (
        <div className="relative h-full w-full">
          <video
            ref={videoRef}
            key={video.videoUrl}
            className="w-full h-full object-contain"
            preload="auto"
            playsInline
            muted={video.audioUrl ? true : isMuted}
            onClick={togglePlay}
          >
            <source src={video.videoUrl} type="video/mp4" />
          </video>
          <Button
            variant="ghost"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 h-12 w-12 bg-black/50 hover:bg-black/70"
          >
            <Minimize className="h-6 w-6 text-white" />
          </Button>
        </div>
      ) : (
        <>
          <div className="relative h-full w-full">
            {video.imageUrl ? (
              <Image
                src={video.imageUrl}
                alt={video.title}
                fill
                className="object-cover scale-110 blur-xl"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-blue-100" />
            )}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-white/20 shadow-2xl">
              <div className="p-6 space-y-4">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                  {video.videoUrl && video.videoUrl !== '' ? (
                    <video
                      ref={videoRef}
                      key={video.videoUrl}
                      className="w-full h-full object-cover"
                      preload="auto"
                      playsInline
                      muted={video.audioUrl ? true : isMuted}
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <p>No video URL available. Generating video...</p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h1 className="text-2xl font-bold">{video.title}</h1>
                  {video.pose && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {video.pose} - {video.difficulty}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    onValueChange={handleSliderChange}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>-{formatTime(duration - currentTime)}</span>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => seek(-10)}
                    className="h-16 w-16"
                  >
                    <Rewind className="h-7 w-7" />
                  </Button>
                  <Button
                    variant="default"
                    onClick={togglePlay}
                    className="h-20 w-20 rounded-full shadow-lg"
                  >
                    {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => seek(10)}
                    className="h-16 w-16"
                  >
                    <FastForward className="h-7 w-7" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={toggleMute}
                    className="h-12 w-12"
                  >
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer flex-1"
                  />
                  <Button
                    variant="ghost"
                    onClick={handleShare}
                    className="h-12 w-12"
                    title="Share video"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="h-12 w-12"
                  >
                    <Maximize className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/')}
                    className="h-12 w-12"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {showShareToast && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg">
              Link copied to clipboard!
            </div>
          )}
        </>
      )}
    </div>
  )
}
