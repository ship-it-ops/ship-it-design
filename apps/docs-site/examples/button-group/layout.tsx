import { useState } from 'react';
import { Button, ButtonGroup } from '@ship-it-ui/ui';

function Segmented({ items }: { items: string[] }) {
  const [active, setActive] = useState(items[0]);
  return (
    <ButtonGroup>
      {items.map((item) => (
        <Button
          key={item}
          variant="secondary"
          onClick={() => setActive(item)}
          className={active === item ? 'bg-accent-dim text-accent' : ''}
        >
          {item}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default function Example() {
  return <Segmented items={['⊞', '☰', '⋮']} />;
}
