import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '../Input/Input';
import { Field } from './Field';

const meta: Meta<typeof Field> = {
  title: 'Components/Inputs/Field',
  component: Field,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Field>;

export const WithLabel: Story = {
  render: () => (
    <Field label="Workspace name">
      {(p) => <Input placeholder="acme-payments" {...p} />}
    </Field>
  ),
};

export const WithHint: Story = {
  render: () => (
    <Field label="Domain" hint="Use lowercase, no spaces.">
      {(p) => <Input placeholder="acme" {...p} />}
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field label="Subdomain" error="Subdomain already taken">
      {(p) => <Input defaultValue="acme" {...p} />}
    </Field>
  ),
};

export const Required: Story = {
  render: () => (
    <Field label="Email" required>
      {(p) => <Input type="email" placeholder="you@example.com" {...p} />}
    </Field>
  ),
};
