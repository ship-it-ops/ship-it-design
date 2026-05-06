import { useState } from 'react';
import { Slider } from '@ship-it-ui/ui';

export default function Example() {
  const Inner = () => {
    const [v, setV] = useState([42]);
    return <Slider value={v} onValueChange={setV} showValue />;
  };
  return <Inner />;
}
