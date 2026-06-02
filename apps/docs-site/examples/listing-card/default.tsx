'use client';

import { type GlyphName } from '@ship-it-ui/icons';
import { ListingCard } from '@ship-it-ui/ui';
import { useState } from 'react';

import { ExamplePhoto } from '@/lib/example-photo';

const photos: GlyphName[] = ['home', 'palmTree'];

function Inner() {
  const [fav, setFav] = useState(false);
  return (
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
      favorited={fav}
      onFavorite={setFav}
      href="#"
    />
  );
}

export default function Example() {
  return <Inner />;
}
