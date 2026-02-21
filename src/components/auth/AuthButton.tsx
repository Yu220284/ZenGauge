'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'
import { getCurrentUser, signOut } from '@/lib/supabase/auth'
import { useToast } from '@/hooks/use-toast'

export function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      setUser(null)
      toast({
        title: 'ログアウト完了',
        description: 'またお会いしましょう！'
      })
      router.push('/')
    }
  }

  if (loading) return null

  if (user) {
    return (
      <Button variant="ghost" onClick={handleSignOut} className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        ログアウト
      </Button>
    )
  }

  return (
    <Button variant="ghost" onClick={() => router.push('/auth/login')} className="flex items-center gap-2">
      <User className="h-4 w-4" />
      ログイン
    </Button>
  )
}