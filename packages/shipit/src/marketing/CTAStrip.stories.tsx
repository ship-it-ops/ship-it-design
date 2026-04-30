import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@ship-it/ui';

import { CTAStrip } from './CTAStrip';

const meta: Meta<typeof CTAStrip> = {
  title: 'ShipIt/Marketing/CTAStrip',
  component: CTAStrip,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof CTAStrip>;

export const Default: Story = {
  args: {
    title: 'Ready to graph your org?',
    description: 'Free for 14 days · no credit card · 5-minute setup.',
    actions: (
      <>
        <Button variant="primary" size="lg">
          Start free
        </Button>
        <Button variant="ghost" size="lg" trailing="→">
          Read the docs
        </Button>
      </>
    ),
  },
};
