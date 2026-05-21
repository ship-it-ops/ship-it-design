'use client';
import { useState } from 'react';
import { NumberInput } from '@ship-it-ui/ui';

function Inner() {
  const [v, setV] = useState(1);
  return <NumberInput value={v} onValueChange={setV} aria-label="Additional drivers" />;
}

export default function Example() {
  return <Inner />;
}
