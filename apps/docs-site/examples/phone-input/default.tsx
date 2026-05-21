'use client';
import { useState } from 'react';
import { PhoneInput } from '@ship-it-ui/ui';

function Inner() {
  const [v, setV] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <PhoneInput value={v} onValueChange={setV} />
      <span
        style={{
          fontSize: 11,
          color: 'var(--color-text-dim)',
          fontFamily: 'var(--font-family-mono)',
        }}
      >
        E.164: {v || '—'}
      </span>
    </div>
  );
}

export default function Example() {
  return <Inner />;
}
