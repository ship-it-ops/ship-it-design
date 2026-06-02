import { type GlyphName } from '@ship-it-ui/icons';
import { ListingCard } from '@ship-it-ui/ui';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['home'];

export default function Example() {
  return (
    <ListingCard
      photos={photos}
      renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
      eyebrow="Loft · 25% off"
      title="Cliffside loft in Pescadero"
      rating={4.8}
      reviewCount={94}
      originalPrice="$240"
      price="$179"
      priceUnit="/night"
      host="Priya"
      verified
    />
  );
}
