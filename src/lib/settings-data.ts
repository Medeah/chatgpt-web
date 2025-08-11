import type { ChatSettings, GlobalSettings, ChatSortOption } from './Types.svelte'
import { faArrowDown91, faArrowDownAZ } from '@fortawesome/free-solid-svg-icons/index'

export const gptDefaults = {
  model: '',
  messages: [],
  temperature: 1,
  top_p: 1,
  n: 1,
  stream: true,
  stop: null,
  max_completion_tokens: 512,
  presence_penalty: 0,
  frequency_penalty: 0,
  logit_bias: null,
  user: undefined
}

// Core set of defaults
export const defaults: ChatSettings = {
  ...(gptDefaults as any),
  profile: '',
  characterName: 'ChatGPT',
  profileName: '',
  profileDescription: '',
  continuousChat: 'fifo',
  summaryThreshold: 3000,
  summarySize: 1000,
  summaryExtend: 0,
  summaryTemperature: 0.1,
  pinTop: 0,
  pinBottom: 6,
  summaryPrompt: '',
  useSystemPrompt: false,
  systemPrompt: '',
  hideSystemPrompt: false,
  sendSystemPromptLast: false,
  autoStartSession: false,
  trainingPrompts: [],
  hiddenPromptPrefix: '',
  hppContinuePrompt: '',
  hppWithSummaryPrompt: false,
  imageGenerationModel: '',
  startSequence: '',
  stopSequence: '',
  aggressiveStop: true,
  delimiter: '',
  userMessageStart: '',
  userMessageEnd: '',
  assistantMessageStart: '',
  assistantMessageEnd: '',
  systemMessageStart: '',
  systemMessageEnd: '',
  leadPrompt: '',
  repetitionPenalty: 1.1,
  holdSocket: true,
  isDirty: false
}

export const getChatDefaults = (): ChatSettings => defaults

export const globalDefaults: GlobalSettings = {
  profiles: {} as Record<string, ChatSettings>,
  lastProfile: 'default',
  defaultProfile: 'default',
  hideSummarized: false,
  chatSort: 'created',
  openAICompletionEndpoint: '',
  enablePetals: false,
  pedalsEndpoint: '',
  openAiEndpoint: 'https://api.openai.com'
}

export const excludeFromProfile = {
  messages: true,
  user: true,
  isDirty: true
}

export const chatSortOptions = {
  name: { text: 'Name', icon: faArrowDownAZ, value: '', sortFn: (a, b) => { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0 } },
  created: { text: 'Created', icon: faArrowDown91, value: '', sortFn: (a, b) => { return ((b.created || 0) - (a.created || 0)) || (b.id - a.id) } },
  lastUse: { text: 'Last Use', icon: faArrowDown91, value: '', sortFn: (a, b) => { return ((b.lastUse || 0) - (a.lastUse || 0)) || (b.id - a.id) } },
  lastAccess: { text: 'Last View', icon: faArrowDown91, value: '', sortFn: (a, b) => { return ((b.lastAccess || 0) - (a.lastAccess || 0)) || (b.id - a.id) } }
} as Record<string, ChatSortOption>

Object.entries(chatSortOptions).forEach(([k, o]) => { (o as any).value = k })


