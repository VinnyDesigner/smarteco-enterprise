import { AIMessage } from '../types/ai.types';

export const PROMPT_SUGGESTIONS = [
  'Which rooms had the worst air quality this week?',
  'Show the PM2.5 trend for the last 7 days',
  'How has PM2.5 changed in Room 01 this month?',
  'What are the 1 open alerts about?',
];

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    timestamp: 'Just now',
    text: "Hi — I'm the SmartEco Assistant.\nAsk me anything about your rooms and their air-quality history — I'll answer with text, tables or charts.",
  },
];
