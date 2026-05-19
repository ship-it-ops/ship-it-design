'use client';

import { InlineEdit } from '@ship-it-ui/ui';
import { useState } from 'react';

function Inner() {
  const [name, setName] = useState('api-gateway');
  return <InlineEdit value={name} onValueChange={setName} />;
}

export default function Example() {
  return <Inner />;
}
