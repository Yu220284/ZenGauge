import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

const MINIMAX_API_KEY = process.env.NEXT_PUBLIC_MINIMAX_API_KEY
const MINIMAX_GROUP_ID = process.env.NEXT_PUBLIC_MINIMAX_GROUP_ID

interface GenerateVideoRequest {
  musicGenre: string
  pose: string
  difficulty: string
  gender: string
  age: string
  location: string
  speed: string
}

const poseDescriptions: Record<string, string> = {
  lotus: 'Sit in lotus position with your back straight and hands resting on your knees',
  seiza: 'Sit in seiza position with your back straight and hands on your thighs',
  standing: 'Stand with feet shoulder-width apart and arms naturally at your sides',
  walking: 'Walk slowly, bringing awareness to each step',
  lying: 'Lie on your back, release all tension, and relax completely'
}

const difficultyInstructions: Record<string, string> = {
  beginner: 'Suitable for beginners with basic breathing techniques and posture guidance',
  intermediate: 'Synchronize breath with movement for deeper meditation',
  advanced: 'Advanced breathing techniques requiring extended concentration'
}

async function generateScript(musicGenre: string, pose: string, difficulty: string): Promise<string> {
  const poseDesc = poseDescriptions[pose] || ''
  const difficultyDesc = difficultyInstructions[difficulty] || ''
  
  return `
Take a deep breath in, and slowly exhale.
${poseDesc}.
${difficultyDesc}.

Bring your awareness to this present moment.
Focus on your breathing.
Inhale through your nose, and slowly exhale through your mouth.

Release the tension in your body.
Relax your shoulders and let go.
Quiet your mind and feel the inner peace.

Continue with deep breaths.
Feel your presence here and now.
  `.trim()
}

async function generateVideo(prompt: string, pose: string, gender: string, age: string, location: string, speed: string): Promise<string> {
  if (!MINIMAX_API_KEY || !MINIMAX_GROUP_ID) {
    console.warn('MINIMAX API credentials not configured, using default video')
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }

  try {
    console.log('Submitting video generation task...')
    
    // Step 1: Submit video generation task
    const submitResponse = await fetch(`https://api.minimax.io/v1/video_generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-Hailuo-2.3',
        prompt: `A peaceful zen meditation scene: ${gender} person in their ${age} sitting in ${pose} position at a ${location}, ${speed} motion, serene atmosphere, soft natural lighting, tranquil and calm mood, cinematic quality`,
        duration: 6,
        resolution: '1080P',
      }),
    })

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text()
      console.error('MINIMAX Video API submit error:', submitResponse.status, errorText)
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }

    const submitData = await submitResponse.json()
    console.log('Submit response:', submitData)
    
    const taskId = submitData.task_id || submitData.data?.task_id

    if (!taskId) {
      console.error('No task_id in response:', submitData)
      return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }

    console.log('Task ID:', taskId, '- Polling for completion...')
    
    // Step 2: Poll for video generation result
    let attempts = 0
    const maxAttempts = 120
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++
      
      console.log(`Polling attempt ${attempts}/${maxAttempts}...`)
      
      const queryResponse = await fetch(`https://api.minimax.io/v1/query/video_generation?task_id=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        },
      })

      if (!queryResponse.ok) {
        console.error('Query error:', queryResponse.status)
        continue
      }

      const queryData = await queryResponse.json()
      console.log('Query response:', queryData)
      
      const status = queryData.status || queryData.data?.status
      const fileId = queryData.file_id || queryData.data?.file_id
      
      if (status === 'Success' && fileId) {
        console.log('Video generation successful! File ID:', fileId)
        
        // Step 3: Retrieve video file URL
        const fileResponse = await fetch(`https://api.minimax.io/v1/files/retrieve?file_id=${fileId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${MINIMAX_API_KEY}`,
          },
        })

        if (fileResponse.ok) {
          const fileData = await fileResponse.json()
          const videoUrl = fileData.file?.download_url || fileData.data?.file?.download_url
          
          if (videoUrl) {
            // Download and save video locally
            const videoResponse = await fetch(videoUrl)
            const videoBuffer = await videoResponse.arrayBuffer()
            const fileName = `zen_${Date.now()}.mp4`
            const filePath = path.join(process.cwd(), 'public', 'videos', fileName)
            await writeFile(filePath, Buffer.from(videoBuffer))
            return `/videos/${fileName}`
          }
        }
      } else if (status === 'Failed') {
        console.error('Video generation failed:', queryData)
        break
      } else if (status === 'Processing' || status === 'Queueing') {
        console.log('Video still processing...')
      }
    }

    console.warn('Video generation timed out or failed')
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  } catch (error) {
    console.error('Video generation error:', error)
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }
}

async function generateAudio(text: string): Promise<string> {
  if (!MINIMAX_API_KEY || !MINIMAX_GROUP_ID) {
    console.warn('MINIMAX API credentials not configured, skipping audio generation')
    return ''
  }

  try {
    const response = await fetch(`https://api.minimax.chat/v1/text_to_speech?GroupId=${MINIMAX_GROUP_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_id: 'male-qn-qingse',
        speed: 0.8,
        vol: 1.0,
        pitch: 0,
        model: 'speech-01',
        audio_sample_rate: 32000,
        bitrate: 128000,
        output_format: 'mp3'
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('MINIMAX TTS API error:', response.status, errorText)
      return ''
    }

    const audioBlob = await response.blob()
    const buffer = await audioBlob.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    
    return `data:audio/mp3;base64,${base64}`
  } catch (error) {
    console.error('Audio generation error:', error)
    return ''
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVideoRequest = await request.json()
    const { musicGenre, pose, difficulty, gender, age, location, speed } = body

    console.log('Generate video request:', { musicGenre, pose, difficulty })

    // Generate script
    const script = await generateScript(musicGenre, pose, difficulty)
    console.log('Generated script:', script)
    
    // Generate video and audio in parallel
    const [videoUrl, audioUrl] = await Promise.all([
      generateVideo(script, pose, gender, age, location, speed),
      generateAudio(script)
    ])

    console.log('Generated video URL:', videoUrl)
    console.log('Generated audio URL length:', audioUrl.length)

    const videoId = Date.now()
    
    const videoData = {
      id: videoId,
      title: `Custom Zen Video - ${pose}`,
      musicGenre,
      pose,
      difficulty,
      script,
      audioUrl,
      videoUrl,
      imageUrl: 'https://picsum.photos/seed/zen/800/450'
    }

    console.log('Returning video data:', { ...videoData, audioUrl: audioUrl ? 'present' : 'empty' })

    return NextResponse.json({ 
      videoId,
      videoData 
    })
  } catch (error) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: 'Failed to generate video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
