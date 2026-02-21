import { supabase } from '../supabase'

export async function signUp(email: string, password: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      }
    }
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Login error:', error.message)
      return { data: null, error }
    }
    
    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: { message: 'Unexpected error occurred' } }
  }
}

export async function signInWithGoogle() {
  try {
    // 常に本番URLを使用
    const redirectUrl = 'https://well-v.vercel.app/auth/callback'
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (error) {
      console.error('Google sign-in error:', error)
    }
    
    return { data, error }
  } catch (err) {
    console.error('Unexpected Google sign-in error:', err)
    return { data: null, error: { message: 'Failed to initiate Google sign-in' } }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}