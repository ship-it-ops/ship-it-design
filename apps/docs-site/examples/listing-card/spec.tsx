'use client';
import { type GlyphName } from '@ship-it-ui/icons';
import { ListingCard } from '@ship-it-ui/ui';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['mountain', 'home', 'sun', 'palmTree', 'wifi'];

export default function Example() {
  return (
    <ListingCard
      variant="spec"
      photos={photos}
      renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
      onClick={() => {}}
      flag={{ icon: 'flag', label: 'Flagship', tone: 'purple' }}
      title="Ridgeline Glass House"
      category="architectural"
      meta="STAY-001 · est. 2019"
      specs={[
        { label: 'Sleeps', value: '6' },
        { label: 'Beds', value: '3' },
        { label: 'Baths', value: '2' },
      ]}
      pricePrefix="from"
      price="$420"
      priceUnit="/night"
      cta={{ label: 'Book', onClick: () => {} }}
    />
  );
}
