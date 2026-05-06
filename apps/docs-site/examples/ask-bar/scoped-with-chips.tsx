import { Chip } from '@ship-it-ui/ui';
import { useState } from 'react';
import { AskBar, type AskBarProps } from '@ship-it-ui/shipit';

function AskBarDemo(args: AskBarProps) {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div className="flex w-full max-w-[620px] flex-col gap-3">
      <AskBar {...args} onSubmit={setLast} />
      {last && <div className="text-text-dim text-[12px]">submitted: {last}</div>}
    </div>
  );
}

export default function Example() {
  const args = {
    placeholder: 'Ask anything…',
  } as const;
  return (
    <AskBar {...args} defaultValue="Who is on call this week?">
      <Chip>scoped: Payments</Chip>
      <Chip onRemove={() => {}}>service:payment-webhook-v2</Chip>
    </AskBar>
  );
}
