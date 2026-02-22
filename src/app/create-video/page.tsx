'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function CreateVideoPage() {
  const router = useRouter()
  const [musicGenre, setMusicGenre] = useState('')
  const [pose, setPose] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [location, setLocation] = useState('')
  const [speed, setSpeed] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)

  const handleGenerate = async () => {
    if (!musicGenre || !pose || !difficulty || !gender || !age || !location || !speed) return

    setIsGenerating(true)
    setProgress(10)
    setStatus('Generating script...')
    
    try {
      setProgress(20)
      setStatus('Submitting video generation task...')
      
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ musicGenre, pose, difficulty, gender, age, location, speed, adminPassword })
      })

      const data = await response.json()
      
      if (!response.ok) {
        if (data.requiresPassword) {
          setShowPasswordPrompt(true)
          setStatus('')
        }
        throw new Error(data.error || 'Failed to generate video')
      }

      if (data.videoId && data.videoData) {
        setProgress(100)
        setStatus('Complete!')
        localStorage.setItem(`video_${data.videoId}`, JSON.stringify(data.videoData))
        // Automatically redirect to video page
        router.push(`/video/${data.videoId}`)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Failed to generate video:', error)
      setStatus('Failed to generate video: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-2">Create Custom Zen Video</h1>
            <p className="text-sm text-muted-foreground">Create your personalized meditation experience with ZenGauge</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Music Genre</Label>
                <Select value={musicGenre} onValueChange={setMusicGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="nature">Nature Sounds</SelectItem>
                    <SelectItem value="piano">Piano</SelectItem>
                    <SelectItem value="flute">Flute</SelectItem>
                    <SelectItem value="silence">Silence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Zen Pose</Label>
                <Select value={pose} onValueChange={setPose}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lotus">Lotus Position</SelectItem>
                    <SelectItem value="seiza">Seiza</SelectItem>
                    <SelectItem value="standing">Standing Zen</SelectItem>
                    <SelectItem value="walking">Walking Meditation</SelectItem>
                    <SelectItem value="lying">Lying Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age</Label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20s">20s</SelectItem>
                    <SelectItem value="30s">30s</SelectItem>
                    <SelectItem value="40s">40s</SelectItem>
                    <SelectItem value="50s">50s</SelectItem>
                    <SelectItem value="60s+">60s+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zen-garden">Zen Garden</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="mountain">Mountain</SelectItem>
                    <SelectItem value="temple">Temple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Speed</Label>
                <Select value={speed} onValueChange={setSpeed}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!musicGenre || !pose || !difficulty || !gender || !age || !location || !speed || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>

              {showPasswordPrompt && (
                <div className="space-y-2">
                  <Label>Admin Password</Label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}

              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">{status}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
