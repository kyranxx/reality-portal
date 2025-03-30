import type { Metadata } from 'next';
import ChatAssistantClient from './ChatAssistantClient';

export const metadata: Metadata = {
  title: 'AI Assistant',
  description: 'Interactive AI assistant that helps with your questions. Features real-time search, image generation, trend analysis, and more.',
};

export default function ChatAssistantPage() {
  return <ChatAssistantClient />;
}
