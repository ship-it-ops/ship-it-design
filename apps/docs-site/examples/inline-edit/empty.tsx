'use client';

import { InlineEdit } from '@ship-it-ui/ui';
import { useState } from 'react';

function Inner() {
  const [note, setNote] = useState('');
  return <InlineEdit value={note} onValueChange={setNote} placeholder="Add a description" />;
}

export default function Example() {
  return <Inner />;
}
