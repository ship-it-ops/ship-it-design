'use client';

import { type GlyphName } from '@ship-it-ui/icons';
import { Button, ListingCard, ListingDetail } from '@ship-it-ui/ui';
import { useState } from 'react';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['car', 'carFront', 'steeringWheel', 'seat'];

function Inner() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <Button onClick={() => setOpen(true)}>Open listing detail</Button>
      <div className="opacity-90">
        <ListingCard
          photos={photos}
          renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
          eyebrow="Mid-size SUV · Berkeley"
          title="2023 Tesla Model Y"
          rating={4.92}
          reviewCount={238}
          price="$89"
          priceUnit="/day"
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
        eyebrow="Mid-size SUV · Berkeley"
        title="2023 Tesla Model Y"
        rating={4.92}
        reviewCount={238}
        price="$89"
        priceUnit="/day"
        originalPrice="$119"
        host={{
          name: 'Jamie',
          verified: true,
          meta: 'Host since 2022 · 312 trips',
        }}
        features={[
          { icon: 'seat', label: '5 seats' },
          { icon: 'fuel', label: 'Electric' },
          { icon: 'snowflake', label: 'A/C' },
          { icon: 'bluetooth', label: 'Bluetooth' },
          { icon: 'usb', label: 'USB' },
          { icon: 'petFriendly', label: 'Pet friendly' },
        ]}
        description="Long-range RWD. Clean interior, fresh detail. Free supercharging credits included for the first week. Pickup at the Berkeley BART station — 4-minute walk."
        primaryAction={{ label: 'Book now', onClick: () => {} }}
        secondaryAction={{ label: 'Message host', onClick: () => {} }}
      />
    </div>
  );
}

export default function Example() {
  return <Inner />;
}
