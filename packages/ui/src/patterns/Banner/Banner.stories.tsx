import type { Meta, StoryObj } from '@storybook/react';

import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'Patterns/Feedback/Banner',
  component: Banner,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'ok', 'warn', 'err'] },
    sticky: { control: 'boolean' },
  },
  args: { variant: 'info' },
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  args: { variant: 'info' },
  render: (args) => (
    <Banner
      {...args}
      action={
        <a href="#" className="underline">
          What&apos;s new →
        </a>
      }
    >
      New: <strong>incident pinning</strong> in the graph.
    </Banner>
  ),
};

export const Warn: Story = {
  args: { variant: 'warn' },
  render: (args) => (
    <Banner
      {...args}
      action={
        <a href="#" className="underline">
          Upgrade →
        </a>
      }
    >
      You&apos;re on the trial plan — <strong>4 days remaining</strong>.
    </Banner>
  ),
};

export const Stack: Story = {
  render: () => (
    <div>
      <Banner variant="warn" action={<a href="#" className="underline">Upgrade →</a>}>
        Trial expires in <strong>4 days</strong>.
      </Banner>
      <Banner variant="info" action={<a href="#" className="underline">What&apos;s new →</a>}>
        New: <strong>incident pinning</strong> in the graph.
      </Banner>
    </div>
  ),
};
