import type { GlyphName } from '@ship-it-ui/icons';
import { Carousel } from '@ship-it-ui/ui';

import { DemoTile } from '../../components/DemoTile';

interface Slide {
  icon: GlyphName;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    icon: 'service',
    title: 'Preview deployments',
    subtitle: 'Per-branch URLs, signed and shareable',
  },
  { icon: 'deployment', title: 'Workflows', subtitle: 'Durable steps, retries, and pause/resume' },
  { icon: 'target', title: 'Observability', subtitle: 'Logs, traces, and runtime metrics' },
  { icon: 'sparkle', title: 'AI agents', subtitle: 'Ship-It-AI surfaces and copilots' },
];

export default function Example() {
  return (
    <Carousel
      items={slides}
      aria-label="Featured Ship-It features"
      renderItem={(s) => <DemoTile icon={s.icon} title={s.title} subtitle={s.subtitle} />}
    />
  );
}
