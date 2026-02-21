'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function Home() {
  const [weeklyMinutes, setWeeklyMinutes] = useState(0)
  const [weeklyDays, setWeeklyDays] = useState(0)
  const [weeklyStreak, setWeeklyStreak] = useState(0)
  const [weeklyCalendar, setWeeklyCalendar] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [savedVideos, setSavedVideos] = useState<any[]>([])

  useEffect(() => {
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
      const hasSession = isPast || isToday ? Math.random() > 0.5 : false
      
      days.push({
        date: date.getDate(),
        day: dayNames[i],
        hasSession,
        isToday,
        isPast
      })
    }
    
    setWeeklyCalendar(days)
    const daysWithSessions = days.filter(day => day.hasSession).length
    setWeeklyDays(daysWithSessions)
    setWeeklyMinutes(daysWithSessions * 15)
    setWeeklyStreak(2)
    setMounted(true)

    // Load saved videos from localStorage
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

  const sessions = [
    { id: 1, title: 'Morning Meditation', duration: 10, description: 'Start your day' },
    { id: 2, title: 'Breathing Exercise', duration: 5, description: 'Calm your mind' },
    { id: 3, title: 'Evening Meditation', duration: 15, description: 'End your day' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Image src="/ZenGauge_icon.png" alt="ZenGauge" width={200} height={200} className="rounded-2xl" />
          </div>
          <Link href="/create-video">
            <Button size="lg" className="mb-4">Create Custom Video</Button>
          </Link>
          <p className="text-lg text-muted-foreground">Find your inner peace</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {/* 週間統計 */}
          <section>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-primary">{weeklyDays} days</div>
                  <div className="text-xs text-muted-foreground">This week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-primary">{weeklyStreak} weeks</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-primary">{weeklyMinutes} min</div>
                  <div className="text-xs text-muted-foreground">Total time</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ウィークリーカレンダー */}
          <section>
            <h2 className="text-base font-bold mb-2 pl-2">Weekly Activity</h2>
            <Card>
              <CardContent className="p-3">
                <div className="grid grid-cols-7 gap-2">
                  {mounted && weeklyCalendar.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                      <div className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2",
                        day.isToday && day.hasSession ? "bg-primary text-primary-foreground border-primary" :
                        day.isToday ? "bg-primary/20 text-primary border-primary" :
                        day.hasSession ? "bg-green-100 text-green-800 border-green-300" :
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
              </CardContent>
            </Card>
          </section>

          {/* セッション一覧 */}
          <section>
            <h2 className="text-base font-bold mb-2 pl-2">Sessions</h2>
            <div className="space-y-2">
              {sessions.map((session) => (
                <Link key={session.id} href={`/session/${session.id}`}>
                  <Card className="hover:bg-primary/5 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{session.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{session.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.duration} min
                        </div>
                      </div>
                      <Play className="h-6 w-6 text-primary" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Zen Videos */}
          <section>
            <h2 className="text-base font-bold mb-2 pl-2">Zen Videos</h2>
            <div className="space-y-2">
              <Link href="/video/1">
                <Card className="hover:bg-primary/5 transition-colors">
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-gradient-to-br from-cyan-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-white drop-shadow-lg" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">Morning Meditation Video</h3>
                      <p className="text-xs text-muted-foreground">10 min</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* My Created Videos */}
          {savedVideos.length > 0 && (
            <section>
              <h2 className="text-base font-bold mb-2 pl-2">My Created Videos</h2>
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

          {/* 近くのヨガ仲間 */}
          <section>
            <h2 className="text-base font-bold mb-2 pl-2">Nearby Yoga Partners</h2>
            <Link href="/nearby">
              <Card className="hover:bg-primary/5 transition-colors">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm mb-2">Find people who share your music taste</p>
                    <p className="text-sm mb-3">and enjoy yoga sessions together</p>
                    <Button size="sm">Find Partners</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
