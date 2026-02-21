'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Mail, Calendar, Award } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [joinDate, setJoinDate] = useState('')
  const [totalSessions, setTotalSessions] = useState(0)

  useEffect(() => {
    const profile = localStorage.getItem('profile')
    if (profile) {
      const data = JSON.parse(profile)
      setName(data.name || '')
      setEmail(data.email || '')
      setJoinDate(data.joinDate || new Date().toLocaleDateString())
    } else {
      setJoinDate(new Date().toLocaleDateString())
    }

    let sessions = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('video_')) sessions++
    }
    setTotalSessions(sessions)
  }, [])

  const handleSave = () => {
    localStorage.setItem('profile', JSON.stringify({ name, email, joinDate }))
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarFallback className="text-2xl">{name ? name[0].toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-light mb-2">Profile</h1>
          </div>

          <Card className="mb-4">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input value={joinDate} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Total Videos Created</Label>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <Input value={totalSessions} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">Save</Button>
            <Button onClick={() => router.push('/')} variant="outline" className="flex-1">Cancel</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
