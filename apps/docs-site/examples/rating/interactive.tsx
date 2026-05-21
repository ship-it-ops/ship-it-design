'use client';
import { useState } from 'react';
import { Rating } from '@ship-it-ui/ui';

function Inner() {
  const [v, setV] = useState(3);
  return <Rating value={v} onValueChange={setV} aria-label="Rate your host" />;
}

export default function Example() {
  return <Inner />;
}
