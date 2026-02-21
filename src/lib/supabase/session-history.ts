import { createClient } from './client';

export type SessionRecord = {
  id: string;
  user_id: string;
  session_id: string;
  completed_at: string;
  duration_seconds: number;
  created_at: string;
};

export async function saveSessionCompletion(sessionId: string, durationSeconds: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('session_history')
    .insert({
      user_id: user.id,
      session_id: sessionId,
      duration_seconds: durationSeconds,
      completed_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to save session completion:', error);
    return null;
  }
  return data;
}

export async function getUserSessionHistory() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('session_history')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data || [];
}