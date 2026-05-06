import { useState } from 'react';
import { Dots } from '@ship-it-ui/ui';

function DotsInteractiveDemo() {
  const [current, setCurrent] = useState(0);
  return <Dots total={6} current={current} onChange={setCurrent} />;
}

export default function Example() {
  return <Dots total={5} current={1} />;
}
