'use client';

import { InlineEdit } from '@ship-it-ui/ui';
import { useState } from 'react';

function Inner() {
  const [title, setTitle] = useState('Phase 3 — Visual schema editor');
  return (
    <InlineEdit
      as="h2"
      size="lg"
      value={title}
      onValueChange={setTitle}
      className="font-semibold"
    />
  );
}

export default function Example() {
  return <Inner />;
}
