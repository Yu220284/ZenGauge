'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Dumbbell } from 'lucide-react'
import Link from 'next/link'

interface WorkoutLog {
  id: string
  title: string
  duration: number
  completedAt: string
}

export default function WorkoutLogPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([])

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = () => {
    const allLogs: WorkoutLog[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('workout_log_')) {
        const log = JSON.parse(localStorage.getItem(key)!)
        allLogs.push(log)
      }
    }
    allLogs.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    setLogs(allLogs)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTotalStats = () => {
    const total = logs.reduce((acc, log) => acc + log.duration, 0)
    return {
      totalSessions: logs.length,
      totalMinutes: Math.floor(total / 60)
    }
  }

  const stats = getTotalStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Workout Log</h1>
            <p className="text-muted-foreground">Track your meditation journey</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Dumbbell className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <div className="text-xs text-muted-foreground">Total Sessions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.totalMinutes}</div>
                <div className="text-xs text-muted-foreground">Total Minutes</div>
              </CardContent>
            </Card>
          </div>

          {logs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No workout logs yet</p>
                <Link href="/zen-pose">
                  <Button>Start Your First Session</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{log.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(log.completedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(log.duration)}
                          </div>
                        </div>
                      </div>
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
