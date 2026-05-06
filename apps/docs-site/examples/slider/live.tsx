import { useState } from 'react';
import { Slider } from '@ship-it-ui/ui';

export default function Example() {
  const Inner = () => {
    const [v, setV] = useState<number[]>([42]);
    return (
      <Slider
        value={v}
        onValueChange={(next) => setV(Array.isArray(next) ? next : [next])}
        showValue
      />
    );
  };
  return <Inner />;
}
