'use client';

import { type GlyphName } from '@ship-it-ui/icons';
import { ListingCard } from '@ship-it-ui/ui';
import { useState } from 'react';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['car', 'carFront'];

function Inner() {
  const [fav, setFav] = useState(false);
  return (
    <ListingCard
      photos={photos}
      renderPhoto={(name) => <ExamplePhoto icon={name as GlyphName} />}
      eyebrow="Mid-size SUV"
      title="2023 Tesla Model Y"
      rating={4.92}
      reviewCount={238}
      price="$89"
      priceUnit="/day"
      host="Jamie"
      distance="0.4 mi away"
      verified
      favorited={fav}
      onFavorite={setFav}
      href="#"
    />
  );
}

export default function Example() {
  return <Inner />;
}
