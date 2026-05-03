import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../components/Button/Button';

import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Patterns/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: [undefined, 'accent', 'ok', 'warn', 'err'] },
  },
  args: {
    icon: '◇',
    title: 'No services yet',
    description: 'Connect a code source to start. Most teams begin with GitHub.',
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: (args) => (
    <div className="w-[280px]">
      <EmptyState
        {...args}
        action={
          <Button size="sm" variant="primary">
            Connect GitHub
          </Button>
        }
      />
    </div>
  ),
};

export const NoResults: Story = {
  render: () => (
    <div className="w-[280px]">
      <EmptyState
        icon="⌕"
        title="No results"
        description="Try a broader search. We looked across services, people, and docs."
        action={
          <Button size="sm" variant="ghost">
            Clear filters
          </Button>
        }
      />
    </div>
  ),
};

export const Suggestions: Story = {
  render: () => (
    <div className="w-[280px]">
      <EmptyState
        icon="✦"
        title="Ask anything"
        description="Try one of these to start, or write your own question above."
        chips={[
          { label: 'Who owns checkout?' },
          { label: 'Recent rollbacks' },
          { label: 'On-call this week' },
        ]}
      />
    </div>
  ),
};

export const Err: Story = {
  render: () => (
    <div className="w-[280px]">
      <EmptyState
        tone="err"
        icon="!"
        title="Sync failed"
        description="GitHub returned a 401. Your token may have expired."
        action={
          <Button size="sm" variant="destructive">
            Re-authorize
          </Button>
        }
      />
    </div>
  ),
};
