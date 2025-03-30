import type { Metadata } from 'next';
import GrokClient from './GrokClient';

export const metadata: Metadata = {
  title: 'Grok',
  description: 'Grok is a free AI assistant designed by xAI to maximize truth and objectivity. Grok offers real-time search, image generation, trend analysis, and more.',
};

export default function GrokPage() {
  return <GrokClient />;
}
