import { NextResponse } from 'next/server'

const MINIMAX_API_KEY = process.env.NEXT_PUBLIC_MINIMAX_API_KEY
const MINIMAX_GROUP_ID = process.env.NEXT_PUBLIC_MINIMAX_GROUP_ID

export async function GET() {
  const results = {
    apiKeyConfigured: !!MINIMAX_API_KEY,
    groupIdConfigured: !!MINIMAX_GROUP_ID,
    apiKeyPrefix: MINIMAX_API_KEY ? MINIMAX_API_KEY.substring(0, 10) + '...' : 'NOT SET',
    groupId: MINIMAX_GROUP_ID || 'NOT SET',
    tests: [] as any[]
  }

  // Test 1: Video Generation Submit
  try {
    const submitResponse = await fetch(`https://api.minimax.io/v1/video_generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-Hailuo-2.3',
        prompt: 'A peaceful zen meditation scene',
        duration: 6,
        resolution: '1080P',
      }),
    })

    const submitData = await submitResponse.json()
    
    results.tests.push({
      name: 'Video Generation Submit',
      status: submitResponse.status,
      ok: submitResponse.ok,
      response: submitData
    })
  } catch (error) {
    results.tests.push({
      name: 'Video Generation Submit',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 2: Text to Speech
  try {
    const ttsResponse = await fetch(`https://api.minimax.chat/v1/text_to_speech?GroupId=${MINIMAX_GROUP_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Test audio generation',
        voice_id: 'male-qn-qingse',
        model: 'speech-01',
      }),
    })

    results.tests.push({
      name: 'Text to Speech',
      status: ttsResponse.status,
      ok: ttsResponse.ok,
      contentType: ttsResponse.headers.get('content-type')
    })
  } catch (error) {
    results.tests.push({
      name: 'Text to Speech',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  return NextResponse.json(results, { status: 200 })
}
