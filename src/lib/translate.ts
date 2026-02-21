import { getSelectedLanguage } from '@/lib/i18n/language-pack';

export async function translateText(text: string, targetLang?: string): Promise<string> {
  try {
    const userLang = targetLang || getSelectedLanguage();
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${userLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    
    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}
