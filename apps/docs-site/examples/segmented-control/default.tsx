'use client';
import { useState } from 'react';
import { SegmentedControl } from '@ship-it-ui/ui';

function Inner() {
  const [v, setV] = useState('day');
  return (
    <SegmentedControl
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
      value={v}
      onValueChange={setV}
      aria-label="Time range"
    />
  );
}

export default function Example() {
  return <Inner />;
}
