'use client';
import { type GlyphName } from '@ship-it-ui/icons';
import { ListingCard } from '@ship-it-ui/ui';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['car', 'carFront'];

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
        meta="LR-002 · 2024"
        specs={[
          { label: '0-60', value: '2.9s' },
          { label: 'Power', value: '495 hp' },
          { label: 'Drive', value: 'RWD' },
        ]}
        pricePrefix="from"
        price="$250"
        priceUnit="/day"
        cta={{ label: 'Rent', onClick: () => {} }}
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
        meta="LR-003 · 2024"
        specs={[
          { label: 'Range', value: '358 mi' },
          { label: 'Charge', value: '15 min' },
        ]}
        pricePrefix="from"
        price="$179"
        priceUnit="/day"
        cta={{ label: 'Rent', onClick: () => {} }}
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
