export const SESSION_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  'ヒーリングヨガ＆ストレッチ（動画）': { en: 'Healing Yoga & Stretch (Video)', ja: 'ヒーリングヨガ＆ストレッチ（動画）' },
  '朝の目覚めヨガ': { en: 'Morning Wake-up Yoga', ja: '朝の目覚めヨガ' },
  '朝のエナジーブースト筋トレ': { en: 'Morning Energy Boost Workout', ja: '朝のエナジーブースト筋トレ' },
  '朝の全身ストレッチ': { en: 'Morning Full Body Stretch', ja: '朝の全身ストレッチ' },
  'スクワットで下半身強化': { en: 'Lower Body Squat Workout', ja: 'スクワットで下半身強化' },
  '腹筋3分チャレンジ': { en: '3-Minute Abs Challenge', ja: '腹筋3分チャレンジ' },
  'ヒップアップワークアウト': { en: 'Hip Up Workout', ja: 'ヒップアップワークアウト' },
  'サーキットトレーニング': { en: 'Circuit Training', ja: 'サーキットトレーニング' },
  '肩こり改善ヨガ': { en: 'Shoulder Relief Yoga', ja: '肩こり改善ヨガ' },
  '夜の安眠ヨガ': { en: 'Bedtime Yoga', ja: '夜の安眠ヨガ' },
  '太陽礼拝ショートフロー': { en: 'Sun Salutation Short Flow', ja: '太陽礼拝ショートフロー' },
  '体幹を鍛えるヨガ': { en: 'Core Strengthening Yoga', ja: '体幹を鍛えるヨガ' },
  '首・肩こり解消ストレッチ': { en: 'Neck & Shoulder Stretch', ja: '首・肩こり解消ストレッチ' },
  '夜のリラックスストレッチ': { en: 'Evening Relaxation Stretch', ja: '夜のリラックスストレッチ' },
  '背骨を伸ばすストレッチ': { en: 'Spine Stretching', ja: '背骨を伸ばすストレッチ' },
  '股関節を柔らかくするストレッチ': { en: 'Hip Flexibility Stretch', ja: '股関節を柔らかくするストレッチ' },
};

export const SEGMENT_TRANSLATIONS: Record<string, { en: string; ja: string }> = {
  '深く息を吸います': { en: 'Take a deep breath in', ja: '深く息を吸います' },
  'ゆっくり吐きます': { en: 'Slowly breathe out', ja: 'ゆっくり吐きます' },
  '両手を上に伸ばします': { en: 'Raise both arms up', ja: '両手を上に伸ばします' },
  '前屈します': { en: 'Forward bend', ja: '前屈します' },
  '元の姿勢に戻ります': { en: 'Return to starting position', ja: '元の姿勢に戻ります' },
  'スクワットの姿勢を取ります': { en: 'Get into squat position', ja: 'スクワットの姿勢を取ります' },
  'スクワット10回': { en: '10 squats', ja: 'スクワット10回' },
  '腕立て伏せの姿勢': { en: 'Push-up position', ja: '腕立て伏せの姿勢' },
  '腕立て伏せ10回': { en: '10 push-ups', ja: '腕立て伏せ10回' },
  '首をゆっくり右に傾けます': { en: 'Slowly tilt neck to the right', ja: '首をゆっくり右に傾けます' },
  '首をゆっくり左に傾けます': { en: 'Slowly tilt neck to the left', ja: '首をゆっくり左に傾けます' },
  '肩を大きく回します': { en: 'Roll shoulders in large circles', ja: '肩を大きく回します' },
  '両手を組んで前に伸ばします': { en: 'Clasp hands and stretch forward', ja: '両手を組んで前に伸ばします' },
  '休憩中...': { en: 'Rest...', ja: '休憩中...' },
};

export function translateSessionTitle(title: string, language: 'ja' | 'en'): string {
  const translation = SESSION_TRANSLATIONS[title];
  if (translation) {
    return translation[language];
  }
  return title;
}

export function translateSegmentAction(action: string, language: 'ja' | 'en'): string {
  const translation = SEGMENT_TRANSLATIONS[action];
  if (translation) {
    return translation[language];
  }
  return action;
}
