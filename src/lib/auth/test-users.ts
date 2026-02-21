// 検証用テストユーザー
export const TEST_USERS = {
  // 一般ユーザー
  users: [
    {
      email: 'wellvuser1@gmail.com',
      password: 'password123',
      profile: {
        name: 'ユーザー太郎',
        role: 'user',
        followedTrainers: [1, 2, 3],
        joinedAt: new Date('2024-01-15')
      }
    },
    {
      email: 'wellvuser2@gmail.com', 
      password: 'password123',
      profile: {
        name: 'ユーザー花子',
        role: 'user',
        followedTrainers: [1, 4, 5],
        joinedAt: new Date('2024-02-01')
      }
    },
    {
      email: 'wellvuser3@gmail.com',
      password: 'password123', 
      profile: {
        name: 'ユーザー次郎',
        role: 'user',
        followedTrainers: [2, 6, 7],
        joinedAt: new Date('2024-02-15')
      }
    }
  ],
  
  // トレーナーユーザー
  trainers: [
    {
      email: 'wellvakarin@gmail.com',
      password: 'trainer123',
      profile: {
        name: 'あかりん',
        role: 'trainer',
        trainerId: 1,
        specialty: 'ヨガ',
        bio: '朝ヨガで心と体をリフレッシュ！',
        joinedAt: new Date('2023-12-01')
      }
    },
    {
      email: 'wellvryusei@gmail.com',
      password: 'trainer123',
      profile: {
        name: 'りゅうせい', 
        role: 'trainer',
        trainerId: 2,
        specialty: 'ワークアウト',
        bio: '筋トレで理想のボディを手に入れよう！',
        joinedAt: new Date('2023-12-01')
      }
    },
    {
      email: 'wellvyumeno@gmail.com',
      password: 'trainer123',
      profile: {
        name: 'ゆめの',
        role: 'trainer', 
        trainerId: 3,
        specialty: 'ストレッチ',
        bio: 'ストレッチで柔軟な体を作ろう！',
        joinedAt: new Date('2023-12-01')
      }
    }
  ]
};

export type TestUser = {
  email: string;
  password: string;
  profile: {
    name: string;
    role: 'user' | 'trainer';
    trainerId?: number;
    specialty?: string;
    bio?: string;
    followedTrainers?: number[];
    joinedAt: Date;
  };
};