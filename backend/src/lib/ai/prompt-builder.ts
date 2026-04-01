import type { OnboardingAnswers } from '@/features/onboarding/schemas/onboarding.schema'

const ROLE_PERSONAS: Record<string, string> = {
  developer: 'You are a senior software engineer and technical architect',
  researcher: 'You are an expert researcher and analytical thinker',
  student: 'You are a knowledgeable tutor who explains concepts clearly',
  business: 'You are a strategic business advisor and consultant',
  creative: 'You are a creative director and innovative thinker',
  educator: 'You are an experienced educator who creates engaging content',
  other: 'You are a versatile AI assistant',
}

const TASK_ACTIONS: Record<string, string> = {
  write: 'Help me write',
  code: 'Help me build and code',
  analyze: 'Help me analyze and evaluate',
  image: 'Help me create visuals for',
  audio: 'Help me with audio content for',
  translate: 'Help me translate and localize',
  research: 'Help me research and synthesize information about',
  automate: 'Help me automate and optimize',
  chat: 'Assist me with',
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  formal: 'Respond in a formal, structured tone',
  casual: 'Respond in a friendly, conversational tone',
  technical: 'Respond with precise technical language and detail',
  creative: 'Respond creatively with imaginative language',
  professional: 'Respond in a professional, business-appropriate tone',
}

const FORMAT_INSTRUCTIONS: Record<string, string> = {
  prose: 'Format your response as clear prose paragraphs',
  bullets: 'Format your response as bullet points',
  code: 'Include code examples with proper syntax highlighting',
  json: 'Format your response as valid JSON',
  numbered: 'Format your response as a numbered list of steps',
  table: 'Organize your response in a table format where appropriate',
  outline: 'Structure your response as a hierarchical outline',
}

const DEPTH_INSTRUCTIONS: Record<string, string> = {
  brief: 'Be concise — focus on key points only',
  moderate: 'Provide a balanced level of detail',
  comprehensive: 'Be thorough and cover all relevant aspects',
  exhaustive: 'Be exhaustive — include every relevant consideration and edge case',
}

const AUDIENCE_CLAUSES: Record<string, string> = {
  self: 'This is for my personal use',
  team: 'The output is for my team',
  client: 'This will be shared with a client',
  public: 'This is intended for a general public audience',
  technical: 'The audience is technical professionals',
  'non-technical': 'The audience is non-technical and needs plain language',
}

const CONSTRAINT_CLAUSES: Record<string, string> = {
  free: 'Please use only open-source or free resources where possible',
  budget: 'Keep cost-efficiency in mind',
  premium: 'Quality is the priority over cost',
  'no-limit': 'Use whatever resources and approach will produce the best result',
}

const CONTEXT_HINTS: Record<string, string> = {
  short: 'The context is brief — keep your response focused',
  medium: 'Work with a moderate amount of context',
  long: 'I may provide extensive context — process it thoroughly',
  'very-long': 'I will provide very long documents — summarize and extract key insights',
}

export function buildPrompt(answers: OnboardingAnswers, userTypedQuery?: string): string {
  const clauses: string[] = []

  const persona = ROLE_PERSONAS[answers.role ?? ''] ?? ROLE_PERSONAS.other
  clauses.push(`${persona}.`)

  const taskAction = TASK_ACTIONS[answers.task ?? ''] ?? 'Assist me with'
  if (userTypedQuery?.trim()) {
    clauses.push(`${taskAction}: ${userTypedQuery.trim()}.`)
  } else {
    clauses.push(`${taskAction} my request.`)
  }

  if (answers.audience) {
    const audienceClause = AUDIENCE_CLAUSES[answers.audience]
    if (audienceClause) clauses.push(audienceClause + '.')
  }

  if (answers.tone) {
    const toneInstruction = TONE_INSTRUCTIONS[answers.tone]
    if (toneInstruction) clauses.push(toneInstruction + '.')
  }

  if (answers.format) {
    const formatInstruction = FORMAT_INSTRUCTIONS[answers.format]
    if (formatInstruction) clauses.push(formatInstruction + '.')
  }

  if (answers.depth) {
    const depthInstruction = DEPTH_INSTRUCTIONS[answers.depth]
    if (depthInstruction) clauses.push(depthInstruction + '.')
  }

  if (answers.context) {
    const contextHint = CONTEXT_HINTS[answers.context]
    if (contextHint) clauses.push(contextHint + '.')
  }

  if (answers.constraint) {
    const constraintClause = CONSTRAINT_CLAUSES[answers.constraint]
    if (constraintClause) clauses.push(constraintClause + '.')
  }

  return clauses.join(' ')
}
