'use client';
import { useState } from 'react';
import { Button, Lightbox } from '@ship-it-ui/ui';

const colors = [
  'oklch(0.7 0.15 30)',
  'oklch(0.7 0.15 130)',
  'oklch(0.7 0.15 230)',
  'oklch(0.7 0.15 330)',
];

function Inner() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open photo viewer</Button>
      <Lightbox
        open={open}
        onOpenChange={setOpen}
        items={colors}
        renderItem={(c) => (
          <div
            style={{
              background: c as string,
              width: '70vmin',
              height: '50vmin',
              borderRadius: 8,
            }}
          />
        )}
      />
    </>
  );
}

export default function Example() {
  return <Inner />;
}
