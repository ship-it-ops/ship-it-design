import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../../components/Button/Button';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Patterns/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'ok', 'warn', 'err'] },
  },
  args: {
    variant: 'info',
    title: 'Schema preview ready',
    description: 'Review proposed entity types before we commit them to your graph.',
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-full max-w-[640px] flex-col gap-2">
      <Alert variant="info" title="Schema preview ready" description="Review before committing." />
      <Alert
        variant="ok"
        title="GitHub connected"
        description="4 repos imported · 12,841 files indexed."
      />
      <Alert
        variant="warn"
        title="GitHub token expires in 3 days"
        description="Generate a new token to avoid sync interruption."
        action={
          <Button size="sm" variant="ghost">
            Dismiss
          </Button>
        }
      />
      <Alert
        variant="err"
        title="Notion sync failed"
        description="Token rejected. Re-authorize the connector to continue."
      />
    </div>
  ),
};
