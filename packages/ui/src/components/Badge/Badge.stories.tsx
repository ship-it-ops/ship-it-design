import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['neutral', 'accent', 'ok', 'warn', 'err', 'purple', 'pink', 'outline', 'solid'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    dot: { control: 'boolean' },
  },
  args: { children: 'BETA', variant: 'accent' },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(
        ['neutral', 'accent', 'ok', 'warn', 'err', 'purple', 'pink', 'outline', 'solid'] as const
      ).map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </div>
  ),
};
export const WithDots: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="ok" dot>
        synced
      </Badge>
      <Badge variant="warn" dot>
        stale
      </Badge>
      <Badge variant="err" dot>
        error
      </Badge>
      <Badge variant="accent" dot>
        live
      </Badge>
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="accent" size="sm">
        SM
      </Badge>
      <Badge variant="accent" size="md">
        MD
      </Badge>
      <Badge variant="accent" size="lg">
        LG
      </Badge>
    </div>
  ),
};
