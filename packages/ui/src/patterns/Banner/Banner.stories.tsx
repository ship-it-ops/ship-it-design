import type { Meta, StoryObj } from '@storybook/react-vite';

import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'Patterns/Feedback/Banner',
  component: Banner,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'ok', 'warn', 'err'] },
    sticky: { control: 'boolean' },
  },
  args: { tone: 'accent' },
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Banner>;

export const Accent: Story = {
  args: { tone: 'accent' },
  render: (args) => (
    <Banner
      {...args}
      action={
        <a href="https://example.com/changelog" className="underline">
          What&apos;s new →
        </a>
      }
    >
      New: <strong>incident pinning</strong> in the graph.
    </Banner>
  ),
};

export const Warn: Story = {
  args: { tone: 'warn' },
  render: (args) => (
    <Banner
      {...args}
      action={
        <a href="https://example.com/billing" className="underline">
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
      <Banner
        tone="warn"
        action={
          <a href="https://example.com/billing" className="underline">
            Upgrade →
          </a>
        }
      >
        Trial expires in <strong>4 days</strong>.
      </Banner>
      <Banner
        tone="accent"
        action={
          <a href="https://example.com/changelog" className="underline">
            What&apos;s new →
          </a>
        }
      >
        New: <strong>incident pinning</strong> in the graph.
      </Banner>
    </div>
  ),
};
