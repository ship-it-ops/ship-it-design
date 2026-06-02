'use client';
import { type GlyphName } from '@ship-it-ui/icons';
import { ListingCard } from '@ship-it-ui/ui';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['mountain', 'home'];

/**
 * Every section accepts a className override via the `classNames` slot map.
 * Combine with content overrides (ReactNode props) for full control.
 */
export default function Example() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ListingCard
        variant="spec"
        width="100%"
        photos={photos}
        renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
        flag={{ icon: 'flag', label: 'Editor pick', tone: 'accent' }}
        title="Loud title, italic meta"
        category="custom"
        meta="STAY-002 · est. 2021"
        specs={[
          { label: 'Sleeps', value: '6' },
          { label: 'Beds', value: '3' },
          { label: 'Baths', value: '2' },
        ]}
        pricePrefix="from"
        price="$420"
        priceUnit="/night"
        cta={{ label: 'Book', onClick: () => {} }}
        classNames={{
          title: 'text-[18px] uppercase tracking-wider',
          meta: 'italic font-sans',
          specValue: 'text-accent',
          cta: 'rounded-full',
        }}
      />
      <ListingCard
        variant="spec"
        width="100%"
        photos={photos}
        renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
        flag={{ icon: 'flame', label: 'Hot', tone: 'pink' }}
        title="Branded surfaces"
        category="theme"
        meta="STAY-003 · est. 2022"
        specs={[
          { label: 'View', value: 'Ocean' },
          { label: 'Stay', value: '2-night min' },
        ]}
        pricePrefix="from"
        price="$310"
        priceUnit="/night"
        cta={{ label: 'Book', onClick: () => {} }}
        classNames={{
          root: 'border-pink',
          footer: 'bg-[color-mix(in_oklab,var(--color-pink),transparent_88%)]',
          flag: 'shadow-lg',
          specs: 'grid-cols-2',
          photoCounter: 'bg-pink/40',
        }}
      />
    </div>
  );
}
