import type { GlyphName } from '@ship-it-ui/icons';
import { Carousel } from '@ship-it-ui/ui';

import { DemoTile } from '../../components/DemoTile';

interface Slide {
  icon: GlyphName;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  { icon: 'service', title: 'Tesla Model 3', subtitle: 'Electric · Sedan' },
  { icon: 'deployment', title: 'Jeep Wrangler', subtitle: '4×4 · SUV' },
  { icon: 'target', title: 'BMW i4', subtitle: 'Electric · Gran Coupe' },
  { icon: 'sparkle', title: 'Ford F-150', subtitle: 'Pickup' },
];

export default function Example() {
  return (
    <Carousel
      items={slides}
      aria-label="Featured vehicles"
      renderItem={(s) => <DemoTile icon={s.icon} title={s.title} subtitle={s.subtitle} />}
    />
  );
}
