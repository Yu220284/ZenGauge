interface ScriptRequest {
  category: string
  duration: string
  level: string
  goal: string
  preferences: string
}

interface ScriptStep {
  time: string
  text: string
}

interface GeneratedScript {
  title: string
  duration: string
  level: string
  steps: ScriptStep[]
}

export async function generateScript(request: ScriptRequest): Promise<GeneratedScript> {
  const categoryMap: Record<string, string> = {
    yoga: 'ヨガ',
    workout: '筋トレ',
    stretch: 'ストレッチ',
    meditation: '瞑想'
  }

  const levelMap: Record<string, string> = {
    beginner: '初心者',
    intermediate: '中級者',
    advanced: '上級者'
  }

  const purposeMap: Record<string, string> = {
    yoga: 'relaxation',
    workout: 'strength',
    stretch: 'flexibility',
    meditation: 'mindfulness'
  }

  try {
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (response.ok) {
      const data = await response.json()
      console.log('Generated script:', data)
      if (data.steps && data.steps.length > 0) {
        return data
      }
    } else {
      const errorText = await response.text()
      console.error('API error:', response.status, errorText)
    }
  } catch (error) {
    console.error('AI generation error:', error)
  }

  return {
    title: `あなた専用の${categoryMap[request.category]}セッション`,
    duration: `${request.duration}分`,
    level: levelMap[request.level],
    steps: generateFallbackSteps(request, categoryMap, levelMap)
  }
}

function generateFallbackSteps(
  request: ScriptRequest,
  categoryMap: Record<string, string>,
  levelMap: Record<string, string>
): ScriptStep[] {
  const duration = parseInt(request.duration)
  const steps: ScriptStep[] = []
  
  steps.push({ time: '0:00', text: `こんにちは。今日は${request.goal}を目指して、一緒に${categoryMap[request.category]}を行いましょう。` })
  steps.push({ time: '0:30', text: 'まずは楽な姿勢で座り、深呼吸を始めます。鼻から大きく息を吸って、口からゆっくり吐き出します。' })
  
  const interval = Math.max(2, Math.floor(duration / 8))
  for (let i = 1; i < 7; i++) {
    const time = i * interval
    const min = Math.floor(time / 60)
    const sec = time % 60
    steps.push({ 
      time: `${min}:${sec.toString().padStart(2, '0')}`, 
      text: `${request.preferences ? request.preferences + 'を意識しながら、' : ''}次の動作に移ります。自分のペースで無理なく行いましょう。` 
    })
  }
  
  steps.push({ time: `${duration - 1}:00`, text: 'ゆっくりと呼吸を整えて、今日のセッションを終了します。深呼吸を3回繰り返しましょう。' })
  steps.push({ time: `${duration}:00`, text: `お疲れさまでした。${request.goal}に向けて、素晴らしいセッションでしたね。` })

  return steps
}
