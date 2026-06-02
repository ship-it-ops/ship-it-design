'use client';

import { type GlyphName } from '@ship-it-ui/icons';
import { Button, ListingCard, ListingDetail } from '@ship-it-ui/ui';
import { useState } from 'react';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['home', 'palmTree', 'sun', 'seat'];

function Inner() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <Button onClick={() => setOpen(true)}>Open listing detail</Button>
      <div className="opacity-90">
        <ListingCard
          photos={photos}
          renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
          eyebrow="Studio · Mill Valley"
          title="Sun-soaked cabin in Marin"
          rating={4.92}
          reviewCount={238}
          price="$189"
          priceUnit="/night"
          host="Jamie"
          distance="0.4 mi away"
          verified
        />
      </div>
      <ListingDetail
        open={open}
        onOpenChange={setOpen}
        photos={photos}
        renderPhoto={(name, _i, mode) => (
          <ExamplePhoto icon={name as GlyphName} mode={mode === 'lightbox' ? 'contain' : 'cover'} />
        )}
        eyebrow="Studio · Mill Valley"
        title="Sun-soaked cabin in Marin"
        rating={4.92}
        reviewCount={238}
        price="$189"
        priceUnit="/night"
        originalPrice="$229"
        host={{
          name: 'Jamie',
          verified: true,
          meta: 'Host since 2022 · 312 stays',
        }}
        features={[
          { icon: 'seat', label: 'Sleeps 4' },
          { icon: 'wifi', label: 'Wi-Fi' },
          { icon: 'snowflake', label: 'A/C' },
          { icon: 'bluetooth', label: 'Bluetooth' },
          { icon: 'usb', label: 'USB' },
          { icon: 'petFriendly', label: 'Pet friendly' },
        ]}
        description="Walk to the redwoods, cell signal at the kitchen counter, hot tub fires up in ten minutes. Self check-in from 3pm — keypad code arrives by text the morning of your stay."
        primaryAction={{ label: 'Book now', onClick: () => {} }}
        secondaryAction={{ label: 'Message host', onClick: () => {} }}
      />
    </div>
  );
}

export default function Example() {
  return <Inner />;
}
