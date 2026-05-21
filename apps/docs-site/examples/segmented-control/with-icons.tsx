'use client';
import { useState } from 'react';
import { SegmentedControl } from '@ship-it-ui/ui';

function Inner() {
  const [v, setV] = useState('list');
  return (
    <SegmentedControl
      options={[
        { value: 'list', label: 'List', icon: 'list' },
        { value: 'map', label: 'Map', icon: 'map' },
      ]}
      value={v}
      onValueChange={setV}
      aria-label="View"
    />
  );
}

export default function Example() {
  return <Inner />;
}
