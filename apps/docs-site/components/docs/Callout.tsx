import { Alert } from '@ship-it-ui/ui';
import type { ReactNode } from 'react';


type Tone = 'note' | 'tip' | 'warn' | 'deprecated';

interface CalloutProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}

const toneToAlertTone: Record<Tone, 'accent' | 'ok' | 'warn' | 'err'> = {
  note: 'accent',
  tip: 'ok',
  warn: 'warn',
  deprecated: 'err',
};

export function Callout({ tone = 'note', title, children }: CalloutProps) {
  return (
    <div className="my-4">
      <Alert tone={toneToAlertTone[tone]} title={title}>
        {children}
      </Alert>
    </div>
  );
}
