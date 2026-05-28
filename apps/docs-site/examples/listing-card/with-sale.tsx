import { type GlyphName } from '@ship-it-ui/icons';
import { ListingCard } from '@ship-it-ui/ui';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['car'];

export default function Example() {
  return (
    <ListingCard
      photos={photos}
      renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
      eyebrow="Convertible · 25% off"
      title="2021 BMW Z4"
      rating={4.8}
      reviewCount={94}
      originalPrice="$120"
      price="$89"
      priceUnit="/day"
      host="Priya"
      verified
    />
  );
}
