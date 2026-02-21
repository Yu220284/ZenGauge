import { createClient } from '@/lib/supabase/client';
import { TEST_USERS } from './test-users';

export async function createTestUsers() {
  const supabase = createClient();
  const results = [];

  // 一般ユーザーを作成
  for (const user of TEST_USERS.users) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: user.profile,
          emailRedirectTo: undefined
        }
      });
      
      // 開発環境では手動でメール確認済みにする
      if (data.user && !error) {
        await supabase.auth.admin.updateUserById(data.user.id, {
          email_confirm: true
        });
      }
      
      if (error) {
        console.error(`Failed to create user ${user.email}:`, error);
        results.push({ email: user.email, success: false, error: error.message });
      } else {
        console.log(`Created user: ${user.email}`);
        results.push({ email: user.email, success: true, userId: data.user?.id });
      }
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
      results.push({ email: user.email, success: false, error: String(error) });
    }
  }

  // トレーナーユーザーを作成
  for (const trainer of TEST_USERS.trainers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trainer.email,
        password: trainer.password,
        options: {
          data: trainer.profile,
          emailRedirectTo: undefined
        }
      });
      
      // 開発環境では手動でメール確認済みにする
      if (data.user && !error) {
        await supabase.auth.admin.updateUserById(data.user.id, {
          email_confirm: true
        });
      }
      
      if (error) {
        console.error(`Failed to create trainer ${trainer.email}:`, error);
        results.push({ email: trainer.email, success: false, error: error.message });
      } else {
        console.log(`Created trainer: ${trainer.email}`);
        results.push({ email: trainer.email, success: true, userId: data.user?.id });
      }
    } catch (error) {
      console.error(`Error creating trainer ${trainer.email}:`, error);
      results.push({ email: trainer.email, success: false, error: String(error) });
    }
  }

  return results;
}