'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [savedVideos, setSavedVideos] = useState<any[]>([])

  useEffect(() => {
    const videos = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('video_')) {
        const video = JSON.parse(localStorage.getItem(key)!)
        videos.push(video)
      }
    }
    videos.sort((a, b) => b.id - a.id)
    setSavedVideos(videos)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Image src="/ZenGauge_icon.png" alt="ZenGauge" width={200} height={200} className="rounded-2xl" />
          </div>
          <div className="flex gap-2 justify-center mb-4">
            <Link href="/zen-pose">
              <Button size="lg" variant="default">ZenGauge Pose</Button>
            </Link>
            <Link href="/create-video">
              <Button size="lg" variant="outline">Create Video</Button>
            </Link>
          </div>
          <p className="text-lg text-muted-foreground">Find your inner peace</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {savedVideos.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">My Created Videos</h2>
              <div className="space-y-2">
                {savedVideos.map((video) => (
                  <Link key={video.id} href={`/video/${video.id}`}>
                    <Card className="hover:bg-primary/5 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{video.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(video.id).toLocaleString()}
                          </p>
                        </div>
                        <Play className="h-6 w-6 text-primary" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
