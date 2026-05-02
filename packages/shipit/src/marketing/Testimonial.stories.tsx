import type { Meta, StoryObj } from '@storybook/react-vite';

import { Testimonial } from './Testimonial';

const meta: Meta<typeof Testimonial> = {
  title: 'ShipIt/Marketing/Testimonial',
  component: Testimonial,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Testimonial>;

export const Default: Story = {
  args: {
    quote:
      "ShipIt saved us an on-call rotation's worth of Slack pings in the first week. The graph is the source of truth we never had time to build.",
    author: 'Priya Khanna',
    role: 'Staff Engineer, Acme Payments',
    avatar: 'PK',
  },
};
