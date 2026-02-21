export interface MinimaxTTSRequest {
  text: string;
  voice_id?: string;
  speed?: number;
  vol?: number;
  pitch?: number;
}

export interface MinimaxTTSResponse {
  audio_file: string;
  base_resp: {
    status_code: number;
    status_msg: string;
  };
}

export async function generateSpeech(text: string, voiceId: string = 'male-qn-qingse'): Promise<Blob> {
  const apiKey = process.env.NEXT_PUBLIC_MINIMAX_API_KEY;
  const groupId = process.env.NEXT_PUBLIC_MINIMAX_GROUP_ID;

  if (!apiKey || !groupId) {
    throw new Error('MINIMAX API credentials not configured');
  }

  const response = await fetch(`https://api.minimax.chat/v1/text_to_speech?GroupId=${groupId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      voice_id: voiceId,
      speed: 1.0,
      vol: 1.0,
      pitch: 0,
      model: 'speech-01',
      audio_sample_rate: 24000,
      bitrate: 128000,
    }),
  });

  if (!response.ok) {
    throw new Error(`MINIMAX API error: ${response.statusText}`);
  }

  return response.blob();
}

export async function generateMeditationAudio(script: string): Promise<Blob> {
  return generateSpeech(script, 'male-qn-qingse');
}
