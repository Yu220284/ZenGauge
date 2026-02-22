'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MyVideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<any[]>([])
  const [thumbnails, setThumbnails] = useState<{[key: number]: string}>({})

  useEffect(() => {
    initializeCreatedVideos()
    loadVideos()
  }, [])

  useEffect(() => {
    videos.forEach(video => {
      if (video.videoUrl && !video.imageUrl && !thumbnails[video.id]) {
        generateThumbnail(video.videoUrl, video.id)
      }
    })
  }, [videos])

  const generateThumbnail = (videoUrl: string, videoId: number) => {
    const video = document.createElement('video')
    video.src = videoUrl
    video.crossOrigin = 'anonymous'
    video.currentTime = 1
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')?.drawImage(video, 0, 0)
      const thumbnail = canvas.toDataURL('image/jpeg')
      setThumbnails(prev => ({ ...prev, [videoId]: thumbnail }))
    }
  }

  const initializeCreatedVideos = () => {
    const videoId = 1740113760000
    const key = `video_${videoId}`
    if (!localStorage.getItem(key)) {
      const video = {
        id: videoId,
        title: 'Created Zen Video',
        videoUrl: '/videos/created_zen_1740113760000.mp4',
        pose: 'Custom',
        difficulty: 'All Levels',
        createdAt: videoId
      }
      localStorage.setItem(key, JSON.stringify(video))
    }
  }

  const loadVideos = () => {
    const allVideos = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('video_')) {
        const video = JSON.parse(localStorage.getItem(key)!)
        console.log('Loaded video:', video)
        allVideos.push(video)
      }
    }
    console.log('Total videos:', allVideos.length)
    allVideos.sort((a, b) => b.id - a.id)
    setVideos(allVideos)
  }

  const handleDelete = (videoId: number) => {
    if (confirm('Are you sure you want to delete this video?')) {
      localStorage.removeItem(`video_${videoId}`)
      loadVideos()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-2">My Created Videos</h1>
            <p className="text-sm text-muted-foreground">{videos.length} videos created</p>
          </div>

          {videos.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No videos created yet</p>
                <Button onClick={() => router.push('/create-video')}>Create Your First Video</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <Card key={video.id} className="hover:bg-primary/5 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/video/${video.id}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="relative w-32 h-20 rounded overflow-hidden flex-shrink-0">
                            {video.imageUrl || thumbnails[video.id] ? (
                              <img src={video.imageUrl || thumbnails[video.id]} alt={video.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                                <Play className="h-8 w-8 text-white drop-shadow-lg" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium mb-1 truncate">{video.title}</h3>
                            <p className="text-xs text-muted-foreground mb-1">
                              {new Date(video.id).toLocaleString()}
                            </p>
                            {video.pose && (
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>{video.pose}</span>
                                <span>•</span>
                                <span>{video.difficulty}</span>
                                {video.gender && (
                                  <>
                                    <span>•</span>
                                    <span>{video.gender}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(video.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
