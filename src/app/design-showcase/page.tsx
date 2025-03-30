import type { Metadata } from 'next';
import DesignShowcaseClient from './DesignShowcaseClient';

export const metadata: Metadata = {
  title: 'Design Showcase',
  description: 'A showcase of modern interface design with dark mode support and responsive layout.',
};

export default function DesignShowcasePage() {
  return <DesignShowcaseClient />;
}
