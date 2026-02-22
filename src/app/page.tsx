'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Flame, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function Home() {
  const [savedVideos, setSavedVideos] = useState<any[]>([])

  const loadVideos = () => {
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
  }

  useEffect(() => {
    loadVideos()
  }, [])

  const deleteVideo = (videoId: number) => {
    localStorage.removeItem(`video_${videoId}`)
    loadVideos()
  }

  const generateWeeklyCalendar = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)

    const days = []
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const isToday = date.toDateString() === today.toDateString()
      const isPast = date < today && !isToday
      const hasSession = isPast || isToday ? Math.random() > 0.3 : false
      
      days.push({
        date: date.getDate(),
        day: dayNames[i],
        hasSession,
        isToday,
        isPast
      })
    }
    return days
  }

  const weeklyCalendar = generateWeeklyCalendar()
  const weeklyDays = weeklyCalendar.filter(day => day.hasSession).length
  const weeklyStreak = 3
  const weeklyMinutes = 145
  const isPerfectWeek = weeklyDays === 7

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/ZenGauge_icon.png" alt="ZenGauge" width={150} height={150} className="rounded-2xl" />
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
          <section>
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-primary">{weeklyDays} days</div>
                  <div className="text-xs text-muted-foreground">This Week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div className="text-xl font-bold text-primary">{weeklyStreak}</div>
                    {isPerfectWeek && <span className="text-sm">💎</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">Week Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-primary">{weeklyMinutes} min</div>
                  <div className="text-xs text-muted-foreground">Weekly Total</div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Weekly Activity</h2>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {weeklyCalendar.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground mb-1 font-medium">{day.day}</div>
                      <div className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all",
                        day.isToday && day.hasSession ? "bg-primary text-primary-foreground border-primary shadow-lg scale-110" :
                        day.isToday ? "bg-primary/20 text-primary border-primary" :
                        day.hasSession ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200" :
                        day.isPast ? "bg-muted text-muted-foreground border-muted" :
                        "bg-gray-50 text-gray-400 border-gray-200"
                      )}>
                        {day.date}
                        {day.hasSession && (
                          <div className="absolute w-2 h-2 bg-green-500 rounded-full -top-1 -right-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {isPerfectWeek && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <span>💎</span>
                      Perfect Week
                      <span>💎</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
          {savedVideos.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">My Created Videos</h2>
              <div className="space-y-2">
                {savedVideos.map((video) => (
                  <Card key={video.id} className="hover:bg-primary/5 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <Link href={`/video/${video.id}`} className="flex-1 flex items-center gap-3">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{video.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(video.id).toLocaleString()}
                          </p>
                        </div>
                        <Play className="h-6 w-6 text-primary" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault()
                          if (confirm('Delete this video?')) {
                            deleteVideo(video.id)
                          }
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
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
