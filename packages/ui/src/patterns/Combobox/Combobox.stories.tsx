import type { Meta, StoryObj } from '@storybook/react-vite';

import { Combobox } from './Combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Patterns/Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Repository',
    placeholder: 'Search repos…',
    options: [
      'repo:shipit-api',
      'repo:shipit-web',
      'repo:shipit-ingest',
      'repo:shipit-graph',
      'repo:shipit-cli',
      'repo:shipit-docs',
    ],
  },
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Combobox>;

export const Default: Story = {};

export const RichOptions: Story = {
  args: {
    options: [
      { value: 'pay-svc', label: 'payment-webhook-v2', description: 'service · owned by Payments' },
      { value: 'ledger', label: 'ledger-core', description: 'service · go 1.22' },
      { value: 'notify', label: 'notify-dispatch', description: 'service · node 20' },
      { value: 'auth', label: 'auth-edge', description: 'service · rust' },
    ],
  },
};
