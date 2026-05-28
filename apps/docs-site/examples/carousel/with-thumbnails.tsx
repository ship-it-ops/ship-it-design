import type { GlyphName } from '@ship-it-ui/icons';
import { Carousel } from '@ship-it-ui/ui';

import { DemoTile } from '../../components/DemoTile';

interface Slide {
  icon: GlyphName;
  title: string;
}

const slides: Slide[] = [
  { icon: 'service', title: 'Front' },
  { icon: 'deployment', title: 'Side' },
  { icon: 'target', title: 'Interior' },
  { icon: 'sparkle', title: 'Trunk' },
];

export default function Example() {
  return (
    <Carousel
      items={slides}
      aria-label="Vehicle photos"
      renderItem={(s) => <DemoTile icon={s.icon} title={s.title} />}
      renderThumbnail={(s) => (
        <DemoTile icon={s.icon} title={s.title} compact style={{ width: 64, height: 40 }} />
      )}
    />
  );
}
