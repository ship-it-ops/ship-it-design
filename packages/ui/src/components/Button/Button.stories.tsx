import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost', 'outline', 'destructive', 'success', 'link'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: { children: 'Build graph', variant: 'primary', size: 'md' },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Skip' } };
export const Outline: Story = { args: { variant: 'outline', children: 'More info' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Disconnect' } };
export const Success: Story = { args: { variant: 'success', children: 'Approve' } };
export const Link: Story = { args: { variant: 'link', children: 'Changelog', trailing: '→' } };

export const WithIcon: Story = { args: { icon: '✦', children: 'Build graph' } };
export const Loading: Story = { args: { loading: true, children: 'Running' } };
export const Disabled: Story = { args: { disabled: true } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const VariantMatrix: Story = {
  render: () => {
    const variants = ['primary', 'secondary', 'ghost', 'outline', 'destructive', 'success', 'link'] as const;
    return (
      <div className="grid grid-cols-[auto_repeat(3,1fr)] gap-3 items-center">
        <div />
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <div key={s} className="font-mono text-[10px] uppercase tracking-wider text-text-dim">{s}</div>
        ))}
        {variants.map((v) => (
          <>
            <div key={`${v}-label`} className="font-mono text-[11px] text-text-muted">{v}</div>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Button key={`${v}-${s}`} variant={v} size={s} icon={v === 'link' ? undefined : '✦'}>
                Action
              </Button>
            ))}
          </>
        ))}
      </div>
    );
  },
};
