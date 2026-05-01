import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
    onClick: fn(),
    variant: 'primary',
    size: 'md',
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
Primary.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: String(args.children) }));
  await expect(args.onClick).toHaveBeenCalled();
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
Disabled.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: String(args.children) }));
  await expect(args.onClick).not.toHaveBeenCalled();
};

export const AsChildLink: Story = {
  args: {
    asChild: true,
  },
  render: (args) => (
    <Button {...args}>
      <a href="https://example.com">Visit example.com</a>
    </Button>
  ),
};
AsChildLink.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('link', { name: 'Visit example.com' })).toHaveAttribute(
    'href',
    'https://example.com',
  );
};
