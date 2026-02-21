
import type { Category, Session, Trainer } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'workout',
    name: 'ワークアウト',
    description: '体を動かして筋力やスタミナをつけよう',
    imageUrl: '/images/training.png',
    imageHint: 'running illustration',
  },
  {
    id: 'yoga',
    name: 'ヨガ',
    description: '呼吸を意識して、基礎代謝を高めよう',
    imageUrl: '/images/yoga.png',
    imageHint: 'yoga pose illustration',
  },
  {
    id: 'stretch',
    name: 'ストレッチ',
    description: '柔軟性を高め、リラックスしよう',
    imageUrl: '/images/stretch.png',
    imageHint: 'stretching illustration',
  },
];

export const SESSIONS: Session[] = [
  { 
    id: 'v-01', 
    title: 'ヒーリングヨガ＆ストレッチ（動画）', 
    category: 'yoga', 
    duration: 300, 
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hasVideo: true,
    isPremium: true,
    imageUrl: 'https://picsum.photos/seed/v01-premium/600/400', 
    imageHint: 'premium yoga video session', 
    tags: ['動画', 'プレミアム'], 
    trainerId: 1 
  },
  { 
    id: 'y-01', 
    title: '朝の目覚めヨガ', 
    category: 'yoga', 
    duration: 300, 
    videoUrl: '/videos/Demo_Kiri.mp4',
    hasVideo: true,
    isPremium: true,
    segments: [
      { id: 'y01-1', action: '深く息を吸います', duration: 4, pauseAfter: 1 },
      { id: 'y01-2', action: 'ゆっくり吐きます', duration: 6, pauseAfter: 2 },
      { id: 'y01-3', action: '両手を上に伸ばします', duration: 3, pauseAfter: 5 },
      { id: 'y01-4', action: '前屈します', duration: 5, pauseAfter: 10 },
      { id: 'y01-5', action: '元の姿勢に戻ります', duration: 3, pauseAfter: 2 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/y01-yoga/600/400', 
    imageHint: 'morning yoga', 
    tags: ['朝', '目覚め', '動画'], 
    trainerId: 1 
  },
  { 
    id: 'w-01', 
    title: '朝のエナジーブースト筋トレ', 
    category: 'workout', 
    duration: 300, 
    videoUrl: '/videos/Demo_Nana.mp4',
    hasVideo: true,
    isPremium: true,
    segments: [
      { id: 'w01-1', action: 'スクワットの姿勢を取ります', duration: 2, pauseAfter: 1 },
      { id: 'w01-2', action: 'スクワット10回', duration: 20, pauseAfter: 10 },
      { id: 'w01-3', action: '腕立て伏せの姿勢', duration: 3, pauseAfter: 1 },
      { id: 'w01-4', action: '腕立て伏せ10回', duration: 15, pauseAfter: 10 },
    ],
    audioUrl: '/audio/w01-workout-trainer1.mp3', 
    imageUrl: 'https://picsum.photos/seed/w01-workout/600/400', 
    imageHint: 'morning energy workout', 
    tags: ['朝', '筋トレ', '動画'], 
    trainerId: 2 
  },
  { 
    id: 's-01', 
    title: '朝の全身ストレッチ', 
    category: 'stretch', 
    duration: 480, 
    segments: [
      { id: 's01-1', action: '首をゆっくり右に傾けます', duration: 5, pauseAfter: 3 },
      { id: 's01-2', action: '首をゆっくり左に傾けます', duration: 5, pauseAfter: 3 },
      { id: 's01-3', action: '肩を大きく回します', duration: 10, pauseAfter: 5 },
      { id: 's01-4', action: '両手を組んで前に伸ばします', duration: 8, pauseAfter: 5 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/s01-stretch/600/400', 
    imageHint: 'morning full body stretch', 
    trainerId: 3 
  },
  { 
    id: 'w-02', 
    title: 'スクワットで下半身強化', 
    category: 'workout', 
    duration: 480, 
    segments: [
      { id: 'w02-1', action: '足を肩幅に開いて立ちます', duration: 3, pauseAfter: 2 },
      { id: 'w02-2', action: 'スクワット15回', duration: 30, pauseAfter: 15 },
      { id: 'w02-3', action: 'ワイドスクワット15回', duration: 30, pauseAfter: 15 },
      { id: 'w02-4', action: 'ジャンプスクワット10回', duration: 25, pauseAfter: 20 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/w02-workout/600/400', 
    imageHint: 'squat exercise', 
    tags: ['下半身'], 
    trainerId: 4 
  },
  { 
    id: 'w-03', 
    title: '腹筋3分チャレンジ', 
    category: 'workout', 
    duration: 180, 
    segments: [
      { id: 'w03-1', action: '仰向けに寝ます', duration: 2, pauseAfter: 1 },
      { id: 'w03-2', action: 'クランチ20回', duration: 30, pauseAfter: 10 },
      { id: 'w03-3', action: 'レッグレイズ15回', duration: 25, pauseAfter: 10 },
      { id: 'w03-4', action: 'プランク30秒キープ', duration: 30, pauseAfter: 15 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/w03-workout/600/400', 
    imageHint: 'abs workout', 
    trainerId: 5 
  },
  { 
    id: 'w-04', 
    title: 'ヒップアップワークアウト', 
    category: 'workout', 
    duration: 600, 
    segments: [
      { id: 'w04-1', action: '四つん這いの姿勢を取ります', duration: 3, pauseAfter: 2 },
      { id: 'w04-2', action: 'ドンキーキック右足15回', duration: 25, pauseAfter: 10 },
      { id: 'w04-3', action: 'ドンキーキック左足15回', duration: 25, pauseAfter: 10 },
      { id: 'w04-4', action: 'ヒップリフト20回', duration: 35, pauseAfter: 15 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/w04-workout/600/400', 
    imageHint: 'hip up workout', 
    trainerId: 6 
  },
  { 
    id: 'w-05', 
    title: 'サーキットトレーニング', 
    category: 'workout', 
    duration: 720, 
    segments: [
      { id: 'w05-1', action: 'ジャンピングジャック30秒', duration: 30, pauseAfter: 10 },
      { id: 'w05-2', action: 'バーピー10回', duration: 30, pauseAfter: 15 },
      { id: 'w05-3', action: 'マウンテンクライマー30秒', duration: 30, pauseAfter: 10 },
      { id: 'w05-4', action: 'プランク40秒キープ', duration: 40, pauseAfter: 20 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/w05-workout/600/400', 
    imageHint: 'circuit training', 
    trainerId: 7 
  },
  { 
    id: 'y-02', 
    title: '肩こり改善ヨガ', 
    category: 'yoga', 
    duration: 480, 
    segments: [
      { id: 'y02-1', action: '楽な姿勢で座ります', duration: 3, pauseAfter: 2 },
      { id: 'y02-2', action: '肩を大きく回します', duration: 15, pauseAfter: 5 },
      { id: 'y02-3', action: '猫のポーズ', duration: 20, pauseAfter: 10 },
      { id: 'y02-4', action: '牛のポーズ', duration: 20, pauseAfter: 10 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/y02-yoga/600/400', 
    imageHint: 'shoulder relief yoga', 
    tags: ['肩こり'], 
    trainerId: 8 
  },
  { 
    id: 'y-03', 
    title: '夜の安眠ヨガ', 
    category: 'yoga', 
    duration: 720, 
    segments: [
      { id: 'y03-1', action: '仰向けに寝て深呼吸', duration: 10, pauseAfter: 5 },
      { id: 'y03-2', action: '膝を抱えて揺らします', duration: 20, pauseAfter: 10 },
      { id: 'y03-3', action: 'ツイストポーズ右', duration: 30, pauseAfter: 5 },
      { id: 'y03-4', action: 'ツイストポーズ左', duration: 30, pauseAfter: 5 },
      { id: 'y03-5', action: 'シャバーサナでリラックス', duration: 60, pauseAfter: 0 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/y03-yoga/600/400', 
    imageHint: 'bedtime yoga', 
    trainerId: 9 
  },
  { 
    id: 'y-04', 
    title: '太陽礼拝ショートフロー', 
    category: 'yoga', 
    duration: 900, 
    segments: [
      { id: 'y04-1', action: '山のポーズで立ちます', duration: 5, pauseAfter: 3 },
      { id: 'y04-2', action: '両手を上に伸ばします', duration: 5, pauseAfter: 3 },
      { id: 'y04-3', action: '前屈します', duration: 8, pauseAfter: 5 },
      { id: 'y04-4', action: 'プランクポーズ', duration: 10, pauseAfter: 5 },
      { id: 'y04-5', action: '下向きの犬のポーズ', duration: 15, pauseAfter: 10 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/y04-yoga/600/400', 
    imageHint: 'sun salutation flow', 
    trainerId: 10 
  },
  { 
    id: 'y-05', 
    title: '体幹を鍛えるヨガ', 
    category: 'yoga', 
    duration: 1080, 
    segments: [
      { id: 'y05-1', action: 'プランクポーズ30秒', duration: 30, pauseAfter: 10 },
      { id: 'y05-2', action: 'サイドプランク右30秒', duration: 30, pauseAfter: 10 },
      { id: 'y05-3', action: 'サイドプランク左30秒', duration: 30, pauseAfter: 10 },
      { id: 'y05-4', action: 'ボートポーズ40秒', duration: 40, pauseAfter: 15 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/y05-yoga/600/400', 
    imageHint: 'core strengthening yoga', 
    trainerId: 11 
  },
  { 
    id: 's-02', 
    title: '首・肩こり解消ストレッチ', 
    category: 'stretch', 
    duration: 300, 
    segments: [
      { id: 's02-1', action: '首を右に傾けます', duration: 10, pauseAfter: 5 },
      { id: 's02-2', action: '首を左に傾けます', duration: 10, pauseAfter: 5 },
      { id: 's02-3', action: '肩を上げ下げします', duration: 15, pauseAfter: 5 },
      { id: 's02-4', action: '肩甲骨を寄せます', duration: 15, pauseAfter: 10 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/s02-stretch/600/400', 
    imageHint: 'neck shoulder stretch', 
    trainerId: 12 
  },
  { 
    id: 's-03', 
    title: '夜のリラックスストレッチ', 
    category: 'stretch', 
    duration: 600, 
    segments: [
      { id: 's03-1', action: '仰向けで深呼吸', duration: 15, pauseAfter: 5 },
      { id: 's03-2', action: '膝を胸に引き寄せます', duration: 20, pauseAfter: 10 },
      { id: 's03-3', action: '開脚ストレッチ', duration: 30, pauseAfter: 10 },
      { id: 's03-4', action: '全身の力を抜きます', duration: 40, pauseAfter: 0 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/s03-stretch/600/400', 
    imageHint: 'evening relaxation stretch', 
    trainerId: 13 
  },
  { 
    id: 's-04', 
    title: '背骨を伸ばすストレッチ', 
    category: 'stretch', 
    duration: 720, 
    segments: [
      { id: 's04-1', action: '四つん這いになります', duration: 3, pauseAfter: 2 },
      { id: 's04-2', action: '背中を丸めます', duration: 15, pauseAfter: 5 },
      { id: 's04-3', action: '背中を反らします', duration: 15, pauseAfter: 5 },
      { id: 's04-4', action: 'チャイルドポーズ', duration: 30, pauseAfter: 10 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/s04-stretch/600/400', 
    imageHint: 'spine stretching', 
    trainerId: 14 
  },
  { 
    id: 's-05', 
    title: '股関節を柔らかくするストレッチ', 
    category: 'stretch', 
    duration: 900, 
    segments: [
      { id: 's05-1', action: '座って足裏を合わせます', duration: 5, pauseAfter: 3 },
      { id: 's05-2', action: '前に倒します', duration: 30, pauseAfter: 10 },
      { id: 's05-3', action: '開脚して右に倒します', duration: 25, pauseAfter: 10 },
      { id: 's05-4', action: '開脚して左に倒します', duration: 25, pauseAfter: 10 },
    ],
    audioUrl: '', 
    imageUrl: 'https://picsum.photos/seed/s05-stretch/600/400', 
    imageHint: 'hip flexibility stretch', 
    trainerId: 15 
  },
];

export const TRAINERS: Trainer[] = [
    { id: 1, name: 'Akarin', imageUrl: '/images/trainer_1.png', imageHint: 'female trainer portrait', communityId: 'akarin-group', specialty: 'ヨガ', bio: '朝ヨガで心と体をリフレッシュ！', followers: 12500, tags: ['ヨガ', '朝活'] },
    { id: 2, name: 'Ryusei', imageUrl: '/images/trainer_2.png', imageHint: 'male trainer portrait', communityId: 'ryusei-group', specialty: 'ワークアウト', bio: '筋トレで理想のボディを手に入れよう！', followers: 8900, tags: ['筋トレ', 'ワークアウト'] },
    { id: 3, name: 'Yumeno', imageUrl: '/images/trainer_3.png', imageHint: 'female trainer smiling', communityId: 'yumeno-group', specialty: 'ストレッチ', bio: 'ストレッチで柔軟な体を作ろう！', followers: 15200, tags: ['ストレッチ', 'リラックス'] },
    { id: 4, name: 'Sorachi', imageUrl: '/images/trainer_4.png', imageHint: 'female trainer portrait', communityId: 'sorachi-group', specialty: 'ワークアウト', bio: '下半身強化で基礎代謝アップ！', followers: 9800, tags: ['下半身', '筋トレ'] },
    { id: 5, name: 'Haruto', imageUrl: '/images/trainer_5.png', imageHint: 'male trainer portrait', communityId: 'haruto-group', specialty: 'ワークアウト', bio: '短時間で効果的な腹筋トレーニング！', followers: 11200, tags: ['腹筋', '時短'] },
    { id: 6, name: 'Minato', imageUrl: '/images/trainer_6.png', imageHint: 'male trainer portrait', communityId: 'minato-group', specialty: 'ワークアウト', bio: 'ヒップアップで美しいボディライン！', followers: 13400, tags: ['ヒップ', '美ボディ'] },
    { id: 7, name: 'Hinata', imageUrl: '/images/trainer_7.png', imageHint: 'female trainer portrait', communityId: 'hinata-group', specialty: 'ワークアウト', bio: 'サーキットトレーニングで全身を鍛える！', followers: 10500, tags: ['全身', 'サーキット'] },
    { id: 8, name: 'Runa', imageUrl: '/images/trainer_8.png', imageHint: 'female trainer portrait', communityId: 'runa-group', specialty: 'ヨガ', bio: '肩こり解消ヨガでスッキリ！', followers: 14800, tags: ['肩こり', 'ヨガ'] },
    { id: 9, name: 'Kohaku', imageUrl: '/images/trainer_9.png', imageHint: 'female trainer portrait', communityId: 'kohaku-group', specialty: 'ヨガ', bio: '夜ヨガで質の良い睡眠を！', followers: 16700, tags: ['夜', '安眠'] },
    { id: 10, name: 'Ren', imageUrl: '/images/trainer_10.png', imageHint: 'male trainer portrait', communityId: 'ren-group', specialty: 'ヨガ', bio: '太陽礼拝で一日をスタート！', followers: 12900, tags: ['太陽礼拝', '朝'] },
    { id: 11, name: 'Aoi', imageUrl: '/images/trainer_11.png', imageHint: 'female trainer portrait', communityId: 'aoi-group', specialty: 'ヨガ', bio: '体幹強化で安定した体を！', followers: 11600, tags: ['体幹', 'ヨガ'] },
    { id: 12, name: 'Tsubasa', imageUrl: '/images/trainer_12.png', imageHint: 'female trainer portrait', communityId: 'tsubasa-group', specialty: 'ストレッチ', bio: '朝ストレッチで一日を元気に！', followers: 13100, tags: ['朝', 'ストレッチ'] },
    { id: 13, name: 'Kanade', imageUrl: '/images/trainer_13.png', imageHint: 'female trainer portrait', communityId: 'kanade-group', specialty: 'ストレッチ', bio: '首・肩の疲れをリセット！', followers: 15900, tags: ['首', '肩こり'] },
    { id: 14, name: 'Shion', imageUrl: '/images/trainer_1.png', imageHint: 'female trainer portrait', communityId: 'shion-group', specialty: 'ストレッチ', bio: '背骨ストレッチで姿勢改善！', followers: 10200, tags: ['背骨', '姿勢'] },
    { id: 15, name: 'Itsuki', imageUrl: '/images/trainer_2.png', imageHint: 'male trainer portrait', communityId: 'itsuki-group', specialty: 'ストレッチ', bio: '股関節の柔軟性を高めよう！', followers: 9500, tags: ['股関節', '柔軟性'] },
];

// NOTE: The audio files are placeholders. In a real app, these would point to files in Firebase Storage.
// For this project, we assume these files exist in the public/audio directory.
// You would need to add these mp3 files yourself.

