'use client';
import { type GlyphName } from '@ship-it-ui/icons';
import { ListingCard } from '@ship-it-ui/ui';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['mountain', 'home'];

const baseProps = {
  variant: 'spec' as const,
  photos,
  renderPhoto: (name: string) => <ExamplePhoto icon={name as GlyphName} />,
  flag: { icon: 'flag' as GlyphName, label: 'Flagship' as const, tone: 'purple' as const },
  category: 'architectural',
  meta: 'STAY-001 · est. 2019',
  specs: [
    { label: 'Sleeps', value: '6' },
    { label: 'Beds', value: '3' },
    { label: 'Baths', value: '2' },
  ],
  pricePrefix: 'from',
  priceUnit: '/night',
  onClick: () => {},
  cta: { label: 'Book', onClick: () => {} },
  // Each card fills its grid cell so three fit at preview width.
  width: '100%',
};

export default function Example() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <span className="text-text-dim text-[11px] tracking-wide uppercase">lift</span>
        <ListingCard {...baseProps} title="Lift on hover" hoverEffect="lift" price="$420" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-text-dim text-[11px] tracking-wide uppercase">glow</span>
        <ListingCard {...baseProps} title="Glow on hover" hoverEffect="glow" price="$420" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-text-dim text-[11px] tracking-wide uppercase">none</span>
        <ListingCard {...baseProps} title="No hover effect" hoverEffect="none" price="$420" />
      </div>
    </div>
  );
}
