import { useState } from 'react';
import { Button, PullToRefresh, type PullToRefreshState } from '@ship-it-ui/ui';

export default function Example() {
  const [state, setState] = useState<PullToRefreshState>('idle');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <PullToRefresh state={state} />
      <div style={{ display: 'flex', gap: 6 }}>
        {(['idle', 'pulling', 'ready', 'loading'] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={state === s ? 'primary' : 'ghost'}
            onClick={() => setState(s)}
          >
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}
