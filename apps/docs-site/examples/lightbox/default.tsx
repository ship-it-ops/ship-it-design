'use client';
import { useState } from 'react';
import type { GlyphName } from '@ship-it-ui/icons';
import { Button, Lightbox } from '@ship-it-ui/ui';

import { DemoTile } from '../../components/DemoTile';

interface Slide {
  icon: GlyphName;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  { icon: 'sparkle', title: 'Ask anything', subtitle: 'AI surface' },
  { icon: 'service', title: 'Service catalog', subtitle: 'Knowledge graph' },
  { icon: 'deployment', title: 'Ship it', subtitle: 'Deployments' },
  { icon: 'target', title: 'Goals', subtitle: 'OKRs · Q3' },
];

function Inner() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open photo viewer</Button>
      <Lightbox
        open={open}
        onOpenChange={setOpen}
        items={slides}
        renderItem={(item) => {
          const s = item as Slide;
          return (
            <DemoTile
              icon={s.icon}
              title={s.title}
              subtitle={s.subtitle}
              style={{ width: 'min(70vmin, 720px)', aspectRatio: '16 / 10' }}
            />
          );
        }}
      />
    </>
  );
}

export default function Example() {
  return <Inner />;
}
