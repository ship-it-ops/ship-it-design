'use client';

import { Button, Input, WizardDialog } from '@ship-it-ui/ui';
import { useState } from 'react';

export default function Example() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [scope, setScope] = useState('');

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Add connector
      </Button>
      <WizardDialog
        open={open}
        onOpenChange={setOpen}
        title="Add a connector"
        description="Three steps. You can come back to this later."
        cancelLabel="Cancel"
        onCancel={() => setOpen(false)}
        onComplete={() => setOpen(false)}
        steps={[
          {
            id: 'name',
            label: 'Name',
            content: (
              <div className="flex flex-col gap-2">
                <label className="text-text-muted text-[12px]">Connector name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. github-prod"
                />
              </div>
            ),
            canAdvance: () => name.trim().length > 0,
          },
          {
            id: 'scope',
            label: 'Scope',
            content: (
              <div className="flex flex-col gap-2">
                <label className="text-text-muted text-[12px]">Scope</label>
                <Input
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="org/* or org/repo"
                />
              </div>
            ),
            canAdvance: () => scope.trim().length > 0,
          },
          {
            id: 'review',
            label: 'Review',
            content: (
              <ul className="m-0 flex list-none flex-col gap-2 p-0 font-mono text-[12px]">
                <li>
                  <span className="text-text-dim">name</span>{' '}
                  <span className="text-text">{name || '—'}</span>
                </li>
                <li>
                  <span className="text-text-dim">scope</span>{' '}
                  <span className="text-text">{scope || '—'}</span>
                </li>
              </ul>
            ),
          },
        ]}
      />
    </div>
  );
}
