
import { z } from 'zod';
import messages from '@/../messages/ja.json';

const t = messages.AddSessionPage;

export type SessionCategory = 'workout' | 'yoga' | 'stretch';

export interface SessionSegment {
  id: string;
  action: string;
  duration: number; // 動作の実行時間（秒）
  pauseAfter?: number; // 動作後の休憩時間（秒）
}

// Zod schema for a Session, used for validation
export const SessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.enum(['workout', 'yoga', 'stretch']),
  duration: z.number().positive(), // in seconds
  segments: z.array(z.object({
    id: z.string(),
    action: z.string(),
    duration: z.number(),
    pauseAfter: z.number().optional(),
  })).optional(),
  audioUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  hasVideo: z.boolean().optional(),
  imageUrl: z.string().url(),
  imageHint: z.string(),
  tags: z.array(z.string()).optional(),
  trainerId: z.number().optional(),
  isPremium: z.boolean().optional(),
});

// TypeScript type derived from the schema
export type Session = z.infer<typeof SessionSchema>;

export type MediaType = 'audio' | 'video';


export interface Category {
  id: SessionCategory;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface LoggedSession {
  sessionId: string;
  completedAt: string; // ISO string
}

export const CreateSessionInputSchema = z.object({
  title: z.string().min(2, { message: 'セッション名は2文字以上で入力してください。'}),
  category: z.enum(['workout', 'yoga', 'stretch'], { required_error: 'カテゴリーを選択してください。'}),
  audioDataUri: z
    .string()
    .describe(
      "A recording of the session audio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  thumbnailDataUri: z.string().optional().describe(
    "A thumbnail image for the session, as a data URI. Optional."
  ),
});
export type CreateSessionInput = z.infer<typeof CreateSessionInputSchema>;

export const CreateSessionOutputSchema = z.object({
  approved: z.boolean().describe('Whether the session was automatically approved.'),
  transcription: z.string().describe('The transcribed text from the audio.'),
  thumbnailUrl: z.string().url().describe('The URL of the thumbnail image to use.'),
});
export type CreateSessionOutput = z.infer<typeof CreateSessionOutputSchema>;

export interface SubmittedSession {
    id: string;
    title: string;
    category: SessionCategory;
    submittedAt: string; // ISO string
    status: 'pending' | 'processing' | 'completed' | 'failed';
    transcription?: string;
    approved?: boolean;
    thumbnailUrl?: string;
}

export const GenerateSafetyPromptInputSchema = z.object({
  sessionType: z.string().describe('The type of session (workout, yoga, stretch).'),
});
export type GenerateSafetyPromptInput = z.infer<typeof GenerateSafetyPromptInputSchema>;

export const GenerateSafetyPromptOutputSchema = z.object({
  safetyPrompt: z.array(z.string()).describe('A list of safety disclaimers.'),
});
export type GenerateSafetyPromptOutput = z.infer<typeof GenerateSafetyPromptOutputSchema>;

export interface Trainer {
  id: number;
  name: string;
  imageUrl: string;
  imageHint: string;
  communityId: string;
  specialty: string;
  bio: string;
  followers: number;
  tags: string[];
}

export interface ScriptSegment {
  id: string;
  text: string;
  duration: number; // seconds
  audioBlob?: Blob;
  audioUrl?: string;
  images?: string[]; // URLs to reference images
  videoUrl?: string; // URL to reference video
}

export interface RecordingScript {
  id: string;
  title: string;
  category: SessionCategory;
  segments: ScriptSegment[];
  totalDuration: number;
  tags?: string[];
  language?: string;
  isRecorded?: boolean;
}
