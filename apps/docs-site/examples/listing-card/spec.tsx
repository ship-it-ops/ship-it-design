'use client';
import { type GlyphName } from '@ship-it-ui/icons';
import { ListingCard } from '@ship-it-ui/ui';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['car', 'carFront', 'steeringWheel', 'seat', 'gauge'];

export default function Example() {
  return (
    <ListingCard
      variant="spec"
      photos={photos}
      renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
      onClick={() => {}}
      flag={{ icon: 'flag', label: 'Flagship', tone: 'purple' }}
      title="Chevrolet Corvette Stingray Convertible"
      category="performance"
      meta="LR-001 · 2023"
      specs={[
        { label: '0-60', value: '2.9s' },
        { label: 'Power', value: '495 hp' },
        { label: 'Drive', value: 'RWD' },
      ]}
      pricePrefix="from"
      price="$250"
      priceUnit="/day"
      cta={{ label: 'Rent', onClick: () => {} }}
    />
  );
}
