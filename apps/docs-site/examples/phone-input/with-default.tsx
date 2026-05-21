'use client';
import { useState } from 'react';
import { PhoneInput } from '@ship-it-ui/ui';

function Inner() {
  const [v, setV] = useState('+442079460000');
  return <PhoneInput value={v} onValueChange={setV} />;
}

export default function Example() {
  return <Inner />;
}
