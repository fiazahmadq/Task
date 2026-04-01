export type MessageIntent =
  | 'image'
  | 'code'
  | 'audio'
  | 'video'
  | 'analysis'
  | 'writing'
  | 'translation'
  | 'agents'
  | 'general'

interface ClassificationResult {
  intent: MessageIntent
  confidence: 'high' | 'medium' | 'low'
}

const INTENT_PATTERNS: Record<MessageIntent, RegExp[]> = {
  image: [
    /\b(create|generate|make|draw|design|paint|render|visualize)\b.{0,30}\b(image|picture|photo|illustration|artwork|logo|icon|banner|thumbnail)\b/i,
    /\b(image|picture|photo|illustration|artwork)\b.{0,20}\b(of|showing|depicting|with)\b/i,
    /\b(dall-?e|midjourney|stable diffusion|flux|image generation)\b/i,
  ],
  code: [
    /\b(write|create|build|implement|fix|debug|refactor|optimize)\b.{0,30}\b(code|function|class|component|api|endpoint|script|program|app|application)\b/i,
    /\b(typescript|javascript|python|rust|go|java|c\+\+|sql|html|css|react|nextjs|node)\b/i,
    /\b(bug|error|exception|undefined|null|stack trace|compile|runtime)\b/i,
  ],
  audio: [
    /\b(transcribe|transcription|speech|audio|voice|podcast|record|microphone)\b/i,
    /\b(text.to.speech|tts|speech.to.text|stt|whisper)\b/i,
  ],
  video: [
    /\b(video|clip|footage|movie|film|animation|youtube|reel)\b/i,
    /\b(generate|create|make|edit).{0,20}\b(video|animation|clip)\b/i,
  ],
  analysis: [
    /\b(analyze|analyse|evaluate|assess|review|examine|compare|summarize|summarise)\b/i,
    /\b(data|dataset|csv|chart|graph|trend|pattern|insight|metric|statistic)\b/i,
    /\b(pros and cons|strengths|weaknesses|swot|comparison)\b/i,
  ],
  writing: [
    /\b(write|draft|compose|create|edit|proofread)\b.{0,30}\b(essay|article|blog|post|email|letter|report|document|story|content)\b/i,
    /\b(grammar|spelling|tone|style|rewrite|paraphrase|rephrase)\b/i,
  ],
  translation: [
    /\b(translate|translation|localize|localization)\b/i,
    /\b(in (spanish|french|arabic|german|chinese|japanese|korean|portuguese|italian|urdu|hindi))\b/i,
    /\bfrom (english|spanish|french|arabic|german|chinese|japanese|korean) to\b/i,
  ],
  agents: [
    /\b(automate|automation|workflow|pipeline|agent|multi.step|orchestrate|schedule|trigger)\b/i,
    /\b(run every|on a schedule|when.*then|if.*then|batch process)\b/i,
  ],
  general: [],
}

export function classifyIntent(message: string): ClassificationResult {
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS) as [MessageIntent, RegExp[]][]) {
    if (intent === 'general') continue

    const matches = patterns.filter(pattern => pattern.test(message))
    if (matches.length >= 2) {
      return { intent, confidence: 'high' }
    }
    if (matches.length === 1) {
      return { intent, confidence: 'medium' }
    }
  }

  return { intent: 'general', confidence: 'low' }
}

export function intentMatchesModelTypes(intent: MessageIntent, modelTypes: string[]): boolean {
  if (intent === 'general') return true

  const relevantIntents: Partial<Record<MessageIntent, string[]>> = {
    image: ['image'],
    code: ['code', 'language'],
    audio: ['audio'],
    video: ['video'],
    analysis: ['language', 'vision'],
    writing: ['language'],
    translation: ['language'],
    agents: ['language', 'code'],
  }

  const required = relevantIntents[intent] ?? []
  return required.some(type => modelTypes.includes(type))
}
