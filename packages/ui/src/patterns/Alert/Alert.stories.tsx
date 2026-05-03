import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../components/Button/Button';

import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Patterns/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'ok', 'warn', 'err'] },
  },
  args: {
    tone: 'accent',
    title: 'Schema preview ready',
    description: 'Review proposed entity types before we commit them to your graph.',
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex w-full max-w-[640px] flex-col gap-2">
      <Alert tone="accent" title="Schema preview ready" description="Review before committing." />
      <Alert
        tone="ok"
        title="GitHub connected"
        description="4 repos imported · 12,841 files indexed."
      />
      <Alert
        tone="warn"
        title="GitHub token expires in 3 days"
        description="Generate a new token to avoid sync interruption."
        action={
          <Button size="sm" variant="ghost">
            Dismiss
          </Button>
        }
      />
      <Alert
        tone="err"
        title="Notion sync failed"
        description="Token rejected. Re-authorize the connector to continue."
      />
    </div>
  ),
};
