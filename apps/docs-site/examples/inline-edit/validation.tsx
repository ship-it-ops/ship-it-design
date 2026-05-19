'use client';

import { InlineEdit } from '@ship-it-ui/ui';
import { useState } from 'react';

function Inner() {
  const [slug, setSlug] = useState('payments-svc');
  return (
    <InlineEdit
      value={slug}
      onValueChange={setSlug}
      validate={(next) =>
        /^[a-z][a-z0-9-]*$/.test(next) ? null : 'Lowercase, digits, and dashes only'
      }
    />
  );
}

export default function Example() {
  return <Inner />;
}
