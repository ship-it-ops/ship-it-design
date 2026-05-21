'use client';
import { useState } from 'react';
import { SegmentedControl } from '@ship-it-ui/ui';

function Inner() {
  const [v, setV] = useState('day');
  return (
    <SegmentedControl
      options={[
        { value: 'day', label: 'Daily' },
        { value: 'week', label: 'Weekly' },
        { value: 'month', label: 'Monthly' },
      ]}
      value={v}
      onValueChange={setV}
      aria-label="Rate period"
    />
  );
}

export default function Example() {
  return <Inner />;
}
