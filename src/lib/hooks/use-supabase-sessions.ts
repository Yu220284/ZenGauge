'use client'

import { useState, useEffect } from 'react'
import { getSessions } from '@/lib/supabase/database'
import type { Session } from '@/lib/types'

export function useSupabaseSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const { data, error } = await getSessions()
      if (error) throw error
      setSessions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return { sessions, loading, error, refetch: fetchSessions }
}