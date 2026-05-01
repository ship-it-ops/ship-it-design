import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { ToastProvider, useToast } from './Toast';

const meta: Meta = { title: 'Components/Overlays/Toast' };
export default meta;

type Story = StoryObj;

function FireButtons() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: 'ok',
            title: 'Schema saved',
            description: '142 entity types committed.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: 'info',
            title: 'Sync running',
            description: 'github · 4 repos remaining',
          })
        }
      >
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            variant: 'warn',
            title: 'Token expiring',
            description: 'GitHub PAT expires in 3 days.',
          })
        }
      >
        Warn
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ variant: 'err', title: 'Sync failed', description: 'Notion · token rejected' })
        }
      >
        Error
      </Button>
    </div>
  );
}

export const Live: Story = {
  render: () => (
    <ToastProvider>
      <FireButtons />
    </ToastProvider>
  ),
};
