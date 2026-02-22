'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Music, Calendar, Clock } from 'lucide-react'
import { findNearbyUsers, autoScheduleSession } from '@/lib/matching'
import { User, NearbyUser, YogaSession } from '@/lib/types/matching'

const mockCurrentUser: User = {
  id: '1',
  name: 'You',
  avatar: '',
  location: { lat: 35.6762, lng: 139.6503 },
  musicTastes: ['Jazz', 'Classical', 'Ambient'],
  freeTime: [
    { day: 'Mon', startTime: '19:00', endTime: '21:00' },
    { day: 'Wed', startTime: '18:00', endTime: '20:00' },
    { day: 'Sat', startTime: '10:00', endTime: '12:00' }
  ]
}

const mockUsers: User[] = [
  {
    id: '2',
    name: 'Sarah',
    avatar: '',
    location: { lat: 35.6812, lng: 139.6553 },
    musicTastes: ['Jazz', 'Bossa Nova', 'Classical'],
    freeTime: [
      { day: 'Mon', startTime: '19:00', endTime: '21:00' },
      { day: 'Thu', startTime: '18:00', endTime: '20:00' }
    ]
  },
  {
    id: '3',
    name: 'Emma',
    avatar: '',
    location: { lat: 35.6712, lng: 139.6453 },
    musicTastes: ['Ambient', 'Classical', 'New Age'],
    freeTime: [
      { day: 'Wed', startTime: '18:00', endTime: '20:00' },
      { day: 'Sat', startTime: '10:00', endTime: '12:00' }
    ]
  }
]

export default function NearbyPage() {
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([])
  const [scheduledSessions, setScheduledSessions] = useState<YogaSession[]>([])

  useEffect(() => {
    const nearby = findNearbyUsers(mockCurrentUser, mockUsers)
    setNearbyUsers(nearby)
  }, [])

  const handleSchedule = (nearbyUser: NearbyUser) => {
    const session = autoScheduleSession(nearbyUser)
    if (session) {
      setScheduledSessions([...scheduledSessions, session])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-16">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-light mb-2">Nearby Yoga Partners</h1>
            <p className="text-sm text-muted-foreground">Find people who share your music taste</p>
          </div>

          {scheduledSessions.length > 0 && (
            <section>
              <h2 className="text-base font-bold mb-2 pl-2">Scheduled Sessions</h2>
              <div className="space-y-2">
                {scheduledSessions.map(session => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar>
                          <AvatarImage src={session.partnerAvatar} />
                          <AvatarFallback>{session.partnerName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">Session with {session.partnerName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {session.scheduledTime.toLocaleDateString('ja-JP')}
                            <Clock className="h-3 w-3" />
                            {session.scheduledTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {Math.round(session.musicMatch)}% Match
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-base font-bold mb-2 pl-2">Recommended Users</h2>
            <div className="space-y-2">
              {nearbyUsers.map(nearby => (
                <Card key={nearby.user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={nearby.user.avatar} />
                        <AvatarFallback>{nearby.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium mb-1">{nearby.user.name}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {nearby.distance.toFixed(1)}km
                          </div>
                          <div className="flex items-center gap-1">
                            <Music className="h-3 w-3" />
                            {Math.round(nearby.musicMatch)}% Match
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {nearby.user.musicTastes.map(taste => (
                            <span key={taste} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              {taste}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Common free time: {nearby.commonFreeTime.map(t => `${t.day} ${t.startTime}`).join(', ')}
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleSchedule(nearby)}
                          disabled={scheduledSessions.some(s => s.partnerId === nearby.user.id)}
                        >
                          Book Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
