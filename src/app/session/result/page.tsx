'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Twitter, MessageCircle, Copy, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SessionResultPage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sessionData, setSessionData] = useState({
    title: 'Meditation Session',
    duration: 600,
    completedAt: new Date()
  })

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('last_session')
    if (stored) {
      const data = JSON.parse(stored)
      setSessionData({
        title: data.title,
        duration: data.duration,
        completedAt: new Date(data.completedAt)
      })
      localStorage.removeItem('last_session')
    }
  }, [])

  const minutes = Math.floor(sessionData.duration / 60)
  const shareText = `I just completed a ${minutes}-minute ${sessionData.title} session on ZenGauge! 🧘♀️✨`

  const handleShare = async (platform: 'twitter' | 'line' | 'copy') => {
    const shareUrl = `${window.location.origin}/session/result`
    
    if (platform === 'twitter') {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
      window.open(url, '_blank')
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (error) {}
      }
    } else if (platform === 'line') {
      const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
      window.open(url, '_blank')
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (error) {}
      }
    } else if (platform === 'copy') {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (error) {
          console.error('Failed to copy:', error)
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/30 via-blue-50/20 to-sky-100/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card/80 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Session Complete!
            </h1>
            <p className="text-muted-foreground">Great work on your practice</p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">{sessionData.title}</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-bold text-lg">{minutes} minutes</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">{mounted ? sessionData.completedAt.toLocaleTimeString() : '--:--:--'}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-center text-sm font-medium text-muted-foreground mb-3">Share your achievement</p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => handleShare('twitter')}
                variant="ghost"
                className="h-12 w-12"
                title="Share on Twitter"
              >
                <Twitter className="h-6 w-6" />
              </Button>
              <Button 
                onClick={() => handleShare('line')}
                variant="ghost"
                className="h-12 w-12"
                title="Share on LINE"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              <Button 
                onClick={() => handleShare('copy')}
                variant="ghost"
                className="h-12 w-12"
                title="Copy to clipboard"
              >
                <Copy className={`h-6 w-6 ${copied ? 'text-green-600' : ''}`} />
              </Button>
            </div>
            {copied && (
              <p className="text-center text-xs text-green-600 mt-2">Copied to clipboard!</p>
            )}
          </div>

          <Button 
            onClick={() => router.push('/')}
            className="w-full"
            size="lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
