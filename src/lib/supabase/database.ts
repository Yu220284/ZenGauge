import { supabase } from '../supabase'

// セッション取得
export async function getSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// ユーザー情報取得
export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

// トレーナーコミュニティ取得
export async function getTrainerCommunities() {
  const { data, error } = await supabase
    .from('trainer_communities')
    .select(`
      *,
      users!trainer_id (
        display_name,
        avatar_url
      )
    `)
    .order('member_count', { ascending: false })
  
  return { data, error }
}

// お気に入り機能
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('session_id')
    .eq('user_id', userId)
  
  if (error) {
    return { data: [], error }
  }
  
  return { data: data?.map(f => f.session_id) || [], error: null }
}

export async function addFavorite(userId: string, sessionId: string) {
  const { error } = await supabase
    .from('user_favorites')
    .insert({ user_id: userId, session_id: sessionId })
  
  return { error }
}

export async function removeFavorite(userId: string, sessionId: string) {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('session_id', sessionId)
  
  return { error }
}

export async function toggleUserFavorite(userId: string, sessionId: string) {
  // 既存のお気に入りをチェック
  const { data: existing } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .single()
  
  if (existing) {
    // 削除
    return await removeFavorite(userId, sessionId)
  } else {
    // 追加
    return await addFavorite(userId, sessionId)
  }
}

// ユーザープロフィール取得（UUIDで）
export async function getUserProfile(authUserId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', authUserId)
    .single()
  
  return { data, error }
}

// セッション追加
export async function addSession(sessionData: any) {
  const { data, error } = await supabase
    .from('sessions')
    .insert(sessionData)
    .select()
    .single()
  
  return { data, error }
}