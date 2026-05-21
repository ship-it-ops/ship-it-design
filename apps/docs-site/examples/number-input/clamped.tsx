'use client';
import { useState } from 'react';
import { NumberInput } from '@ship-it-ui/ui';

function Inner() {
  const [v, setV] = useState(2);
  return (
    <NumberInput value={v} onValueChange={setV} min={1} max={5} aria-label="Child seats (max 5)" />
  );
}

export default function Example() {
  return <Inner />;
}
