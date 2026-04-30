import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Button } from '@ship-it/ui';

import { Hero } from './Hero';

const meta: Meta<typeof Hero> = {
  title: 'ShipIt/Marketing/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    eyebrow: (
      <Badge variant="accent" dot>
        v2.0 · shipped today
      </Badge>
    ),
    title: (
      <>
        Your org&apos;s knowledge, <span className="text-accent">as a graph.</span>
      </>
    ),
    description:
      'ShipIt turns repos, docs, tickets, and chat into a queryable graph — so on-call engineers stop asking the same question for the twelfth time.',
    actions: (
      <>
        <Button size="lg" variant="primary">
          Start free
        </Button>
        <Button size="lg" variant="secondary" trailing="→">
          Book a demo
        </Button>
      </>
    ),
  },
};
