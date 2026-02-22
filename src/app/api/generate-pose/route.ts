import { NextRequest, NextResponse } from 'next/server'

const MINIMAX_API_KEY = process.env.NEXT_PUBLIC_MINIMAX_API_KEY

export async function POST(request: NextRequest) {
  try {
    // Check if running on Vercel production
    if (process.env.VERCEL_ENV === 'production') {
      const body = await request.json()
      const adminPassword = body.adminPassword
      
      if (adminPassword !== '!ZenGauge!') {
        return NextResponse.json(
          { error: 'This feature is available to administrators only! Because it costs $1 to generate a 3-second video with MINIMAX.', requiresPassword: true },
          { status: 403 }
        )
      }
    }

    const { pose } = await request.json()
    console.log('Generating pose silhouette for:', pose)

    if (!MINIMAX_API_KEY) {
      console.error('MINIMAX_API_KEY not configured')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const prompt = `A minimalist, solid black silhouette of a person performing a ${pose} yoga pose against a flat, pure white background. High contrast, clear outline, 2D aesthetic, no shadows, 4K resolution.`
    console.log('Prompt:', prompt)

    const submitResponse = await fetch('https://api.minimax.io/v1/video_generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'MiniMax-Hailuo-2.3',
        prompt,
        duration: 6,
        resolution: '1080P',
      }),
    })

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text()
      console.error('Submit error:', submitResponse.status, errorText)
      throw new Error('Failed to submit video generation')
    }

    const submitData = await submitResponse.json()
    console.log('Submit response:', submitData)
    const task_id = submitData.task_id || submitData.data?.task_id

    if (!task_id) {
      console.error('No task_id in response')
      throw new Error('No task_id received')
    }

    console.log('Task ID:', task_id, '- Polling...')

    // Poll for completion
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 10000))
      console.log(`Poll attempt ${i + 1}/60`)
      
      const queryResponse = await fetch(`https://api.minimax.io/v1/query/video_generation?task_id=${task_id}`, {
        headers: { 'Authorization': `Bearer ${MINIMAX_API_KEY}` },
      })

      if (!queryResponse.ok) {
        console.error('Query error:', queryResponse.status)
        continue
      }

      const queryData = await queryResponse.json()
      console.log('Query response:', queryData)
      
      const status = queryData.status || queryData.data?.status
      const file_id = queryData.file_id || queryData.data?.file_id
      
      if (status === 'Success' && file_id) {
        console.log('Success! File ID:', file_id)
        const fileResponse = await fetch(`https://api.minimax.io/v1/files/retrieve?file_id=${file_id}`, {
          headers: { 'Authorization': `Bearer ${MINIMAX_API_KEY}` },
        })

        const fileData = await fileResponse.json()
        const videoUrl = fileData.file?.download_url || fileData.data?.file?.download_url
        console.log('Video URL:', videoUrl)
        return NextResponse.json({ videoUrl })
      }
      
      if (status === 'Failed') {
        console.error('Generation failed:', queryData)
        break
      }
    }

    throw new Error('Video generation timeout')
  } catch (error) {
    console.error('Error in generate-pose:', error)
    return NextResponse.json({ 
      error: 'Failed to generate pose', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
