// src/utils/aiAssistantEngine.ts
// Dual-Brain In-App AI Assistant: On-Device Zero-Latency Rule Engine Fallback

import { AppItem, UserProfile } from '../types';

export interface AssistantContext {
  user: UserProfile | null;
  items: AppItem[];
  activeScreen: string;
}

const GENERAL_POOLS: string[] = [
  "You're making great progress! Review your active priorities and take action on the most important one today.",
  "Tip: Breaking complex tasks into 20-minute focused blocks boosts completion rates by over 40%.",
  "Consistency beats intensity every time. Keep moving forward step by step!",
  "I'm here to help you navigate, organize your workflow, and stay productive. What would you like to accomplish next?",
];

let lastPoolIndex = -1;

export function generateLocalAssistantResponse(
  query: string,
  context: AssistantContext
): string {
  const normalized = query.toLowerCase().trim();
  const userName = context.user?.name || 'there';

  // 1. Social Greetings
  if (
    normalized.includes('hi') ||
    normalized.includes('hello') ||
    normalized.includes('hey') ||
    normalized.includes('good morning') ||
    normalized.includes('how are you')
  ) {
    const itemCount = context.items.length;
    return `Hello ${userName}! 👋 I'm your in-app assistant. You currently have ${itemCount} item${
      itemCount === 1 ? '' : 's'
    } tracked in your workspace. How can I assist you today?`;
  }

  // 2. Status / Listing items
  if (
    normalized.includes('what') ||
    normalized.includes('list') ||
    normalized.includes('status') ||
    normalized.includes('my items') ||
    normalized.includes('tasks')
  ) {
    if (context.items.length === 0) {
      return `You don't have any items tracked yet, ${userName}. Tap the '+' button in the navigation bar to create your first one!`;
    }

    const preview = context.items
      .slice(0, 4)
      .map((item, idx) => `${idx + 1}. **${item.title}** (${item.status})`)
      .join('\n');

    return `Here is a quick snapshot of your active items:\n\n${preview}\n\nNeed me to help organize or filter these?`;
  }

  // 3. Help / FAQs
  if (normalized.includes('help') || normalized.includes('how to') || normalized.includes('faq')) {
    return `Here are a few quick shortcuts:\n\n• **Create**: Tap the center '+' button on any screen.\n• **Filter**: Switch between Home, Explore, and Analytics tabs.\n• **Offline Mode**: Any changes you make work instantly and sync when internet returns!`;
  }

  // 4. Rotating response pool
  let nextIndex = Math.floor(Math.random() * GENERAL_POOLS.length);
  if (nextIndex === lastPoolIndex) {
    nextIndex = (nextIndex + 1) % GENERAL_POOLS.length;
  }
  lastPoolIndex = nextIndex;

  return GENERAL_POOLS[nextIndex];
}
