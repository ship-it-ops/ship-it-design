'use client';
import { useState } from 'react';
import { DateRangePicker, type DateRange } from '@ship-it-ui/ui';

function Inner() {
  const [r, setR] = useState<DateRange>({});
  return (
    <DateRangePicker value={r} onValueChange={setR} months={1} aria-label="Trip dates (mobile)" />
  );
}

export default function Example() {
  return <Inner />;
}
