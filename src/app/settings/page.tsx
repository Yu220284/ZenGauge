'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Moon, Volume2, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [defaultVolume, setDefaultVolume] = useState('medium')

  useEffect(() => {
    const settings = localStorage.getItem('settings')
    if (settings) {
      const data = JSON.parse(settings)
      setNotifications(data.notifications ?? true)
      setDarkMode(data.darkMode ?? false)
      setAutoplay(data.autoplay ?? true)
      setDefaultVolume(data.defaultVolume ?? 'medium')
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify({ notifications, darkMode, autoplay, defaultVolume }))
    router.push('/')
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear()
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-2">Settings</h1>
            <p className="text-sm text-muted-foreground">Customize your ZenGauge experience</p>
          </div>

          <Card className="mb-4">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive meditation reminders</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Use dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label>Autoplay Videos</Label>
                    <p className="text-xs text-muted-foreground">Start playing automatically</p>
                  </div>
                </div>
                <Switch checked={autoplay} onCheckedChange={setAutoplay} />
              </div>

              <div className="space-y-2">
                <Label>Default Volume</Label>
                <Select value={defaultVolume} onValueChange={setDefaultVolume}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  <div>
                    <Label className="text-destructive">Clear All Data</Label>
                    <p className="text-xs text-muted-foreground">Delete all videos and settings</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={handleClearData}>Clear</Button>
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
